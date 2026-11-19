import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, ShieldCheck } from "lucide-react"
import { Footer } from "@/components/footer"
import { ALT_BG, card, Eyebrow, GHOST_BTN, gold, H1, H2, ink, muted, PAGE_BG, PRIMARY_BTN, serif, SiteHeader } from "@/components/site/ui"
import { PlanBuyLink } from "@/components/analytics/plan-buy-link"
import {
  GUARANTEE_HREF,
  MAINTENANCE_PRICE_USD,
  PURCHASE_PRICE_USD,
  STARTER_PRICE_USD,
  STRIPE_COMPLETE_URL,
  STRIPE_STARTER_URL,
  THIRD_PARTY_COSTS_NOTE,
} from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Compare Plans",
  description:
    "Two plans, each paid once: Starter at $1,497 or Complete at $2,997. Pay once, download, and install in minutes. Backed by a money-back guarantee.",
  alternates: { canonical: "/plans" },
}

const BOTH = [
  "Download and install in minutes",
  "Chat assistant",
  "Drafting that plans, writes and polishes, and never changes your citations or quotes",
  "Reads your papers and organizes your case folder",
  "Search all your papers by title, date or judge",
  "Deadline calendar with reminders",
  "Case law research with source links",
  "Court rules for your state",
  "Second Brain memory that learns your case",
  "Privacy switch that hides names before anything is sent",
  "Written getting-started guide",
]

const COMPLETE_EXTRA = [
  "Talk mode: speak to your assistant, interrupt anytime, hear answers out loud",
  "Case watcher: alerts when new rulings may help or hurt your case",
  "Every case you've cited, mapped to the exact page",
  "Personal training session",
  "Paid research services set up (Westlaw, Lexis and others)",
  "Email and calendar connections",
  "New premium features as they're released",
]

/** Product data for search engines: two one-time plans plus optional monthly maintenance. */
const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Ask AI Legal",
  description:
    "Private legal assistant software you install on your own computer, for people who represent themselves in court.",
  brand: { "@type": "Brand", name: "Ask AI Legal" },
  url: "https://askailegal.com/plans",
  offers: [
    { "@type": "Offer", name: "Starter", price: "1497.00", priceCurrency: "USD", url: "https://askailegal.com/plans" },
    { "@type": "Offer", name: "Complete", price: "2997.00", priceCurrency: "USD", url: "https://askailegal.com/plans" },
    {
      "@type": "Offer",
      name: "Optional maintenance, monthly",
      price: "125.00",
      priceCurrency: "USD",
      url: "https://askailegal.com/plans",
    },
  ],
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className={`flex items-start gap-3 text-[15px] leading-snug ${ink}`}>
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9fd3a8]" aria-hidden />
      <span>{children}</span>
    </li>
  )
}

export default function PlansPage() {
  return (
    <div className={PAGE_BG}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <SiteHeader />
      <main>
        {/* 1. Plans */}
        <section className="relative overflow-hidden pb-20 pt-16 lg:pt-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,201,138,0.08),transparent_60%)]" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Pricing</Eyebrow>
              <H1>
                Two plans. <em className={gold}>Each paid once.</em>
              </H1>
              <p className={`mt-5 text-lg leading-relaxed ${muted}`}>
                Download it, install it in minutes and keep it on your own computer. Reach us 24/7 with questions.
              </p>
            </div>

            <div className="mt-12 grid items-stretch gap-5 md:grid-cols-2">
              {/* Starter */}
              <div className={`${card} flex flex-col p-8`}>
                <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${muted}`}>Starter</p>
                <p className={`${serif} ${ink} mt-3 text-6xl`}>${STARTER_PRICE_USD.toLocaleString("en-US")}</p>
                <p className={`mt-2 text-sm ${muted}`}>Paid once. Yours to keep.</p>
                <ul className="mt-8 flex-1 space-y-3">
                  {BOTH.map((f) => (
                    <Item key={f}>{f}</Item>
                  ))}
                  <Item>30 days of support after install</Item>
                </ul>
                <PlanBuyLink plan="starter" value={STARTER_PRICE_USD} href={STRIPE_STARTER_URL} className={`${GHOST_BTN} mt-10 w-full`}>
                  Buy Starter · ${STARTER_PRICE_USD.toLocaleString("en-US")}
                </PlanBuyLink>
              </div>

              {/* Complete */}
              <div className="relative flex flex-col rounded-2xl border border-[#e8c98a]/35 bg-white/[0.04] p-8">
                <span className="absolute -top-3 right-6 rounded-full bg-[#e8c98a] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#0b131d]">
                  Most complete
                </span>
                <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${gold}`}>Complete</p>
                <p className={`${serif} ${ink} mt-3 text-6xl`}>${PURCHASE_PRICE_USD.toLocaleString("en-US")}</p>
                <p className={`mt-2 text-sm ${muted}`}>Paid once. Yours to keep.</p>
                <p className={`mt-8 text-sm font-semibold ${muted}`}>Everything in Starter, plus:</p>
                <ul className="mt-3 flex-1 space-y-3">
                  {COMPLETE_EXTRA.map((f) => (
                    <Item key={f}>{f}</Item>
                  ))}
                  <Item>30 days of support after install</Item>
                </ul>
                <PlanBuyLink plan="complete" value={PURCHASE_PRICE_USD} href={STRIPE_COMPLETE_URL} className={`${PRIMARY_BTN} mt-10 w-full`}>
                  Buy Complete · ${PURCHASE_PRICE_USD.toLocaleString("en-US")} <ArrowRight className="h-4 w-4" aria-hidden />
                </PlanBuyLink>
              </div>
            </div>
          </div>
        </section>

        {/* 2. The fine print, in plain words */}
        <section className={`border-t border-white/[0.06] ${ALT_BG} py-20`}>
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Eyebrow>Good to know</Eyebrow>
            <H2>
              No surprises <em className={gold}>after you pay.</em>
            </H2>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              <div className="border-t border-white/10 pt-5">
                <h3 className={`text-lg font-semibold ${ink}`}>Maintenance is optional</h3>
                <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
                  ${MAINTENANCE_PRICE_USD} a month, either plan. Keeps your plan&apos;s features updated and working. No long-term commitment.
                </p>
              </div>
              <div className="border-t border-white/10 pt-5">
                <h3 className={`flex items-center gap-2 text-lg font-semibold ${ink}`}>
                  <ShieldCheck className="h-5 w-5 text-[#e8c98a]" aria-hidden /> Money-back guarantee
                </h3>
                <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
                  If Ask AI Legal will not install or run on your computer and we cannot fix it, you get every dollar back.{" "}
                  <Link href={GUARANTEE_HREF} className="underline underline-offset-4 hover:text-[#f3ead8]">Read the guarantee</Link>
                </p>
              </div>
              <div className="border-t border-white/10 pt-5">
                <h3 className={`text-lg font-semibold ${ink}`}>Outside services</h3>
                <p className={`mt-2 text-sm leading-relaxed ${muted}`}>{THIRD_PARTY_COSTS_NOTE}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Closing */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <H2>
              Questions first? <em className={gold}>Ask us.</em>
            </H2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/#faq" className={GHOST_BTN}>Read the questions</Link>
              <Link href="/contact" className={PRIMARY_BTN}>Contact us <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
            <p className={`mt-8 text-xs leading-relaxed ${muted} opacity-80`}>
              Ask AI Legal provides legal information and document automation for educational and informational purposes only. It does not constitute formal legal advice or an attorney-client relationship.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
