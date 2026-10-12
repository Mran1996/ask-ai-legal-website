"use client"

import { Check } from "lucide-react"
import { Reveal } from "./reveal"
import { PURCHASE_INCLUSIONS, SUPPORT_PERIOD_NOTE } from "@/lib/site-config"

/** The six inclusions of the one-time purchase — sits right after the install story. */
export function PurchaseIncludes() {
  return (
    <section id="includes" className="relative bg-ground-surface py-24 sm:py-32">
      <div className="cine-container">
        <Reveal>
          <p data-reveal className="cine-label mb-6">One-time purchase</p>
          <h2 data-reveal className="cine-h2 text-cream">Your purchase includes</h2>
        </Reveal>

        <Reveal stagger={0.06}>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PURCHASE_INCLUSIONS.map((item) => (
              <li key={item} data-reveal className="cine-card flex items-start gap-4 p-6 sm:p-7">
                <Check className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <span className="cine-h3 !text-lg text-cream">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <p data-reveal className="cine-body mt-10 max-w-2xl">
            {SUPPORT_PERIOD_NOTE}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
