import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { CineNav } from "@/components/cinematic/nav"
import { Footer } from "@/components/footer"
import { NeonButton } from "@/components/neon-button"
import { CompareTable } from "@/components/compare-table"
import { COMPARISON } from "@/lib/comparison"
import {
  CONSULT_CTA_LABEL,
  CONSULT_HREF,
  MAINTENANCE_PRICE_USD,
  PRICING_NOTICE,
  PURCHASE_INCLUSIONS,
  PURCHASE_PRICE_USD,
  SITE_URL,
  SUPPORT_PERIOD_NOTE,
} from "@/lib/site-config"

const TITLE = "Ask AI Legal Pricing | $3,997 Purchase & $125 Maintenance"
const DESCRIPTION =
  "Ask AI Legal includes installation, training, video and written guidance, and 30 days of installation support for $3,997. Maintenance is optional at $125/month."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/pricing`,
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
}

/** Two separate offers: the one-time purchase and the optional monthly plan. No ratings or reviews. */
const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Ask AI Legal",
  description:
    "Legal workspace software installed on your computer, including installation, configuration, personal training, a walkthrough video and written getting-started guide, and 30 days of installation support.",
  brand: { "@type": "Brand", name: "Ask AI Legal" },
  url: `${SITE_URL}/pricing`,
  offers: [
    {
      "@type": "Offer",
      name: "Ask AI Legal — one-time purchase",
      price: PURCHASE_PRICE_USD.toFixed(2),
      priceCurrency: "USD",
      url: `${SITE_URL}/pricing`,
    },
    {
      "@type": "Offer",
      name: "Optional maintenance — monthly",
      price: MAINTENANCE_PRICE_USD.toFixed(2),
      priceCurrency: "USD",
      url: `${SITE_URL}/pricing`,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: MAINTENANCE_PRICE_USD.toFixed(2),
        priceCurrency: "USD",
        unitText: "MONTH",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
      },
    },
  ],
}

const DETAILS_LINE = "We’ll go over the details in your consultation."

const sections = [
  {
    title: "Your costs, clearly explained.",
    body: "The one-time purchase is $3,997. With 12 months of optional maintenance, the first-year total is $5,497 before applicable taxes and separate third-party charges — no 12-month commitment required. Third-party AI usage, research subscriptions, and cloud services are separate.",
  },
  {
    title: "What happens without maintenance?",
    body: "You keep your purchased software under your license terms. Connected features may eventually need updates or outside services as providers change.",
  },
  {
    title: "Before you purchase.",
    body: "We confirm your computer requirements, the included features, and any third-party costs before installation.",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <CineNav />

      <main className="flex-grow">
        <section className="section-navy section-pad-under-header">
          <div className="container-main max-w-4xl">
            <p className="firm-label">Pricing</p>
            <div className="gold-rule mb-8" />
            <h1 className="firm-title text-white">One-time purchase. Optional monthly maintenance.</h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
              Your own installed legal workspace, personally set up for you. Purchase Ask AI Legal for $3,997,
              including installation, configuration, personal training, and initial support.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <NeonButton href={CONSULT_HREF}>{CONSULT_CTA_LABEL}</NeonButton>
              <Link
                href="#compare"
                className="inline-flex items-center text-sm font-semibold text-gold underline-offset-2 hover:underline"
              >
                Compare with hiring an attorney
              </Link>
            </div>
          </div>
        </section>

        <section className="section-pad bg-cream" aria-labelledby="pricing-options">
          <div className="container-main max-w-5xl">
            <h2 id="pricing-options" className="sr-only">
              Pricing options
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <article className="firm-card flex flex-col border-2 border-gold/40 bg-white p-6 shadow-[0_0_24px_rgba(251,176,52,0.1)] sm:p-8">
                <h3 className="font-display text-2xl font-semibold text-navy">Ask AI Legal</h3>
                <p className="mt-4 font-display text-4xl font-semibold text-navy">
                  $3,997 <span className="text-lg font-medium text-gray-600">one time</span>
                </p>
                <p className="mt-5 text-sm font-semibold text-navy">Your purchase includes:</p>
                <ul className="mt-3 flex-grow space-y-2.5">
                  {PURCHASE_INCLUSIONS.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs leading-relaxed text-gray-600">{SUPPORT_PERIOD_NOTE}</p>
                <div className="mt-8">
                  <NeonButton href={CONSULT_HREF} className="btn-neon-light">
                    {CONSULT_CTA_LABEL}
                  </NeonButton>
                </div>
              </article>

              <article className="firm-card flex flex-col border-2 border-navy/10 bg-white p-6 sm:p-8">
                <h3 className="font-display text-2xl font-semibold text-navy">Optional maintenance</h3>
                <p className="mt-4 font-display text-4xl font-semibold text-navy">
                  $125 <span className="text-lg font-medium text-gray-600">per month</span>
                </p>
                <p className="mt-5 text-sm leading-relaxed text-gray-700">
                  Keep your installation current as technology changes. Maintenance includes supported software
                  updates, maintenance of existing AI connections, compatibility fixes, and technical assistance within
                  the maintenance plan&rsquo;s stated limits. Custom integrations, major upgrades, and additional
                  training may require a separate quote.
                </p>
                <p className="mt-4 flex-grow text-sm font-medium leading-relaxed text-navy">
                  Maintenance is optional. Coverage, billing, service limits, and cancellation terms are provided
                  before enrollment.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="compare" className="section-pad scroll-mt-20 bg-white" aria-labelledby="compare-title">
          <div className="container-main max-w-5xl">
            <p className="firm-label text-gold-dark">{COMPARISON.tagline}</p>
            <div className="gold-rule mb-6 mt-2" />
            <h2 id="compare-title" className="firm-title text-navy">
              {COMPARISON.title}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-700">{COMPARISON.intro}</p>
            <div className="mt-10">
              <CompareTable tone="light" />
            </div>
            <p className="mt-6 max-w-3xl text-sm font-medium leading-relaxed text-navy">{COMPARISON.note}</p>
          </div>
        </section>

        <section className="section-pad bg-cream">
          <div className="container-main max-w-4xl space-y-10">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="firm-title text-navy">{s.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-gray-700">
                  {s.body} {DETAILS_LINE}
                </p>
              </div>
            ))}

            <div className="rounded-sm border border-navy/10 bg-white p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-navy">Important notice</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">{PRICING_NOTICE}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <NeonButton href={CONSULT_HREF} className="btn-neon-light">
                {CONSULT_CTA_LABEL}
              </NeonButton>
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
