"use client"

import { useEffect, useRef } from "react"
import { useConsent } from "@/components/privacy/consent-provider"
import { trackPurchase } from "@/lib/analytics"
import { pixelTrack } from "@/lib/meta-pixel"

/**
 * Fires Meta Purchase once per mount, and the Google Analytics purchase, when analytics consent is granted.
 * `value` is the item paid for (2997 purchase / 125 maintenance); omitted when unknown.
 */
export function PaySuccessPurchase({ item, value }: { item: string; value?: number }) {
  const { analyticsAllowed, hasChosen } = useConsent()
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current || !hasChosen || !analyticsAllowed) return

    fired.current = true
    pixelTrack("Purchase", value === undefined ? { currency: "USD" } : { value, currency: "USD" })
  }, [analyticsAllowed, hasChosen, value])

  useEffect(() => {
    if (!hasChosen || !analyticsAllowed) return

    // gtag can load a moment after this page does, so wait up to 5 seconds for it.
    let tries = 0
    const timer = window.setInterval(() => {
      tries += 1
      if (!window.gtag && tries < 20) return
      window.clearInterval(timer)
      if (window.gtag) trackPurchase(item, value)
    }, 250)
    return () => window.clearInterval(timer)
  }, [analyticsAllowed, hasChosen, item, value])

  return null
}
