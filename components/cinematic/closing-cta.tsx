"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Slot } from "./slot"
import { Reveal } from "./reveal"
import { CONSULT_CTA_LABEL, CONSULT_HREF, SITE_DISCLAIMER } from "@/lib/site-config"

export function ClosingCta() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ground py-6 sm:py-10">
      <div className="cine-glow absolute left-1/2 top-1/2 h-[120vh] w-[120vw] -translate-x-1/2 -translate-y-1/2" aria-hidden />
      <div className="cine-container relative grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <h2 data-reveal className="cine-h2 text-cream">
            Book your{" "}
            <br />
            <span className="cine-serif text-accent-light">install call.</span>
          </h2>
          <p data-reveal className="cine-body mt-4 max-w-lg">
            We check your computer first, so you know it works before you pay. Plans start at $1,997, paid once.
            Optional maintenance is $125 a month.
          </p>
          <div data-reveal className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link href={CONSULT_HREF} className="cine-btn-gold">
              {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/plans" className="cine-btn-ghost">
              Compare plans
            </Link>
          </div>
          <p data-reveal className="mt-8 max-w-lg font-sans text-xs leading-relaxed text-cream/40">
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
