"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Slot } from "./slot"
import { Reveal } from "./reveal"
import { CONSULT_CTA_LABEL, CONSULT_HREF } from "@/lib/site-config"

/** The original two-card comparison (hourglass vs. coins), updated to current pricing. */
export function KnowWhatYouBuy() {
  return (
    <section id="compare" className="relative scroll-mt-20 overflow-hidden bg-ground py-24 sm:py-32">
      <div className="cine-container">
        <Reveal>
          <p data-reveal className="cine-label mb-6">The difference</p>
          <h2 data-reveal className="cine-h2 max-w-[16ch] text-cream">
            Why pay $5,000–$10,000 up front{" "}
            <br />
            <span className="cine-serif text-accent-light">to be kept in the dark?</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* the trap */}
          <Reveal className="cine-card relative overflow-hidden border-brick/20">
            <div className="pointer-events-none absolute -right-6 -top-6 h-72 w-72 opacity-90 sm:h-96 sm:w-96 [mask-image:radial-gradient(closest-side,black_55%,transparent)]">
              <Slot src="retainer-trap.png" className="h-full w-full rounded-2xl" imgClassName="object-cover" quiet />
            </div>
            <div className="relative p-8 sm:p-12">
              <p data-reveal className="cine-label !text-brick">The retainer trap</p>
              <p data-reveal className="font-display mt-6 text-5xl font-semibold tracking-tight text-cream sm:text-7xl">
                $5,000–$10,000+
              </p>
              <p data-reveal className="font-mono mt-2 text-xs uppercase tracking-widest text-cream/50">
                up front · drawn down hourly
              </p>
              <ul data-reveal className="cine-body mt-10 space-y-3">
                <li>Weeks waiting for callbacks.</li>
                <li>Someone else holds the tools — and the timeline.</li>
                <li>Costs grow with every call and every email.</li>
              </ul>
            </div>
          </Reveal>

          {/* the install */}
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
                one-time purchase · no hourly billing
              </p>
              <ul data-reveal className="cine-body mt-10 space-y-3">
                <li>Installed on your computer and set up with you.</li>
                <li>Your documents and drafts stay in view.</li>
                <li>Optional maintenance: $125/month.</li>
              </ul>
              <div data-reveal className="mt-8">
                <Link href={CONSULT_HREF} className="cine-btn-gold">
                  {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
