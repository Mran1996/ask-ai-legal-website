import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Footer } from "@/components/footer"
import { ALT_BG, card, Eyebrow, gold, H1, ink, muted, PAGE_BG, serif, SiteHeader } from "@/components/site/ui"
import { GUIDES } from "@/lib/guides"
import { OG_IMAGE, SITE_URL } from "@/lib/site-config"

const TITLE = "Guides for Representing Yourself in Court"
const DESCRIPTION =
  "Plain-English guides for people representing themselves: court basics, deadlines, what to do when you're served, motions, evictions and proof of service."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/guides" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/guides`, images: [OG_IMAGE] },
}

export default function GuidesPage() {
  return (
    <div className={PAGE_BG}>
      <SiteHeader />
      <main>
        {/* 1. Intro */}
        <section className="relative overflow-hidden pb-12 pt-16 lg:pt-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,201,138,0.08),transparent_60%)]" />
          <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
            <Eyebrow>Guides</Eyebrow>
            <H1>
              Guides for representing <em className={gold}>yourself in court.</em>
            </H1>
            <p className={`mt-5 text-lg leading-relaxed ${muted}`}>
              Plain-English help for people handling their own case. Rules vary by state and court.
            </p>
          </div>
        </section>

        {/* 2. Guide cards */}
        <section className={`border-t border-white/[0.06] ${ALT_BG} pb-20 pt-14`}>
          <div className="mx-auto grid max-w-5xl gap-5 px-4 sm:grid-cols-2 sm:px-6">
            {GUIDES.map((g, n) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className={`${card} group flex flex-col p-6 transition hover:border-[#e8c98a]/40`}>
                <p className={`font-mono text-xs ${gold}`}>{String(n + 1).padStart(2, "0")}</p>
                <h2 className={`${serif} ${ink} mt-3 text-2xl leading-tight group-hover:text-[#e8c98a]`}>{g.title}</h2>
                <p className={`mt-3 flex-1 text-sm leading-relaxed ${muted}`}>{g.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#e8c98a]">
                  Read the guide <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
