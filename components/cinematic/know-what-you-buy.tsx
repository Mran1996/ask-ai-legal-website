"use client"

import Link from "next/link"
import { ArrowRight, Check, X } from "lucide-react"
import { Reveal } from "./reveal"
import { CONSULT_CTA_LABEL, CONSULT_HREF } from "@/lib/site-config"

const TRAP = [
  "$5,000–$10,000 spent—and still chasing answers?",
  "No callbacks?",
  "Unexpected added costs?",
  "Documents that miss what you asked for?",
]

const OURS = [
  "Your workspace, installed and configured with you",
  "Personalized documents",
  "Agent setup",
  "Connected tools",
  "Second Brain memory",
  "Optional maintenance: $125/month",
]

const HEADING = "flex min-h-[5.5rem] items-end justify-center px-5 pt-5 text-center font-display text-xl font-semibold leading-tight tracking-tight text-cream sm:text-2xl"
const PHOTO = "relative mt-4 h-[220px] overflow-hidden"
const LIST = "space-y-2.5 text-base leading-snug text-cream/85 sm:text-lg"

/**
 * Two matching cards: heading on top, a 220px photo, then a marked list.
 * The coin photo is scaled so its face (centre at ~59%/64% of single-coin.png) sits mid-frame with the price on it.
 */
export function KnowWhatYouBuy() {
  return (
    <section id="compare" className="relative overflow-hidden bg-ground py-6 sm:py-10">
      <div className="cine-container">
        <Reveal className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2" stagger={0.1}>
          <article data-reveal className="cine-card flex flex-col overflow-hidden">
            <h2 className={HEADING}>Stop wasting your time and money.</h2>
            <div className={`${PHOTO} bg-[#0b0806]`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/renders/retainer-trap.png"
                alt="Hourglass with gold coins draining away"
                className="absolute inset-0 h-full w-full object-cover object-[50%_55%]"
                loading="lazy"
              />
            </div>
            <ul className={`flex-1 p-5 ${LIST}`}>
              {TRAP.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-[#E8836B]" aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </article>

          <article data-reveal className="cine-card flex flex-col overflow-hidden">
            <h2 className={HEADING}>Ask AI Legal</h2>
            <div className={`${PHOTO} bg-[#070605]`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/renders/single-coin.png"
                alt=""
                aria-hidden
                className="absolute h-[388px] w-auto max-w-none [mask-image:linear-gradient(to_right,transparent,black_22%,black_80%,transparent)]"
                style={{ left: "calc(50% - 184px)", top: "-137px" }}
                loading="lazy"
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="font-display text-3xl font-bold tracking-tight text-[#1c1305] [text-shadow:0_1px_0_rgba(255,226,150,0.55)]">
                  $3,997
                </p>
                <p className="mt-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-[#2a1c07]">
                  One-time purchase
                </p>
              </div>
            </div>
            <ul className={`flex-1 p-5 ${LIST}`}>
              {OURS.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="px-5 pb-5">
              <Link href={CONSULT_HREF} className="cine-btn-gold w-full">
                {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
