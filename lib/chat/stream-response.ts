import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  streamText,
  type UIMessage,
} from "ai"
import type { Locale } from "@/lib/i18n/languages"
import { buildFallbackAnswer } from "@/lib/chat/search"
import { stripMarkdownForChat } from "@/lib/chat/sanitize-response"
import { buildSystemPrompt } from "@/lib/chat/system-prompt"
import type { KnowledgeChunk } from "@/lib/chat/types"
import { hasLlmProviderKey, resolveChatModel, type LlmProviderId } from "@/lib/chat/model-providers"

export function getLastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]
    if (msg?.role !== "user") continue
    return msg.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("")
  }
  return ""
}

/** Exclude client-only welcome bubble from model context */
export function messagesForModel(messages: UIMessage[]): UIMessage[] {
  return messages.filter((m) => m.id !== "welcome")
}

export function streamFaqAnswer(text: string, originalMessages: UIMessage[]): Response {
  const stream = createUIMessageStream({
    originalMessages,
    execute: ({ writer }) => {
      const id = generateId()
      writer.write({ type: "text-start", id })
      writer.write({ type: "text-delta", id, delta: text })
      writer.write({ type: "text-end", id })
    },
  })
  return createUIMessageStreamResponse({ stream })
}

export async function streamLlmAnswer(
  provider: LlmProviderId,
  locale: Locale,
  messages: UIMessage[],
  contextChunks: KnowledgeChunk[]
): Promise<Response> {
  const modelMessages = await convertToModelMessages(messagesForModel(messages))

  const result = streamText({
    model: resolveChatModel(provider),
    system: buildSystemPrompt(locale, contextChunks),
    messages: modelMessages,
    temperature: 0.3,
    maxOutputTokens: 800,
  })

  return result.toUIMessageStreamResponse({ originalMessages: messages })
}

export function buildFaqResponse(
  query: string,
  locale: Locale,
  originalMessages: UIMessage[]
): Response {
  const answer = stripMarkdownForChat(buildFallbackAnswer(query, locale))
  return streamFaqAnswer(answer, originalMessages)
}

export { hasLlmProviderKey }
