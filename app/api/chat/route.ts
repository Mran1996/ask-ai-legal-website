import type { Locale } from "@/lib/i18n/languages"
import { searchKnowledge } from "@/lib/chat/search"
import { chatBodyTooLarge, isAllowedChatOrigin } from "@/lib/chat/api-guard"
import { getPreferredLlmProvider, type ChatProviderId } from "@/lib/chat/providers"
import { allowChatRequest, clientIp } from "@/lib/chat/rate-limit"
import { SUPPORT_EMAIL } from "@/lib/site-config"
import {
  buildFaqResponse,
  getLastUserText,
  hasLlmProviderKey,
  streamFaqAnswer,
  streamLlmAnswer,
} from "@/lib/chat/stream-response"
import type { LlmProviderId } from "@/lib/chat/model-providers"
import type { UIMessage } from "ai"

export const maxDuration = 30

function isLlmProvider(provider: ChatProviderId): provider is LlmProviderId {
  return provider === "openai" || provider === "openrouter" || provider === "nvidia"
}

export async function POST(req: Request) {
  if (!isAllowedChatOrigin(req)) {
    return new Response("Forbidden", { status: 403 })
  }

  if (chatBodyTooLarge(req)) {
    return new Response("Payload too large", { status: 413 })
  }

  let locale: Locale = "en"
  let messages: UIMessage[] = []

  try {
    const body = (await req.json()) as {
      messages?: UIMessage[]
      locale?: Locale
    }

    messages = body.messages ?? []
    locale = (body.locale ?? "en") as Locale

    if (!allowChatRequest(clientIp(req))) {
      return streamFaqAnswer(
        `You have sent a lot of messages in a short time, so the chat is paused for a little while. Please try again later, or email ${SUPPORT_EMAIL} and we will answer you there.`,
        messages
      )
    }
    const lastQuery = getLastUserText(messages)
    const contextChunks = searchKnowledge(lastQuery, locale, 8)

    const provider = getPreferredLlmProvider()

    if (isLlmProvider(provider) && hasLlmProviderKey(provider)) {
      try {
        return await streamLlmAnswer(provider, locale, messages, contextChunks)
      } catch (llmError) {
        console.error(`${provider} chat failed, falling back to FAQ:`, llmError)
        return buildFaqResponse(lastQuery, locale, messages)
      }
    }

    return buildFaqResponse(lastQuery, locale, messages)
  } catch (error) {
    console.error("Chat API error:", error)
    const lastQuery = getLastUserText(messages)
    if (messages.length > 0) {
      return buildFaqResponse(lastQuery, locale, messages)
    }

    return buildFaqResponse(
      "",
      locale,
      messages.length > 0
        ? messages
        : [
            {
              id: "error-fallback",
              role: "user",
              parts: [{ type: "text", text: "help" }],
            },
          ]
    )
  }
}
