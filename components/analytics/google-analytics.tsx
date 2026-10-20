"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useConsent } from "@/components/privacy/consent-provider"

/** Google Analytics 4. The measurement ID is public; it can be overridden with NEXT_PUBLIC_GA_ID. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-FGWF3RKC72"

type Gtag = (...args: unknown[]) => void
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

/** Loads gtag.js only after the visitor accepts analytics, then sends a page view on every route change. */
export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { analyticsAllowed, hasChosen } = useConsent()
  const loaded = useRef(false)

  useEffect(() => {
    if (!GA_ID || !hasChosen || !analyticsAllowed || loaded.current) return
    loaded.current = true
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      // gtag.js expects the arguments object itself.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
    window.gtag("js", new Date())
    window.gtag("config", GA_ID, { send_page_view: false })
    const script = document.createElement("script")
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(script)
  }, [analyticsAllowed, hasChosen])

  useEffect(() => {
    if (!loaded.current || !window.gtag || !pathname) return
    const query = searchParams?.toString()
    window.gtag("event", "page_view", {
      page_path: query ? `${pathname}?${query}` : pathname,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams, analyticsAllowed, hasChosen])

  return null
}
