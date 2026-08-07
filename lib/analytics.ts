import posthog from "posthog-js"
import { analyticsAllowed, readStoredConsent } from "@/lib/privacy-consent"

export function trackEvent(
  event: string,
  properties?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === "undefined") return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
  if (!analyticsAllowed(readStoredConsent())) return
  try {
    posthog.capture(event, properties)
  } catch {
    // Analytics must never break the product UI
  }
}

/** Chat query / topic — store a short category or truncated text, not full legal facts. */
export function trackChatTopic(raw: string): void {
  const trimmed = raw.trim().slice(0, 80)
  if (!trimmed) return
  trackEvent("chat_message_sent", {
    topic_preview: trimmed,
    length: raw.trim().length,
  })
}
