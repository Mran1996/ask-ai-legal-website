import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BadgeCheck, BookOpen, Clock, FileSearch, Receipt, Shield } from "lucide-react"
import { Footer } from "@/components/footer"
import { ALT_BG, card, Eyebrow, GHOST_BTN, gold, H1, H2, ink, muted, PAGE_BG, PRIMARY_BTN, serif, SiteHeader } from "@/components/site/ui"
import { CONSULT_CTA_LABEL, CONSULT_HREF, SITE_DISCLAIMER } from "@/lib/site-config"

const capabilities = [
  {
    icon: FileSearch,
    title: "Research you can check",
    description:
      "Source links let you open the opinions, statutes, court rules, and documents behind your research. AI can make mistakes, so check each source before relying on it.",
  },
  {
    icon: BookOpen,
    title: "Document drafting for your review",
    description:
      "Prepare editable drafts with personalized document generation. Review the facts, citations, formatting, and applicable court requirements before filing.",
  },
  {
    icon: Receipt,
    title: "One price, stated up front",
    description:
      "A one-time purchase: Starter is $1,497 and Complete is $2,997. Optional maintenance is $125 per month.",
  },
  {
    icon: Clock,
    title: "Personal setup and training",
    description:
      "You download it and follow the walkthrough video. It installs in minutes, and you can reach us 24/7 with questions.",
  },
  {
    icon: BadgeCheck,
    title: "Clear about data handling",
    description:
      "We explain which features operate locally, which send information to outside providers, and the settings available to you.",
  },
  {
    icon: Shield,
    title: "You stay in control",
    description:
      "You decide what to research, draft, and file. Ask AI Legal is not a law firm and does not represent you.",
  },
]

const standards = [
  {
    title: "Install before you run it",
    text: "We configure the workspace with you, then show you how it works.",
  },
  {
    title: "Clarity before commitment",
    text: "You know the price, the included services, and any additional costs before you purchase.",
  },
  {
    title: "Sources you can open",
    text: "Research comes with source links so you can read the original and confirm it supports your point.",
  },
  {
    title: "Support after setup",
    text: "Support covers the first 30 days, with optional maintenance afterward.",
  },
]

export const metadata: Metadata = {
  title: "About Ask AI Legal",
  description:
    "Ask AI Legal makes private legal software that runs on your computer, for people handling their own court cases anywhere in the US. Not a law firm.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <div className={PAGE_BG}>
      <SiteHeader />
      <main>
        {/* 1. Intro */}
        <section className="relative overflow-hidden pb-12 pt-16 lg:pt-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,201,138,0.08),transparent_60%)]" />
          <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
            <Eyebrow>About us</Eyebrow>
            <H1>
              Your legal workspace, <em className={gold}>installed and explained.</em>
            </H1>
            <p className={`mt-5 text-lg leading-relaxed ${muted}`}>
              Ask AI Legal installs legal workspace software on your computer and shows you how to use it. We exist because people
              handling important paperwork should have organized, capable tools of their own, at a price that is stated up front.
            </p>
          </div>
        </section>

        {/* 2. What makes us different */}
        <section className={`border-t border-white/[0.06] ${ALT_BG} py-20`}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <Eyebrow>What makes us different</Eyebrow>
              <H2>
                What you get when you <em className={gold}>work from home.</em>
              </H2>
              <p className={`mt-5 text-lg leading-relaxed ${muted}`}>
                We built our service around what people actually need: a configured workspace, sources they can check themselves, and
                clear pricing. Here is what that means in practice.
              </p>
            </div>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((item) => (
                <li key={item.title} className={`${card} p-6`}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e8c98a]/40 text-[#e8c98a]">
                    <item.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className={`${serif} ${ink} mt-5 text-2xl leading-tight`}>{item.title}</h3>
                  <p className={`mt-3 text-sm leading-relaxed ${muted}`}>{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. Our standard */}
        <section className="border-t border-white/[0.06] py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Our standard</Eyebrow>
              <H2>
                The home setup <em className={gold}>your situation deserves.</em>
              </H2>
              <p className={`mt-5 text-lg leading-relaxed ${muted}`}>
                Everyone working from home should have research tools behind them, sources they can verify, and a clear picture of what
                they are paying for. That is the bar we hold ourselves to on every install.
              </p>
            </div>
            <ol className="mt-10 grid gap-10 sm:grid-cols-2">
              {standards.map((item, n) => (
                <li key={item.title} className="border-t border-white/10 pt-5">
                  <p className={`font-mono text-xs ${gold}`}>0{n + 1}</p>
                  <h3 className={`mt-3 text-lg font-semibold ${ink}`}>{item.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${muted}`}>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 4. Who we serve */}
        <section className={`border-t border-white/[0.06] ${ALT_BG} py-20`}>
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
            <div>
              <Eyebrow>Who we serve</Eyebrow>
              <H2>
                People who want <em className={gold}>tools of their own.</em>
              </H2>
              <p className={`mt-5 text-lg leading-relaxed ${muted}`}>
                Families fighting for a loved one. Self-represented people who want to stay organized. Advocates pushing for reform.
                Anyone who wants capable tools of their own.
              </p>
              <p className={`mt-4 text-lg leading-relaxed ${muted}`}>
                You install Ask AI Legal in minutes with our walkthrough video. You remain in control, working from home, informed, and
                organized.
              </p>
            </div>
            <div className="rounded-2xl border border-[#e8c98a]/30 bg-white/[0.03] p-8 lg:self-start">
              <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${gold}`}>Important notice</p>
              <p className={`mt-4 text-sm leading-relaxed ${muted}`}>{SITE_DISCLAIMER}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={CONSULT_HREF} className={PRIMARY_BTN}>
                  {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/contact" className={GHOST_BTN}>Ask a question</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
