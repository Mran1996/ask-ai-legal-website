const OPS_TOKEN_STORAGE_KEY = "ask-ai-legal-ops-token"

export function getOpsToken(): string | null {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem(OPS_TOKEN_STORAGE_KEY)
}

export function setOpsToken(token: string): void {
  sessionStorage.setItem(OPS_TOKEN_STORAGE_KEY, token.trim())
}

export function clearOpsToken(): void {
  sessionStorage.removeItem(OPS_TOKEN_STORAGE_KEY)
}
