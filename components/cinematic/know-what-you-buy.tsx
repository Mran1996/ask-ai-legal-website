"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Slot } from "./slot"
import { Reveal } from "./reveal"
import { CONSULT_CTA_LABEL, CONSULT_HREF } from "@/lib/site-config"

export function KnowWhatYouBuy() {
  return (
    <section id="compare" className="relative overflow-hidden bg-ground py-24 sm:py-32">
      <div className="cine-container grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p data-reveal className="cine-label mb-6">Clear pricing</p>
          <h2 data-reveal className="cine-h2 max-w-[16ch] text-cream">
            Know what you{" "}
            <br />
            <span className="cine-serif text-accent-light">are buying.</span>
          </h2>
          <p data-reveal className="cine-body mt-8 max-w-xl">
            Ask AI Legal is a software purchase with installation and onboarding for $3,997. Optional maintenance is
            $125 per month. You receive a clear explanation of included services and additional costs before purchase.
          </p>
          <p data-reveal className="cine-body mt-6 max-w-xl !text-cream/60">
            Ask AI Legal helps you organize information and prepare work for review. It does not provide legal
            representation or replace a lawyer.
          </p>
          <div data-reveal className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href={CONSULT_HREF} className="cine-btn-gold">
              {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/pricing" className="cine-btn-ghost">
              See pricing
            </Link>
          </div>
        </Reveal>

        <Reveal className="cine-card relative overflow-hidden border-accent/30" stagger={0.1}>
          <div className="pointer-events-none absolute -right-6 -top-6 h-72 w-72 opacity-90 sm:h-96 sm:w-96 [mask-image:radial-gradient(closest-side,black_55%,transparent)]">
            <Slot src="flat-price.png" className="h-full w-full rounded-2xl" imgClassName="object-contain" quiet />
          </div>
          <div className="relative p-8 sm:p-12">
            <p data-reveal className="cine-label">Ask AI Legal</p>
            <p data-reveal className="font-display mt-6 text-5xl font-semibold tracking-tight text-accent-light sm:text-7xl">
              $3,997
            </p>
            <p data-reveal className="font-mono mt-2 text-xs uppercase tracking-widest text-cream/50">
              one-time purchase
            </p>
            <p data-reveal className="font-display mt-10 text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
              $125<span className="text-lg font-normal text-cream/60">/month</span>
            </p>
            <p data-reveal className="font-mono mt-2 text-xs uppercase tracking-widest text-cream/50">
              optional maintenance
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
