import { getTranslations } from "@/lib/i18n/translations"
import type { Locale } from "@/lib/i18n/languages"
import {
  SITE_BRAND_NAME,
  SITE_DISCLAIMER,
  SITE_TAGLINE,
  SUPPORT_EMAIL,
} from "@/lib/site-config"
import type { KnowledgeChunk } from "./types"

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s@.-]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1)
}

function chunk(
  locale: Locale,
  category: string,
  title: string,
  content: string,
  extraKeywords: string[] = []
): KnowledgeChunk {
  const keywords = [...new Set([...tokenize(`${title} ${content}`), ...extraKeywords.map((k) => k.toLowerCase())])]
  return {
    id: `${locale}-${category}-${title}`.replace(/\s+/g, "-").toLowerCase(),
    locale,
    category,
    title,
    content,
    keywords,
  }
}

export function buildKnowledgeForLocale(locale: Locale): KnowledgeChunk[] {
  const t = getTranslations(locale)
  const chunks: KnowledgeChunk[] = [
    chunk(locale, "brand", SITE_BRAND_NAME, `${SITE_TAGLINE} ${SITE_DISCLAIMER}`, [
      "ask ai legal",
      "law firm",
      "legal advice",
    ]),
    chunk(
      locale,
      "contact",
      "Contact support",
      `Use the contact page or email ${SUPPORT_EMAIL} to book an installation consultation or ask about installation, maintenance, support, or billing.`,
      ["support", "email", "consultation", "price", "cost", "contact"]
    ),
    chunk(locale, "pricing", "Pricing", t.faq.items[0]?.a + " " + t.compare.subtitle, [
      "price",
      "cost",
      "afford",
      "maintenance",
      "monthly",
      "purchase",
      "quote",
    ]),
    chunk(locale, "services", "Services overview", t.services.intro + " " + t.services.importantText, [
      "services",
      "what do you offer",
      "what we do",
    ]),
  ]

  for (const item of t.services.items) {
    chunks.push(
      chunk(locale, "service", item.title, item.description, tokenize(item.title))
    )
  }

  const pageItem = t.servicesPage.items
  for (let i = 0; i < t.services.items.length; i++) {
    const service = t.services.items[i]
    const extra = pageItem[i]
    if (!service || !extra) continue
    chunks.push(
      chunk(
        locale,
        "service-detail",
        `${service.title} — full detail`,
        `${service.description} ${extra.detail} Includes: ${extra.includes.join("; ")}.`,
        [...tokenize(service.title), "services page", "what you receive"]
      )
    )
  }

  chunks.push(
    chunk(
      locale,
      "services-page",
      t.servicesPage.title,
      `${t.servicesPage.intro} ${t.servicesPage.disclaimer.text}`,
      ["services page", "all services", "what we do"]
    )
  )

  for (const step of t.process.steps) {
    chunks.push(chunk(locale, "process", step.title, step.body, ["process", "how it works"]))
  }

  chunks.push(
    chunk(locale, "consultation", t.consultation.cardTitle, `${t.consultation.body1} ${t.consultation.body2} ${t.consultation.timing}`, [
      "consultation",
      "installation",
      "computer",
    ])
  )

  for (const item of t.faq.items) {
    chunks.push(chunk(locale, "faq", item.q, item.a, tokenize(item.q)))
  }

  chunks.push(
    chunk(locale, "compare", "vs attorney", t.compare.subtitle, [
      "attorney",
      "lawyer",
      "different",
      "cheaper",
    ])
  )

  chunks.push(
    chunk(
      locale,
      "cta",
      "Get started",
      `${t.cta.body} Email ${SUPPORT_EMAIL}. ${t.cta.disclaimer}`,
      ["start", "begin", "help"]
    )
  )

  return chunks
}

export function getAllKnowledge(locales: Locale[] = ["en", "hi"]): KnowledgeChunk[] {
  return locales.flatMap((locale) => buildKnowledgeForLocale(locale))
}
