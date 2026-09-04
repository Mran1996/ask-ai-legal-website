/** localStorage key for the user's cookie / analytics choice. */
export const CONSENT_STORAGE_KEY = "ask-ai-legal-cookie-consent"

export type CookieConsentChoice = "accepted" | "denied"

/** True when the browser sends a Global Privacy Control opt-out signal. */
export function hasGlobalPrivacyControl(): boolean {
  if (typeof navigator === "undefined") return false
  return (
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl ===
    true
  )
}

export function readStoredConsent(): CookieConsentChoice | null {
  if (typeof window === "undefined") return null
  if (hasGlobalPrivacyControl()) return "denied"
  const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
  if (stored === "accepted" || stored === "denied") return stored
  return null
}

export function storeConsent(choice: CookieConsentChoice): void {
  localStorage.setItem(CONSENT_STORAGE_KEY, choice)
}

export function clearConsent(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CONSENT_STORAGE_KEY)
}

export function analyticsAllowed(choice: CookieConsentChoice | null): boolean {
  return choice === "accepted"
}
