import type { Metadata } from "next"
import Link from "next/link"
import { Check, ShieldCheck } from "lucide-react"
import { CineNav } from "@/components/cinematic/nav"
import { Footer } from "@/components/footer"
import { NeonButton } from "@/components/neon-button"
import {
  CONSULT_CTA_LABEL,
  CONSULT_HREF,
  GUARANTEE_HREF,
  GUARANTEE_TEXT,
  GUARANTEE_TITLE,
  MAINTENANCE_PRICE_USD,
  PRICING_NOTICE,
  PURCHASE_INCLUSIONS,
  PURCHASE_PRICE_USD,
  SITE_URL,
  SUPPORT_PERIOD_NOTE,
} from "@/lib/site-config"

const TITLE = "Ask AI Legal Pricing | Private AI Legal Assistant"
const DESCRIPTION =
  "Ask AI Legal is paid once: Starter $1,497 or Complete $2,997. Download it, follow the walkthrough video, and install in minutes. Maintenance is optional at $125/month."

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
    "Legal workspace software you install on your own computer in minutes, with a step-by-step walkthrough video and support after install.",
  brand: { "@type": "Brand", name: "Ask AI Legal" },
  url: `${SITE_URL}/pricing`,
  offers: [
    {
      "@type": "Offer",
      name: "Ask AI Legal Starter, one-time purchase",
      price: "1497.00",
      priceCurrency: "USD",
      url: `${SITE_URL}/plans`,
    },
    {
      "@type": "Offer",
      name: "Ask AI Legal Complete, one-time purchase",
      price: PURCHASE_PRICE_USD.toFixed(2),
      priceCurrency: "USD",
      url: `${SITE_URL}/plans`,
    },
    {
      "@type": "Offer",
      name: "Optional maintenance, monthly",
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


const sections = [
  {
    title: "Your costs, clearly explained.",
    body: "Starter is $1,497 and Complete is $2,997, each paid once. Optional maintenance is $125 a month, with no long-term commitment. Third-party usage and paid services are billed separately.",
  },
  {
    title: "What happens without maintenance?",
    body: "You keep your purchased software under your license terms. Connected features may eventually need updates or outside services as providers change.",
  },
  {
    title: "Before you purchase.",
    body: "Open the sample documents and watch the walkthrough video first. If you have questions about your computer, the features, or outside costs, reach us 24/7.",
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
              Your own legal workspace on your computer. Plans start at $1,497, paid once. You download it, follow
              the walkthrough video, and install it in minutes.
            </p>
            <Link
              href={GUARANTEE_HREF}
              className="mt-8 flex max-w-2xl items-start gap-3 rounded-sm border border-gold/40 bg-white/5 p-5 transition-colors hover:border-gold"
            >
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-gold" aria-hidden />
              <span>
                <span className="block font-semibold text-white">{GUARANTEE_TITLE}</span>
                <span className="mt-1 block text-sm leading-relaxed text-white/70">{GUARANTEE_TEXT}</span>
              </span>
            </Link>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <NeonButton href={CONSULT_HREF}>{CONSULT_CTA_LABEL}</NeonButton>
              <Link
                href="/faq"
                className="inline-flex items-center text-sm font-semibold text-gold underline-offset-2 hover:underline"
              >
                Read the FAQ
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
                <h3 className="font-display text-2xl font-semibold text-navy">Two plans, each paid once</h3>
                <p className="mt-4 font-display text-4xl font-semibold text-navy">
                  $1,497 <span className="text-lg font-medium text-gray-600">Starter</span>
                </p>
                <p className="mt-1 font-display text-4xl font-semibold text-navy">
                  $2,997 <span className="text-lg font-medium text-gray-600">Complete</span>
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

              <aside className="flex flex-col justify-center p-2 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Optional maintenance · $125/month</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-navy">Keep your workspace moving forward.</h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-700">
                  Optional maintenance provides ongoing support, supported software updates, and help maintaining your
                  API and plugin connections as services change.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">
                  Your saved learning stays in your workspace. Maintenance supports the software and its connections.
                </p>
              </aside>
            </div>
          </div>
        </section>


        <section className="section-pad bg-cream">
          <div className="container-main max-w-4xl space-y-10">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="firm-title text-navy">{s.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-gray-700">
                  {s.body}
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
                href="/faq"
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
