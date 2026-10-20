import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CineNav } from "@/components/cinematic/nav"
import { Footer } from "@/components/footer"
import { GUIDES } from "@/lib/guides"
import { SITE_URL } from "@/lib/site-config"

const TITLE = "Guides for Representing Yourself in Court"
const DESCRIPTION =
  "Plain-English guides for self-represented people: representing yourself in court, tracking court deadlines, what to do when you're served, and private AI legal help."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/guides" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/guides` },
}

export default function GuidesPage() {
  return (
    <div className="cine flex min-h-screen flex-col bg-ground">
      <CineNav />
      <main className="flex-grow">
        <section className="pt-28 pb-12 sm:pt-32">
          <div className="cine-container max-w-4xl">
            <p className="cine-label mb-3">Guides</p>
            <h1 className="cine-h2 text-cream">Guides for representing yourself in court</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cream/80">
              Plain-English help for people handling their own case. Rules vary by state and court.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {GUIDES.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-accent-light/50"
                >
                  <h2 className="font-display text-xl font-semibold text-cream group-hover:text-accent-light">{g.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-cream/70">{g.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-accent-light">
                    Read the guide <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
