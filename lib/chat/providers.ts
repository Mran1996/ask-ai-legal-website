import { getNvidiaApiKey, getOpenAiApiKey, getOpenRouterApiKey } from "@/lib/chat/env-keys"

export type ChatProviderId = "faq" | "openai" | "google" | "openrouter" | "nvidia"

export function getConfiguredProviders(): ChatProviderId[] {
  const providers: ChatProviderId[] = ["faq"]
  if (getNvidiaApiKey()) providers.push("nvidia")
  if (getOpenRouterApiKey()) providers.push("openrouter")
  if (getOpenAiApiKey()) providers.push("openai")
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()) providers.push("google")
  return providers
}

export function getPreferredLlmProvider(): ChatProviderId {
  const fromEnv = process.env.CHAT_MODEL_PROVIDER?.trim().toLowerCase()
  const configured = getConfiguredProviders()

  if (fromEnv === "nvidia" && configured.includes("nvidia")) return "nvidia"
  if (fromEnv === "openrouter" && configured.includes("openrouter")) return "openrouter"
  if (fromEnv === "openai" && configured.includes("openai")) return "openai"
  if (fromEnv === "google" && configured.includes("google")) return "google"

  // Default priority when CHAT_MODEL_PROVIDER is unset: NVIDIA → OpenRouter → OpenAI
  if (configured.includes("nvidia")) return "nvidia"
  if (configured.includes("openrouter")) return "openrouter"
  if (configured.includes("openai")) return "openai"
  if (configured.includes("google")) return "google"

  return "faq"
}
