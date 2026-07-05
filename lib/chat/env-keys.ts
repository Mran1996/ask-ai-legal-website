/** Strip whitespace and optional surrounding quotes from env secrets. */
export function cleanEnvKey(value: string | undefined): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim().replace(/^["']|["']$/g, "")
  if (!trimmed || trimmed.length < 10 || trimmed.startsWith("your-")) return undefined
  return trimmed
}

/** NVIDIA NIM key, or QWEN_API_KEY when it holds an nvapi- NVIDIA key. */
export function getNvidiaApiKey(): string | undefined {
  return cleanEnvKey(process.env.NVIDIA_API_KEY) ?? cleanEnvKey(process.env.QWEN_API_KEY)
}

export function getOpenRouterApiKey(): string | undefined {
  return cleanEnvKey(process.env.OPENROUTER_API_KEY)
}

export function getOpenAiApiKey(): string | undefined {
  return cleanEnvKey(process.env.OPENAI_API_KEY)
}
