import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Footer } from "@/components/footer"
import { ALT_BG, Eyebrow, GHOST_BTN, gold, H1, H2, ink, muted, PAGE_BG, PRIMARY_BTN, SiteHeader } from "@/components/site/ui"
import { FaqJsonLd } from "@/lib/seo/faq-json-ld"
import { ALL_FAQ, FAQ_CATEGORIES } from "@/lib/faq"
import { OG_IMAGE, SITE_URL } from "@/lib/site-config"

const TITLE = "AI Legal Assistant FAQ"
const DESCRIPTION =
  "Answers about Ask AI Legal: what it is, plans from $1,497, installation and support, optional $125/month maintenance, privacy, and research connections."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/faq" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/faq`, images: [OG_IMAGE] },
}

export default function FaqPage() {
  return (
    <div className={PAGE_BG}>
      <FaqJsonLd items={ALL_FAQ} path="/faq" />
      <SiteHeader />
      <main>
        {/* 1. Intro */}
        <section className="relative overflow-hidden pb-16 pt-16 lg:pt-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,201,138,0.08),transparent_60%)]" />
          <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
            <Eyebrow>Questions</Eyebrow>
            <H1>
              Straight answers <em className={gold}>before you buy.</em>
            </H1>
            <p className={`mt-5 text-lg leading-relaxed ${muted}`}>What it is, what it costs, how setup works and how your information stays private.</p>
            <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="FAQ topics">
              {FAQ_CATEGORIES.map((c, n) => (
                <a key={c.title} href={`#topic-${n}`} className="rounded-full border border-white/15 px-4 py-2 text-sm text-[#f3ead8] hover:border-[#e8c98a]/60 hover:text-[#e8c98a]">
                  {c.title}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* 2. Questions by topic */}
        <section className={`border-t border-white/[0.06] ${ALT_BG} py-20`}>
          <div className="mx-auto max-w-3xl space-y-16 px-4 sm:px-6">
            {FAQ_CATEGORIES.map((c, n) => (
              <div key={c.title} id={`topic-${n}`} className="scroll-mt-24">
                <Eyebrow>{`0${n + 1}`}</Eyebrow>
                <H2>{c.title}</H2>
                <div className="mt-10 divide-y divide-white/[0.07] border-y border-white/[0.07]">
                  {c.items.map((f) => (
                    <details key={f.q} className="group py-5">
                      <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold ${ink}`}>
                        {f.q}
                        <span className={`text-xl transition-transform group-open:rotate-45 ${gold}`} aria-hidden>+</span>
                      </summary>
                      <p className={`mt-3 text-sm leading-relaxed ${muted}`}>{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Closing */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <H2>
              Still have a question? <em className={gold}>Ask us.</em>
            </H2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className={GHOST_BTN}>Contact us</Link>
              <Link href="/plans" className={PRIMARY_BTN}>See plans <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
