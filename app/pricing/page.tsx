import type { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { NeonButton } from "@/components/neon-button"
import {
  CASE_FILE_REVIEW_PRICE_DISPLAY,
  FILE_REVIEW_DEPOSIT_LABEL,
  PRIMARY_CTA_LABEL,
  SITE_DISCLAIMER,
  SITE_URL,
} from "@/lib/site-config"
import { en } from "@/lib/i18n/translations/en"

const TITLE = "Pricing — Support That Shows Up"
const DESCRIPTION = `Two-step flat fee: ${CASE_FILE_REVIEW_PRICE_DISPLAY} case review assessment, then one flat quote for support and documents. We stand with you — not a law firm.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/pricing`,
  },
}

const steps = en.process.steps

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow">
        <section className="section-navy section-pad-under-header">
          <div className="container-main max-w-4xl">
            <p className="firm-label">Pricing</p>
            <div className="gold-rule mb-8" />
            <h1 className="firm-title text-white">Two payments. No hourly clock.</h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
              You shouldn&apos;t have to fight this alone. A flat {CASE_FILE_REVIEW_PRICE_DISPLAY}{" "}
              {FILE_REVIEW_DEPOSIT_LABEL.toLowerCase()} — we listen first, then one flat price for
              the support and documents your written summary describes. We stand with you — not
              a retainer trap.
            </p>
            <div className="mt-10">
              <NeonButton href="/pay">{PRIMARY_CTA_LABEL}</NeonButton>
            </div>
            <p className="mt-6 text-sm text-white/50">{SITE_DISCLAIMER}</p>
          </div>
        </section>

        <section className="section-pad bg-cream">
          <div className="container-main max-w-4xl">
            <h2 className="firm-title text-navy">How pricing works</h2>
            <ol className="mt-12 space-y-8">
              {steps.map((step, index) => (
                <li key={step.title} className="firm-card border-2 border-gold/35 bg-white p-6 sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-navy">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section-pad bg-white">
          <div className="container-main max-w-4xl">
            <h2 className="firm-title text-navy">The retainer trap vs. our model</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-sm border-2 border-navy/10 bg-cream p-6">
                <h3 className="font-display text-lg font-semibold text-navy">
                  {en.compare.traditionalHeading}
                </h3>
                <p className="mt-2 text-sm font-medium text-gray-700">{en.compare.traditionalPrice}</p>
                <p className="mt-2 text-sm text-gray-600">{en.compare.traditionalDesc}</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {en.compare.traditionalBullets.map((bullet) => (
                    <li key={bullet}>· {bullet}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-sm border-2 border-gold/40 bg-cream p-6 shadow-[0_0_24px_rgba(197,160,89,0.1)]">
                <h3 className="font-display text-lg font-semibold text-navy">{en.compare.usHeading}</h3>
                <p className="mt-2 text-sm font-medium text-gold-dark">{en.compare.usPrice}</p>
                <p className="mt-2 text-sm text-gray-600">{en.compare.usDesc}</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {en.compare.usBullets.map((bullet) => (
                    <li key={bullet}>· {bullet}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-10 text-sm leading-relaxed text-gray-600">
              Payment 1 ({CASE_FILE_REVIEW_PRICE_DISPLAY}) covers your case review assessment.
              Payment 2 is one flat price for the support and documents your written summary
              describes — no hourly billing at either step.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <NeonButton href="/pay">{en.compare.cta}</NeonButton>
              <Link
                href="/#faq"
                className="inline-flex items-center text-sm font-semibold text-gold-dark underline-offset-2 hover:underline"
              >
                Read the FAQ
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
