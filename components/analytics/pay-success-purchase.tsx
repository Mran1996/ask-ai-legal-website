"use client"

import { useEffect, useRef } from "react"
import { useConsent } from "@/components/privacy/consent-provider"
import { CASE_FILE_REVIEW_PRICE_USD } from "@/lib/site-config"
import { pixelTrack } from "@/lib/meta-pixel"

/** Fires Meta Purchase once per mount when analytics consent is granted. */
export function PaySuccessPurchase() {
  const { analyticsAllowed, hasChosen } = useConsent()
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current || !hasChosen || !analyticsAllowed) return

    fired.current = true
    pixelTrack("Purchase", {
      value: CASE_FILE_REVIEW_PRICE_USD,
      currency: "USD",
    })
  }, [analyticsAllowed, hasChosen])

  return null
}
