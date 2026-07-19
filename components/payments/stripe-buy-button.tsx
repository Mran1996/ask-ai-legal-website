"use client"

import { createElement, useState } from "react"
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
  const [ready, setReady] = useState(false)

  return (
    <div className="relative min-h-[48px] min-w-[220px]">
      {/* Load the Stripe script as soon as possible instead of waiting for full hydration. */}
      <Script
        src="https://js.stripe.com/v3/buy-button.js"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
        onLoad={() => setReady(true)}
      />

      {/* Instant placeholder so there is no blank gap or layout shift while Stripe loads. */}
      {!ready && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-gold-dark"
          aria-hidden
        >
          <span className="animate-pulse text-sm font-semibold text-white/90">
            Loading secure checkout…
          </span>
        </div>
      )}

      {createElement("stripe-buy-button", {
        "buy-button-id": BUY_BUTTON_ID,
        "publishable-key": PUBLISHABLE_KEY,
      })}
    </div>
  )
}
