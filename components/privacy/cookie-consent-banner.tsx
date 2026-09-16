"use client"

import Link from "next/link"
import { useConsent } from "@/components/privacy/consent-provider"

/** Slim bottom bar — Google-style footprint, brand colors. */
export function CookieConsentBanner() {
  const { hasChosen, accept, deny } = useConsent()

  if (hasChosen) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-cream/10 px-3 py-2.5 backdrop-blur-md sm:px-4"
      style={{ backgroundColor: "rgba(12, 25, 41, 0.96)" }}
      role="region"
      aria-label="Cookie consent"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <p className="min-w-0 flex-1 text-[13px] leading-snug" style={{ color: "rgba(250,249,246,0.72)" }}>
          We use cookies to understand site use and improve our services.{" "}
          <Link
            href="/privacy-policy"
            className="underline underline-offset-2 hover:text-gold"
            style={{ color: "#faf9f6" }}
          >
            Privacy Policy
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={deny}
            className="rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors hover:bg-cream/10 active:bg-cream active:text-ground"
            style={{ borderColor: "rgba(250,249,246,0.35)", color: "#faf9f6" }}
          >
            Deny
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors hover:brightness-110 active:brightness-90"
            style={{ backgroundColor: "#FBB034", color: "#070f18" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
