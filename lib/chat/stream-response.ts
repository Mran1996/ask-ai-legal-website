import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  streamText,
  type LanguageModel,
  type UIMessage,
} from "ai"
import type { Locale } from "@/lib/i18n/languages"
import { buildFallbackAnswer } from "@/lib/chat/search"
import { stripMarkdownForChat } from "@/lib/chat/sanitize-response"
import { buildSystemPrompt } from "@/lib/chat/system-prompt"
import type { KnowledgeChunk } from "@/lib/chat/types"
import { chatModelCandidates, hasLlmProviderKey, type LlmProviderId } from "@/lib/chat/model-providers"

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

/** Exclude client-only welcome bubble from model context; keep only recent turns so long chats stay cheap. */
export function messagesForModel(messages: UIMessage[]): UIMessage[] {
  return messages.filter((m) => m.id !== "welcome").slice(-12)
}

/** How long a model gets to start answering before the next one is tried. */
const FIRST_WORDS_TIMEOUT_MS = 9_000

function modelName(model: LanguageModel): string {
  return typeof model === "string" ? model : model.modelId
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
  const system = buildSystemPrompt(locale, contextChunks)
  const models = chatModelCandidates(provider)
  const query = getLastUserText(messages)

  const stream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      const id = generateId()
      writer.write({ type: "text-start", id })

      // Try each model until one starts answering. Errors only show up once the stream is read,
      // so a retired or overloaded model is caught here instead of reaching the visitor.
      for (const model of models) {
        const timer = new AbortController()
        const timeout = setTimeout(() => timer.abort(), FIRST_WORDS_TIMEOUT_MS)
        let started = false
        try {
          const result = streamText({
            model,
            system,
            messages: modelMessages,
            temperature: 0.3,
            maxOutputTokens: 800,
            maxRetries: 0,
            abortSignal: timer.signal,
          })
          for await (const part of result.fullStream) {
            if (part.type === "error") throw part.error
            if (part.type === "text-delta" && part.text) {
              if (!started) clearTimeout(timeout)
              started = true
              writer.write({ type: "text-delta", id, delta: part.text })
            }
          }
          if (!started) console.error(`chat model ${modelName(model)} gave no answer in time`)
        } catch (error) {
          console.error(`chat model ${modelName(model)} failed${started ? " mid-answer" : ""}:`, error)
        } finally {
          clearTimeout(timeout)
        }
        if (started) {
          writer.write({ type: "text-end", id })
          return
        }
      }

      writer.write({ type: "text-delta", id, delta: stripMarkdownForChat(buildFallbackAnswer(query, locale)) })
      writer.write({ type: "text-end", id })
    },
  })
  return createUIMessageStreamResponse({ stream })
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
