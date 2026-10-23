import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CineNav } from "@/components/cinematic/nav"
import { Footer } from "@/components/footer"
import { FaqAccordion } from "@/components/faq-accordion"
import { FaqJsonLd } from "@/lib/seo/faq-json-ld"
import { ALL_FAQ, FAQ_CATEGORIES } from "@/lib/faq"
import { CONSULT_CTA_LABEL, CONSULT_HREF, SITE_URL } from "@/lib/site-config"

const TITLE = "AI Legal Assistant FAQ"
const DESCRIPTION =
  "Answers about Ask AI Legal: what it is, plans from $1,997, installation and support, optional $125/month maintenance, privacy, and research connections."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/faq" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/faq` },
}

export default function FaqPage() {
  return (
    <div className="cine flex min-h-screen flex-col bg-ground">
      <FaqJsonLd items={ALL_FAQ} path="/faq" />
      <CineNav />
      <main className="flex-grow">
        <section className="pt-28 pb-6 sm:pt-32 sm:pb-10">
          <div className="cine-container max-w-4xl">
            <p className="cine-label mb-3">FAQ</p>
            <h1 className="cine-h2 text-cream">Frequently asked questions</h1>
            <div className="mt-8 space-y-8">
              {FAQ_CATEGORIES.map((c) => (
                <div key={c.title}>
                  <h2 className="mb-3 font-display text-xl font-semibold text-accent-light sm:text-2xl">{c.title}</h2>
                  <FaqAccordion items={c.items} />
                </div>
              ))}
            </div>
            <Link href={CONSULT_HREF} className="cine-btn-gold mt-10">
              {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
