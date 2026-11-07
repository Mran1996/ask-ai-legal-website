import posthog from "posthog-js"
import { analyticsAllowed, readStoredConsent } from "@/lib/privacy-consent"
import { pixelTrack } from "@/lib/meta-pixel"

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

/** A key page action, sent to Google Analytics and the Meta Pixel. Both load only after the visitor consents. */
export function trackSiteAction(action: string, detail?: string): void {
  if (typeof window === "undefined") return
  try {
    window.gtag?.("event", action, detail ? { item: detail } : undefined)
    pixelTrack("ViewContent", { content_name: detail ? `${action}: ${detail}` : action })
  } catch {
    // Analytics must never break the product UI
  }
  trackEvent(action, detail ? { item: detail } : undefined)
}

/** A Buy button click, sent to Google Analytics. gtag only exists after the visitor consents. */
export function trackBeginCheckout(plan: string, value: number): void {
  if (typeof window === "undefined") return
  try {
    window.gtag?.("event", "begin_checkout", {
      currency: "USD",
      value,
      items: [{ item_name: plan, price: value, quantity: 1 }],
      transport_type: "beacon",
    })
  } catch {
    // Analytics must never break the product UI
  }
  trackEvent("begin_checkout", { plan, value })
}

/** A finished payment, sent to Google Analytics once per browser tab so a page reload is not a second sale. */
export function trackPurchase(item: string, value?: number): void {
  if (typeof window === "undefined") return
  try {
    const key = `ga_purchase_${item}`
    if (window.sessionStorage.getItem(key)) return
    window.sessionStorage.setItem(key, "1")
    window.gtag?.("event", "purchase", {
      transaction_id: window.crypto.randomUUID(),
      currency: "USD",
      value,
      items: [{ item_name: item, price: value, quantity: 1 }],
    })
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
