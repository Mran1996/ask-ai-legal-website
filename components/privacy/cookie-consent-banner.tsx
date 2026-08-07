"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useConsent } from "@/components/privacy/consent-provider"

export function CookieConsentBanner() {
  const { hasChosen, accept, deny } = useConsent()

  useEffect(() => {
    if (hasChosen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [hasChosen])

  if (hasChosen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-navy/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="w-full max-w-lg rounded-sm border border-navy/10 bg-cream p-6 shadow-xl">
        <h2
          id="cookie-consent-title"
          className="font-display text-xl font-semibold text-navy"
        >
          Cookie &amp; data collection
        </h2>
        <p id="cookie-consent-desc" className="mt-3 text-sm leading-relaxed text-gray-600">
          We use cookies and similar tools to understand how visitors use our site and to
          improve our services. You can accept or deny optional analytics collection. See our{" "}
          <Link href="/privacy-policy" className="text-gold underline underline-offset-2">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={deny}
            className="rounded-sm border border-navy/20 px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-navy/5"
          >
            Deny
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-sm bg-navy px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-navy-light"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
