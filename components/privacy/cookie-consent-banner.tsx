"use client"

import Link from "next/link"
import { useConsent } from "@/components/privacy/consent-provider"

/** Slim bottom bar — Google-style footprint, brand colors. */
export function CookieConsentBanner() {
  const { hasChosen, accept, deny } = useConsent()

  if (hasChosen) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-navy/10 bg-cream/95 px-3 py-2 backdrop-blur-sm sm:px-4"
      role="region"
      aria-label="Cookie consent"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <p className="min-w-0 flex-1 text-[13px] leading-snug text-navy/70">
          We use cookies to understand site use and improve our services.{" "}
          <Link
            href="/privacy-policy"
            className="text-navy underline underline-offset-2 hover:text-gold"
          >
            Privacy Policy
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={deny}
            className="rounded px-3 py-1.5 text-[13px] font-medium text-navy transition-colors hover:bg-navy/5"
          >
            Deny
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded bg-navy px-3.5 py-1.5 text-[13px] font-medium text-cream transition-colors hover:bg-navy-light"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
