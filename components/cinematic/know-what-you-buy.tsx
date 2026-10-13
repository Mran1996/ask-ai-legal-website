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

const CARD_HEADING = "font-display text-2xl font-semibold leading-tight tracking-tight text-cream sm:text-[2rem]"
const IMAGE_AREA = "relative mt-4 h-[240px] overflow-hidden sm:h-[320px]"

/** Hourglass and single-coin cards: heading above a short photo, details below it. */
export function KnowWhatYouBuy() {
  return (
    <section id="compare" className="relative overflow-hidden bg-ground py-6 sm:py-10">
      <div className="cine-container">
        <Reveal className="grid gap-5 lg:grid-cols-2" stagger={0.1}>
          <article data-reveal className="cine-card flex flex-col overflow-hidden border-brick/20">
            <h2 className={`px-5 pt-5 sm:px-6 sm:pt-6 ${CARD_HEADING}`}>Stop wasting your time and money.</h2>
            <div className={`${IMAGE_AREA} bg-[#0b0806]`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/renders/retainer-trap.png"
                alt="Hourglass with gold coins draining away"
                className="absolute inset-0 h-full w-full object-cover object-[50%_60%]"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <ul className="cine-body space-y-2 !text-lg">
                {TRAP_QUESTIONS.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
              <p className="mt-4 font-display text-lg text-accent-light">
                Keep your information, documents, and next steps in view.
              </p>
            </div>
          </article>

          <article data-reveal className="cine-card flex flex-col overflow-hidden border-accent/30">
            <h2 className={`px-5 pt-5 sm:px-6 sm:pt-6 ${CARD_HEADING}`}>Ask AI Legal</h2>
            <div className={`${IMAGE_AREA} bg-[#070605]`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/renders/single-coin.png"
                alt="A single gold coin"
                className="absolute right-0 top-0 h-full w-auto max-w-none"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#070605] via-[#070605]/60 to-transparent" aria-hidden />
              <div className="absolute left-5 top-5 sm:left-6 sm:top-6">
                <p className="cine-shadow font-display text-4xl font-semibold tracking-tight text-accent-light sm:text-5xl">
                  $3,997
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-cream/70">One-time purchase</p>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <p className="font-display text-lg text-cream">Your workspace, installed and configured with you.</p>
              <p className="cine-body mt-2 !text-lg">
                Personalized documents. Agent setup. Connected tools. Second Brain memory.
              </p>
              <p className="cine-body mt-2 !text-lg">Optional maintenance: $125/month.</p>
              <div className="mt-5">
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
