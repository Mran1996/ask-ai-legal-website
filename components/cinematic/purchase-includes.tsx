"use client"

import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Reveal } from "./reveal"
import { CONSULT_CTA_LABEL, CONSULT_HREF, PURCHASE_INCLUSIONS, THIRD_PARTY_COSTS_NOTE } from "@/lib/site-config"

/** The single purchase offer and everything it includes. */
export function PurchaseIncludes() {
  return (
    <section id="includes" className="relative scroll-mt-20 bg-ground-surface py-6 sm:py-10">
      <div className="cine-container grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <Reveal>
          <h2 data-reveal className="cine-h2 text-cream">
            A real person installs it{" "}
            <span className="cine-serif text-accent-light">while you watch.</span>
          </h2>
          <div data-reveal className="mt-6">
            <p className="font-display text-5xl font-semibold tracking-tight text-accent-light">$1,997</p>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-cream/60">Starting price · One-time purchase</p>
            <p className="mt-4 font-display text-xl text-cream">Optional maintenance: $125/month</p>
            <p className="mt-3 text-sm text-cream/60">{THIRD_PARTY_COSTS_NOTE}</p>
          </div>
          <div data-reveal className="mt-6">
            <Link href={CONSULT_HREF} className="cine-btn-gold">
              {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <Reveal stagger={0.05}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {PURCHASE_INCLUSIONS.map((item) => (
              <li key={item} data-reveal className="cine-card flex items-start gap-3 px-4 py-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <span className="text-lg leading-snug text-cream">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
