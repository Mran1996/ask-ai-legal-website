"use client"

import { useEffect, useRef } from "react"
import { useConsent } from "@/components/privacy/consent-provider"
import { pixelTrack } from "@/lib/meta-pixel"

/**
 * Fires Meta Purchase once per mount when analytics consent is granted.
 * `value` is the item paid for (3997 purchase / 125 maintenance); omitted when unknown.
 */
export function PaySuccessPurchase({ value }: { value?: number }) {
  const { analyticsAllowed, hasChosen } = useConsent()
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current || !hasChosen || !analyticsAllowed) return

    fired.current = true
    pixelTrack("Purchase", value === undefined ? { currency: "USD" } : { value, currency: "USD" })
  }, [analyticsAllowed, hasChosen, value])

  return null
}
