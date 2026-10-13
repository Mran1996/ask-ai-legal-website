"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "./reveal"
import { CONSULT_CTA_LABEL, CONSULT_HREF } from "@/lib/site-config"

const TRAP_QUESTIONS = [
  "$5,000–$10,000 spent—and still chasing answers?",
  "No callbacks?",
  "Unexpected added costs?",
  "Documents that miss what you asked for?",
]

/** Hourglass ("Avoid the trap") and single-coin price cards. Short text sits on the photo; the rest below it. */
export function KnowWhatYouBuy() {
  return (
    <section id="compare" className="relative scroll-mt-20 overflow-hidden bg-ground py-24 sm:py-32" aria-labelledby="compare-title">
      <h2 id="compare-title" className="sr-only">
        Avoid the trap
      </h2>
      <div className="cine-container">
        <Reveal className="grid gap-6 lg:grid-cols-2" stagger={0.1}>
          {/* Avoid the trap */}
          <article data-reveal className="cine-card flex flex-col overflow-hidden border-brick/20">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#0b0806]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/renders/retainer-trap.png"
                alt="Hourglass with gold coins draining away"
                className="absolute inset-0 h-full w-full object-cover object-[50%_65%]"
                loading="lazy"
              />
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#0b0806]/90 via-[#0b0806]/40 to-transparent" aria-hidden />
              <p className="cine-shadow absolute inset-x-0 top-5 text-center font-display text-3xl font-semibold tracking-tight text-cream sm:top-7 sm:text-5xl">
                Avoid the trap
              </p>
            </div>
            <div className="flex flex-1 flex-col p-7 sm:p-9">
              <ul className="cine-body space-y-2.5 !text-base">
                {TRAP_QUESTIONS.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
              <p className="mt-6 font-display text-lg text-accent-light">
                Keep your information, documents, and next steps in view.
              </p>
            </div>
          </article>

          {/* One purchase, one coin */}
          <article data-reveal className="cine-card flex flex-col overflow-hidden border-accent/30">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#070605]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/renders/single-coin.png"
                alt="A single gold coin"
                className="absolute right-0 top-0 h-full w-auto max-w-none"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#070605] via-[#070605]/60 to-transparent" aria-hidden />
              <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
                <p className="cine-label">Ask AI Legal</p>
                <p className="cine-shadow mt-3 font-display text-4xl font-semibold tracking-tight text-accent-light sm:text-6xl">
                  $3,997
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-cream/70">One-time purchase</p>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-7 sm:p-9">
              <p className="font-display text-lg text-cream">Your workspace, installed and configured with you.</p>
              <p className="cine-body mt-3 !text-base">
                Personalized documents. Agent setup. Connected tools. Second Brain memory.
              </p>
              <p className="cine-body mt-3 !text-base">Optional maintenance: $125/month.</p>
              <div className="mt-8">
                <Link href={CONSULT_HREF} className="cine-btn-gold">
                  {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
