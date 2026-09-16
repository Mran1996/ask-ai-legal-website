"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "./reveal"

export const SOURCES = [
  "Westlaw",
  "LexisNexis",
  "Bloomberg Law",
  "Fastcase / vLex",
  "UniCourt",
  "Docket Alarm",
  "govinfo",
  "eCFR",
  "Open States",
  "Caselaw Access Project",
  "OpenLaws",
  "Vaquill AI",
  "judyrecords",
]

const TOOLS = [
  {
    n: "01",
    title: "Verified research connections",
    body: "Connected to the case-law and statute platforms behind real legal work. Every citation stays traceable to the published source.",
    sources: true,
  },
  {
    n: "02",
    title: "Court-ready drafting",
    body: "Your documents come out in the tone, structure and style courts expect — not chatbot prose. Drafted by you, in your workspace.",
  },
  {
    n: "03",
    title: "Your second brain",
    body: "A workspace that remembers your matter — the people, dates, filings and what happened when. It organizes everything from past to present and helps you see the next step.",
  },
  {
    n: "04",
    title: "Inbox & calendar watch",
    body: "Connected to your email and calendar, so an incoming legal response, a filing deadline or a hearing date never slips past you.",
  },
  {
    n: "05",
    title: "Private by design",
    body: "Drafting on your own model — open source or closed.",
  },
  {
    n: "06",
    title: "Tested and back-tested",
    body: "Every workflow we install has been tested and back-tested on real filings before it reaches you. A fighting chance — not an experiment.",
  },
]

const COMPACT = [
  TOOLS[0],
  {
    n: "02",
    title: "Court-ready drafting + your second brain",
    body: "Documents in the tone and structure courts expect, from a workspace that remembers your matter — people, dates, filings — and helps you see the next step.",
  },
  TOOLS[3],
]

/** Homepage version: headline, three cards, link to the full page. */
export function ToolsCompact() {
  return (
    <section id="tools" className="relative bg-ground py-24 sm:py-32">
      <div className="cine-glow absolute -left-[20%] top-0 h-[60vh] w-[60vw] opacity-60" aria-hidden />
      <div className="cine-container relative">
        <Reveal>
          <p data-reveal className="cine-label mb-6">What gets installed</p>
          <h2 data-reveal className="cine-h2 max-w-[18ch] text-cream">
            The same class of tools
            <br />
            <span className="cine-serif text-accent-light">the other side has.</span>
          </h2>
          <p data-reveal className="cine-body mt-8 max-w-2xl">
            Attorneys work with research databases, drafting systems and case-management tools. We install that class of
            tooling on your own computer, configured for your matter — then you run it.
          </p>
        </Reveal>

        <Reveal className="mt-14 grid gap-5 lg:grid-cols-3" stagger={0.08}>
          {COMPACT.map((t) => (
            <article key={t.title} data-reveal className={`cine-card p-7 sm:p-8 ${"sources" in t && t.sources ? "lg:col-span-3" : ""}`}>
              <h3 className="cine-h3 text-cream">{t.title}</h3>
              <p className="cine-body mt-3 !text-base">{t.body}</p>
              {"sources" in t && t.sources && (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Connected research sources">
                  {SOURCES.map((s) => (
                    <li key={s} className="rounded-full border border-accent/30 bg-ground px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-cream/80">
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </Reveal>

        <Reveal>
          <div data-reveal className="mt-10">
            <Link href="/services" className="cine-btn-ghost">
              Everything that gets installed <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** Full version for /services. */
export function Tools() {
  return (
    <section id="tools" className="relative bg-ground py-24 sm:py-32">
      <div className="cine-glow absolute -left-[20%] top-0 h-[60vh] w-[60vw] opacity-60" aria-hidden />
      <div className="cine-container relative">
        <Reveal>
          <p data-reveal className="cine-label mb-6">What gets installed</p>
          <h2 data-reveal className="cine-h2 max-w-[18ch] text-cream">
            The same class of tools
            <br />
            <span className="cine-serif text-accent-light">the other side has.</span>
          </h2>
          <p data-reveal className="cine-body mt-8 max-w-2xl">
            Attorneys work with research databases, drafting systems and case-management tools. We install that class of
            tooling on your own computer, configured for your matter — then you run it.
          </p>
        </Reveal>

        <Reveal className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {TOOLS.map((t) => (
            <article key={t.n} data-reveal className={`cine-card p-7 sm:p-8 ${t.sources ? "md:col-span-2 lg:col-span-3" : ""}`}>
              <p className="cine-label !text-cream/40">{t.n}</p>
              <h3 className="cine-h3 mt-3 text-cream">{t.title}</h3>
              <p className="cine-body mt-3 !text-base">{t.body}</p>
              {t.sources && (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Connected research sources">
                  {SOURCES.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-accent/30 bg-ground px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-cream/80"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </Reveal>

        <Reveal>
          <p data-reveal className="mt-10 max-w-2xl font-mono text-xs uppercase tracking-[0.14em] text-cream/45">
            Commands · Skills · Agents · Plugins — set up and walked through live on your screen, and recorded for you.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
