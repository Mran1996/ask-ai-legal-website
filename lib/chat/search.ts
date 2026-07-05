import type { Locale } from "@/lib/i18n/languages"
import { buildKnowledgeForLocale } from "./knowledge"
import { stripMarkdownForChat } from "./sanitize-response"
import type { KnowledgeChunk } from "./types"

function scoreChunk(query: string, chunk: KnowledgeChunk): number {
  const queryTokens = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s@.-]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1)

  if (queryTokens.length === 0) return 0

  const haystack = `${chunk.title} ${chunk.content} ${chunk.keywords.join(" ")}`.toLowerCase()
  let score = 0

  for (const token of queryTokens) {
    if (haystack.includes(token)) score += 2
    if (chunk.keywords.some((k) => k.includes(token) || token.includes(k))) score += 3
    if (chunk.title.toLowerCase().includes(token)) score += 4
  }

  if (/service|offer|what do you|what we do|handle/i.test(query)) {
    if (chunk.category === "services" || chunk.category === "service") score += 6
  }

  if (/law firm|attorney|advice|price|cost|quote|upload|email|hindi|language/i.test(query)) {
    if (chunk.category === "faq" || chunk.category === "contact" || chunk.category === "pricing") {
      score += 2
    }
  }

  return score
}

export function searchKnowledge(query: string, locale: Locale, limit = 6): KnowledgeChunk[] {
  const primary = buildKnowledgeForLocale(locale)
  const fallback = locale === "en" ? [] : buildKnowledgeForLocale("en")

  const ranked = [...primary, ...fallback]
    .map((chunk) => ({ chunk, score: scoreChunk(query, chunk) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)

  const seen = new Set<string>()
  const results: KnowledgeChunk[] = []

  for (const { chunk } of ranked) {
    if (seen.has(chunk.id)) continue
    seen.add(chunk.id)
    results.push(chunk)
    if (results.length >= limit) break
  }

  if (results.length === 0) {
    return primary.filter((c) => c.category === "contact" || c.category === "brand").slice(0, 3)
  }

  return results
}

export function formatContext(chunks: KnowledgeChunk[]): string {
  return chunks
    .map((c) => `[${c.category.toUpperCase()}] ${c.title}\n${c.content}`)
    .join("\n\n---\n\n")
}

export function buildFallbackAnswer(query: string, locale: Locale): string {
  const chunks = searchKnowledge(query, locale, 4)
  const top = chunks[0]
  if (!top) {
    return locale === "hi"
      ? "मैं इस पर निश्चित नहीं हूँ। कृपया support@askailegal.com पर ईमेल करें — अपने दस्तावेज़ संलग्न करें ताकि हम आपकी स्थिति समझकर सटीक कोट दे सकें।"
      : "I'm not certain about that from our site information. Please email support@askailegal.com with your details and attach any documents so we can review your situation and provide an accurate custom quote."
  }

  const related = chunks.slice(1, 3)
  let body = top.content

  if (related.length > 0) {
    const extra = related.map((c) => c.content).join(" ")
    body = `${body} ${extra}`.trim()
  }

  return stripMarkdownForChat(body)
}
