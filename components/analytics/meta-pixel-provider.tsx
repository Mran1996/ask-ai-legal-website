"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useConsent } from "@/components/privacy/consent-provider"
import { initMetaPixel, pixelPageView } from "@/lib/meta-pixel"

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export function MetaPixelProvider({ children }: { children: React.ReactNode }) {
  const { analyticsAllowed, hasChosen } = useConsent()
  const started = useRef(false)

  useEffect(() => {
    if (!PIXEL_ID || !hasChosen || !analyticsAllowed) return
    if (started.current) return

    started.current = true
    initMetaPixel()
  }, [analyticsAllowed, hasChosen])

  return <>{children}</>
}

/** Route pageviews after consent — skips first run (initMetaPixel already tracks PageView). */
export function MetaPixelPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { analyticsAllowed, hasChosen } = useConsent()
  const skipFirst = useRef(true)

  useEffect(() => {
    if (!PIXEL_ID || !pathname || !hasChosen || !analyticsAllowed) return

    if (skipFirst.current) {
      skipFirst.current = false
      return
    }

    pixelPageView()
  }, [pathname, searchParams, analyticsAllowed, hasChosen])

  return null
}
