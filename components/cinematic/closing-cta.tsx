"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Slot } from "./slot"
import { Reveal } from "./reveal"

export function ClosingCta() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ground py-24 sm:py-32">
      <div className="cine-glow absolute left-1/2 top-1/2 h-[120vh] w-[120vw] -translate-x-1/2 -translate-y-1/2" aria-hidden />
      <div className="cine-container relative grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <h2 data-reveal className="cine-h2 text-cream">
            Ready to fight
            <br />
            <span className="cine-serif text-accent-light">from home?</span>
          </h2>
          <p data-reveal className="cine-body mt-8 max-w-lg">
            You don&apos;t have to explain everything. Start with as much or as little as you want — we walk you through the rest, step by step, and reply with a custom start quote.
          </p>
          <div data-reveal className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/pay" className="cine-btn-gold">
              Start from home <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/book" className="cine-btn-ghost">
              Book a call
            </Link>
          </div>
          <p data-reveal className="mt-12 max-w-lg font-sans text-xs leading-relaxed text-cream/40">
            Ask AI Legal installs and configures tools for educational and informational use. It is not a law firm and
            does not provide legal advice or create an attorney-client relationship.
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
