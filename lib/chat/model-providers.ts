import { createOpenAI } from "@ai-sdk/openai"
import type { LanguageModel } from "ai"
import type { ChatProviderId } from "@/lib/chat/providers"
import { getNvidiaApiKey, getOpenAiApiKey, getOpenRouterApiKey } from "@/lib/chat/env-keys"

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

const DEFAULT_NVIDIA_MODEL = "qwen/qwen3-next-80b-a3b-instruct"
const DEFAULT_OPENROUTER_MODEL = "qwen/qwen-2.5-72b-instruct"
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini"

export type LlmProviderId = Exclude<ChatProviderId, "faq" | "google">

export function hasLlmProviderKey(provider: LlmProviderId): boolean {
  switch (provider) {
    case "openai":
      return Boolean(getOpenAiApiKey())
    case "openrouter":
      return Boolean(getOpenRouterApiKey())
    case "nvidia":
      return Boolean(getNvidiaApiKey())
  }
}

export function resolveChatModel(provider: LlmProviderId): LanguageModel {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://askailegal.com"

  switch (provider) {
    case "nvidia": {
      const nvidia = createOpenAI({
        baseURL: NVIDIA_BASE_URL,
        apiKey: getNvidiaApiKey(),
        name: "nvidia",
      })
      const modelId = process.env.NVIDIA_MODEL?.trim() || DEFAULT_NVIDIA_MODEL
      return nvidia.chat(modelId)
    }
    case "openrouter": {
      const openrouter = createOpenAI({
        baseURL: OPENROUTER_BASE_URL,
        apiKey: getOpenRouterApiKey(),
        name: "openrouter",
        headers: {
          "HTTP-Referer": siteUrl,
          "X-Title": "Ask AI Legal",
        },
      })
      const modelId = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL
      return openrouter.chat(modelId)
    }
    case "openai": {
      const openaiProvider = createOpenAI({
        apiKey: getOpenAiApiKey(),
      })
      const modelId = process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL
      return openaiProvider.chat(modelId)
    }
  }
}
