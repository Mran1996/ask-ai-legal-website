"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Slot } from "./slot"
import { Reveal } from "./reveal"
import { CONSULT_CTA_LABEL, CONSULT_HREF, SITE_DISCLAIMER } from "@/lib/site-config"

export function ClosingCta() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ground py-24 sm:py-32">
      <div className="cine-glow absolute left-1/2 top-1/2 h-[120vh] w-[120vw] -translate-x-1/2 -translate-y-1/2" aria-hidden />
      <div className="cine-container relative grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <h2 data-reveal className="cine-h2 text-cream">
            Ready to set up{" "}
            <br />
            <span className="cine-serif text-accent-light">your legal workspace?</span>
          </h2>
          <p data-reveal className="cine-body mt-8 max-w-lg">
            Book a consultation to confirm your computer requirements, review the included features, and discuss
            installation. The one-time purchase is $3,997, with optional maintenance at $125 per month.
          </p>
          <div data-reveal className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href={CONSULT_HREF} className="cine-btn-gold">
              {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/pricing" className="cine-btn-ghost">
              See pricing
            </Link>
          </div>
          <p data-reveal className="mt-12 max-w-lg font-sans text-xs leading-relaxed text-cream/40">
            {SITE_DISCLAIMER}
          </p>
        </Reveal>
        <Reveal className="mx-auto w-full max-w-[420px]">
          <div data-reveal>
            <Slot src="tell-us.png" className="aspect-square w-full rounded-3xl" imgClassName="object-cover object-[35%_center]" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
