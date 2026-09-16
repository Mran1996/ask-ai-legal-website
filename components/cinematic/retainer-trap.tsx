"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Slot } from "./slot"
import { Reveal } from "./reveal"

export function RetainerTrap() {
  return (
    <section id="compare" className="relative overflow-hidden bg-ground py-24 sm:py-32">
      <div className="cine-container">
        <Reveal>
          <p data-reveal className="cine-label mb-6">The difference</p>
          <h2 data-reveal className="cine-h2 max-w-[16ch] text-cream">
            Why pay $10,000 up front
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
                $3,000–$10,000
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
                Two payments.
              </p>
              <p data-reveal className="font-mono mt-2 text-xs uppercase tracking-widest text-cream/50">
                no hourly billing · ever
              </p>
              <ol data-reveal className="cine-body mt-10 space-y-3">
                <li>
                  <span className="font-mono text-xs text-accent">01</span>&nbsp; A custom start quote — credited in
                  full toward your setup.
                </li>
                <li>
                  <span className="font-mono text-xs text-accent">02</span>&nbsp; One flat price for the configured
                  setup, quoted once we know what to install.
                </li>
              </ol>
              <p data-reveal className="mt-6 font-mono text-xs uppercase tracking-widest text-accent/90">
                Tested and back-tested on real filings
              </p>
              <div data-reveal className="mt-8">
                <Link href="/pay" className="cine-btn-gold">
                  Start from home <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
