"use client"

import { useEffect, useRef } from "react"
import posthog from "posthog-js"
import { usePathname, useSearchParams } from "next/navigation"
import { useConsent } from "@/components/privacy/consent-provider"

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { analyticsAllowed, hasChosen } = useConsent()
  const started = useRef(false)

  useEffect(() => {
    if (!KEY || !hasChosen) return

    if (!analyticsAllowed) {
      if (started.current) {
        posthog.opt_out_capturing()
      }
      return
    }

    if (started.current) {
      posthog.opt_in_capturing()
      return
    }

    started.current = true
    posthog.init(KEY, {
      api_host: HOST,
      person_profiles: "identified_only",
      capture_pageview: false,
      capture_pageleave: true,
      opt_out_capturing_by_default: false,
    })
  }, [analyticsAllowed, hasChosen])

  return <>{children}</>
}

/** Manual pageviews for App Router navigations. */
export function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { analyticsAllowed, hasChosen } = useConsent()

  useEffect(() => {
    if (!KEY || !pathname || !hasChosen || !analyticsAllowed) return
    const qs = searchParams?.toString()
    const url = qs ? `${pathname}?${qs}` : pathname
    posthog.capture("$pageview", { $current_url: url })
  }, [pathname, searchParams, analyticsAllowed, hasChosen])

  return null
}
