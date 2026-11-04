"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useConsent } from "@/components/privacy/consent-provider"

/** Microsoft Clarity project ID. It is public; it can be overridden with NEXT_PUBLIC_CLARITY_ID. */
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "z890maek4g"

type Clarity = ((...args: unknown[]) => void) & { q?: unknown[][] }
declare global {
  interface Window {
    clarity?: Clarity
  }
}

/**
 * Heatmaps and session recordings. Loads only after the visitor accepts analytics, never on
 * the /ops staff pages, and stops and clears its cookies if the visitor withdraws consent.
 */
export function MicrosoftClarity() {
  const onOps = usePathname()?.startsWith("/ops") ?? false
  const { analyticsAllowed, hasChosen } = useConsent()
  const loaded = useRef(false)

  useEffect(() => {
    if (!CLARITY_ID) return
    if (!hasChosen || !analyticsAllowed) {
      if (loaded.current) window.clarity?.("consent", false)
      return
    }
    if (onOps) return

    if (!loaded.current) {
      loaded.current = true
      const clarity: Clarity = (...args) => {
        clarity.q = clarity.q || []
        clarity.q.push(args)
      }
      window.clarity = window.clarity || clarity
      const script = document.createElement("script")
      script.async = true
      script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`
      document.head.appendChild(script)
    }
    window.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" })
  }, [analyticsAllowed, hasChosen, onOps])

  return null
}
