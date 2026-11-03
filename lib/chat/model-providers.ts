import { createOpenAI } from "@ai-sdk/openai"
import type { LanguageModel } from "ai"
import type { ChatProviderId } from "@/lib/chat/providers"
import { getNvidiaApiKey, getOpenAiApiKey, getOpenRouterApiKey } from "@/lib/chat/env-keys"

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

// NVIDIA's API is free. Models get retired without notice (qwen3-next went 410 Gone in Nov 2026),
// so the chat tries these in order and moves on when one fails.
const NVIDIA_MODELS = [
  "nvidia/nemotron-3-ultra-550b-a55b",
  "nvidia/llama-3.1-nemotron-70b-instruct",
  "deepseek-ai/deepseek-v4.1-flash",
]
// OpenRouter backup uses only ":free" models so a busy or abused chat can never spend account funds.
const OPENROUTER_FREE_MODELS = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
]
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

/** Free models that "think" first take 9+ seconds to say anything; the site chat only needs short answers. */
const withoutReasoning: typeof fetch = (input, init) => {
  if (typeof init?.body === "string") {
    try {
      init = { ...init, body: JSON.stringify({ ...JSON.parse(init.body), reasoning: { enabled: false } }) }
    } catch {
      // not JSON; send as is
    }
  }
  return fetch(input, init)
}

function modelList(envValue: string | undefined, defaults: string[]): string[] {
  const fromEnv = envValue?.trim()
  return fromEnv ? [fromEnv, ...defaults.filter((m) => m !== fromEnv)] : defaults
}

function providerModels(provider: LlmProviderId): LanguageModel[] {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://askailegal.com"

  switch (provider) {
    case "nvidia": {
      const nvidia = createOpenAI({
        baseURL: NVIDIA_BASE_URL,
        apiKey: getNvidiaApiKey(),
        name: "nvidia",
      })
      return modelList(process.env.NVIDIA_MODEL, NVIDIA_MODELS).map((id) => nvidia.chat(id))
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
        fetch: withoutReasoning,
      })
      const fromEnv = process.env.OPENROUTER_MODEL?.trim()
      const ids = modelList(fromEnv?.endsWith(":free") ? fromEnv : undefined, OPENROUTER_FREE_MODELS)
      return ids.map((id) => openrouter.chat(id))
    }
    case "openai": {
      const openaiProvider = createOpenAI({
        apiKey: getOpenAiApiKey(),
      })
      return [openaiProvider.chat(process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL)]
    }
  }
}

/** Models to try in order: the chosen provider first, then the free backups that have keys.
 *  OpenAI is paid, so it is used only when chosen on purpose, never as an automatic backup. */
export function chatModelCandidates(preferred: LlmProviderId): LanguageModel[] {
  const order: LlmProviderId[] = [preferred, ...(["nvidia", "openrouter"] as const).filter((p) => p !== preferred)]
  return order.filter(hasLlmProviderKey).flatMap(providerModels)
}
