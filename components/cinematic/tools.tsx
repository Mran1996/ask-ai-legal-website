"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "./reveal"
import { RESEARCH_ACCESS_NOTE, RESEARCH_DESCRIPTION, RESEARCH_SOURCES } from "@/lib/site-config"

/** Research platforms we can connect (see RESEARCH_SOURCES). Text names only — no endorsement implied. */
export const SOURCES: readonly string[] = RESEARCH_SOURCES

type Tool = { id: string; title: string; body: string; sources?: boolean }

const TOOLS: Tool[] = [
  {
    id: "research",
    title: "Supported research connections",
    body: `${RESEARCH_DESCRIPTION} Open the original sources and review AI-generated citations before relying on them.`,
    sources: true,
  },
  {
    id: "drafting",
    title: "Document drafting for your review",
    body: "Prepare editable drafts using the templates supported by your installation. Review the facts, citations, formatting, and applicable court requirements before filing.",
  },
  {
    id: "organization",
    title: "Your second brain",
    body: "A workspace that keeps track of your matter — the people, dates, filings, and what happened when — so your information stays organized in one place.",
  },
  {
    id: "calendar",
    title: "Inbox & calendar connections",
    body: "Use supported email and calendar connections to help organize messages, dates, and reminders. Review extracted dates and confirm deadlines against the applicable rules and court orders.",
  },
  {
    id: "privacy",
    title: "Privacy and data handling",
    body: "Your setup may combine local storage with connected AI and cloud services. We explain which features operate locally, which send information to outside providers, and the settings available to you.",
  },
]

const COMPACT = [TOOLS[0], TOOLS[1], TOOLS[3]]

function SourceList() {
  return (
    <>
      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Supported research connections">
        {SOURCES.map((s) => (
          <li key={s} className="rounded-full border border-accent/30 bg-ground px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-cream/80">
            {s}
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/55">{RESEARCH_ACCESS_NOTE}</p>
    </>
  )
}

/** Homepage version: headline, three cards, link to the full page. */
export function ToolsCompact() {
  return (
    <section id="tools" className="relative bg-ground py-24 sm:py-32">
      <div className="cine-glow absolute -left-[20%] top-0 h-[60vh] w-[60vw] opacity-60" aria-hidden />
      <div className="cine-container relative">
        <Reveal>
          <p data-reveal className="cine-label mb-6">What gets installed</p>
          <h2 data-reveal className="cine-h2 max-w-[18ch] text-cream">
            One workspace{" "}
            <br />
            <span className="cine-serif text-accent-light">for your matter.</span>
          </h2>
          <p data-reveal className="cine-body mt-8 max-w-2xl">
            Research, drafting, and organization in one workspace — installed on your computer and configured with you.
            Available features depend on your installation.
          </p>
        </Reveal>

        <Reveal className="mt-14 grid gap-5 lg:grid-cols-2" stagger={0.08}>
          {COMPACT.map((t) => (
            <article key={t.id} data-reveal className={`cine-card p-7 sm:p-8 ${t.sources ? "lg:col-span-2" : ""}`}>
              <h3 className="cine-h3 text-cream">{t.title}</h3>
              <p className="cine-body mt-3 !text-base">{t.body}</p>
              {/* The homepage lists the platforms once, in the sources band below. */}
            </article>
          ))}
        </Reveal>

        <Reveal>
          <div data-reveal className="mt-10">
            <Link href="/services" className="cine-btn-ghost">
              See all features <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** Full version for /services. Card ids are the footer's /services#… targets. */
export function Tools() {
  return (
    <section id="tools" className="relative bg-ground py-24 sm:py-32">
      <div className="cine-glow absolute -left-[20%] top-0 h-[60vh] w-[60vw] opacity-60" aria-hidden />
      <div className="cine-container relative">
        <Reveal>
          <p data-reveal className="cine-label mb-6">What gets installed</p>
          <h2 data-reveal className="cine-h2 max-w-[18ch] text-cream">
            One workspace{" "}
            <br />
            <span className="cine-serif text-accent-light">for your matter.</span>
          </h2>
          <p data-reveal className="cine-body mt-8 max-w-2xl">
            Research, drafting, and organization in one workspace — installed on your computer and configured with you.
            Available features depend on your installation.
          </p>
        </Reveal>

        <Reveal className="mt-16 grid gap-5 md:grid-cols-2" stagger={0.08}>
          {TOOLS.map((t, i) => (
            <article
              key={t.id}
              id={t.id}
              data-reveal
              className={`cine-card scroll-mt-24 p-7 sm:p-8 ${t.sources ? "md:col-span-2" : ""}`}
            >
              <p className="cine-label !text-cream/40">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="cine-h3 mt-3 text-cream">{t.title}</h3>
              <p className="cine-body mt-3 !text-base">{t.body}</p>
              {t.sources && <SourceList />}
            </article>
          ))}
        </Reveal>

        <Reveal>
          <p data-reveal className="mt-10 max-w-2xl font-mono text-xs uppercase tracking-[0.14em] text-cream/45">
            Set up and walked through with you during installation.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
