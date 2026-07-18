"use client"

import { createElement } from "react"
import Script from "next/script"

/**
 * Stripe Buy Button (hosted). The publishable key is public by design; the
 * buy-button is configured in the Stripe Dashboard. Both can be overridden via
 * NEXT_PUBLIC_* env vars, with the current live values as fallback so the page
 * works without extra env setup.
 */
const BUY_BUTTON_ID =
  process.env.NEXT_PUBLIC_STRIPE_BUY_BUTTON_ID ?? "buy_btn_1TueLLD8ZPcBhwZR2lr4r16u"
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
  "pk_live_51REEH2D8ZPcBhwZRjHdMz4BU2un8ae0Y7XKNi7fIynYu6K2EnoZuaNRh2RKynkaty4Gn8DrEC14l8F5stkMSGE0i00lxIZJnKP"

export function StripeBuyButton() {
  return (
    <>
      <Script src="https://js.stripe.com/v3/buy-button.js" strategy="afterInteractive" />
      {createElement("stripe-buy-button", {
        "buy-button-id": BUY_BUTTON_ID,
        "publishable-key": PUBLISHABLE_KEY,
      })}
    </>
  )
}
