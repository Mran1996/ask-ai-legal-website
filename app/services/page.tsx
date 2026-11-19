import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, CalendarClock, FileText, Lock, Orbit, Plug } from "lucide-react"
import { Footer } from "@/components/footer"
import { ALT_BG, Eyebrow, GHOST_BTN, gold, H1, H2, ink, muted, PAGE_BG, PRIMARY_BTN, SiteHeader } from "@/components/site/ui"
import { RESEARCH_ACCESS_NOTE, RESEARCH_DESCRIPTION, RESEARCH_SOURCES } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "AI Legal Research & Court Deadline Tracking",
  description:
    "Legal research with source links, court deadline tracking, case organization and document drafting. A private legal assistant installed on your computer.",
  alternates: { canonical: "/services" },
}

/** Same claims as the earlier features page. Ids are the footer's /services#… targets, keep them. */
const FEATURES = [
  {
    id: "research",
    short: "Research",
    icon: BookOpen,
    title: "Research with source links",
    body: `${RESEARCH_DESCRIPTION} Open the original sources and check each citation before relying on it.`,
    sources: true,
  },
  {
    id: "drafting",
    short: "Documents",
    icon: FileText,
    title: "Documents built around your information",
    body: "Generate editable documents built around your information, issues, and goals. Review the facts, citations, formatting, and applicable court requirements before filing.",
  },
  {
    id: "organization",
    short: "Second Brain",
    icon: Orbit,
    title: "Second Brain memory",
    body: "Keep your saved information, documents, preferences, and drafting lessons together on your computer. Saved corrections and approved lessons guide future drafts.",
  },
  {
    id: "calendar",
    short: "Inbox and calendar",
    icon: CalendarClock,
    title: "Inbox and calendar connections",
    body: "Use supported email and calendar connections to help organize messages, dates, and reminders. Review extracted dates and confirm deadlines against the applicable rules and court orders.",
  },
  {
    id: "privacy",
    short: "Privacy",
    icon: Lock,
    title: "Your information stays under your control",
    body: "Your documents and Second Brain memory are saved on your computer. With privacy mode on, personal identifiers are removed locally before a connected AI service is used, and restored locally in the returned document.",
  },
  {
    id: "setup",
    short: "Setup",
    icon: Plug,
    title: "Agent, API and plugin setup",
    body: "The Complete plan includes agent setup and supported API and plugin connections.",
  },
]

export default function ServicesPage() {
  return (
    <div className={PAGE_BG}>
      <SiteHeader />
      <main>
        {/* 1. Intro */}
        <section className="relative overflow-hidden pb-12 pt-16 lg:pt-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,201,138,0.08),transparent_60%)]" />
          <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
            <Eyebrow>Features</Eyebrow>
            <H1>
              Everything your workspace <em className={gold}>comes with.</em>
            </H1>
            <p className={`mt-5 text-lg leading-relaxed ${muted}`}>
              Installed on your computer and set up with you. Some features depend on your installation and outside providers.
            </p>
            <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Features">
              {FEATURES.map((f) => (
                <a key={f.id} href={`#${f.id}`} className="rounded-full border border-white/15 px-4 py-2 text-sm text-[#f3ead8] hover:border-[#e8c98a]/60 hover:text-[#e8c98a]">
                  {f.short}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* 2. Features */}
        <section className={`border-t border-white/[0.06] ${ALT_BG} pb-20 pt-14`}>
          <div className="mx-auto max-w-5xl divide-y divide-white/[0.07] px-4 sm:px-6">
            {FEATURES.map(({ id, icon: Icon, title, body, sources }, n) => (
              <article key={id} id={id} className="grid scroll-mt-24 gap-6 py-12 first:pt-0 last:pb-0 md:grid-cols-[1fr_1.5fr] md:gap-12">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#e8c98a]/40 text-[#e8c98a]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className={`font-mono text-xs ${gold}`}>0{n + 1}</p>
                    <h2 className={`mt-1 font-[family-name:var(--font-serif)] text-2xl leading-tight sm:text-3xl ${ink}`}>{title}</h2>
                  </div>
                </div>
                <div>
                  <p className={`text-base leading-relaxed ${muted}`}>{body}</p>
                  {sources && (
                    <>
                      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Supported research connections">
                        {RESEARCH_SOURCES.map((s) => (
                          <li key={s} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-[#f3ead8]">
                            {s}
                          </li>
                        ))}
                      </ul>
                      <p className={`mt-4 text-xs leading-relaxed ${muted} opacity-80`}>
                        {RESEARCH_ACCESS_NOTE} Names only, no partnership implied.
                      </p>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. Closing */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <H2>
              Ready when <em className={gold}>you are.</em>
            </H2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className={GHOST_BTN}>Ask a question</Link>
              <Link href="/plans" className={PRIMARY_BTN}>See plans <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
