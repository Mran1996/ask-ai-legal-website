import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, ShieldCheck } from "lucide-react"
import { CineNav } from "@/components/cinematic/nav"
import { Footer } from "@/components/footer"
import { BrandMark } from "@/components/brand-mark"
import { CONSULT_CTA_LABEL, CONSULT_HREF } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Compare Plans | Ask AI Legal",
  description:
    "Two plans, each paid once: Starter at $1,997 or Complete at $3,997. Both are installed live on your computer while you watch. Backed by a money-back guarantee.",
  alternates: { canonical: "/plans" },
}

const BOTH = [
  "Live install while you watch",
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

/** Colors from the installed app's navy-glass design (app/static/ui.css, dark mode). */
const APP = {
  panel: "linear-gradient(180deg, rgba(170,210,255,.14), transparent 140px), rgba(16,32,58,.78)",
  border: "rgba(148,180,220,.22)",
  text: "#EAF1FA",
  muted: "#8FA3BF",
  accent: "#22C9D6",
  grad: "linear-gradient(100deg, #1CC8D6 0%, #2F8FEA 55%, #3B6FE0 100%)",
}

/** Product data for search engines: two one-time plans plus optional monthly maintenance. */
const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Ask AI Legal",
  description:
    "Private legal assistant software installed live on your computer, for people who represent themselves in court.",
  brand: { "@type": "Brand", name: "Ask AI Legal" },
  url: "https://askailegal.com/plans",
  offers: [
    { "@type": "Offer", name: "Starter", price: "1997.00", priceCurrency: "USD", url: "https://askailegal.com/plans" },
    { "@type": "Offer", name: "Complete", price: "3997.00", priceCurrency: "USD", url: "https://askailegal.com/plans" },
    {
      "@type": "Offer",
      name: "Optional maintenance, monthly",
      price: "125.00",
      priceCurrency: "USD",
      url: "https://askailegal.com/plans",
    },
  ],
}

export default function PlansPage() {
  return (
    <div className="cine min-h-screen">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <CineNav />
      <main className="pt-24 pb-10 sm:pt-28">
        <section className="relative bg-ground py-6 sm:py-10">
          <div className="cine-glow absolute left-1/2 top-0 h-[70vh] w-[90vw] -translate-x-1/2 opacity-60" aria-hidden />
          <div className="cine-container relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="cine-label mb-3">Compare plans</p>
              <h1 className="cine-h2 text-cream">
                Two plans.{" "}
                <span className="cine-serif text-accent-light">Each paid once.</span>
              </h1>
              <p className="cine-body mt-4">Both plans are installed live on your computer while you watch. You purchase through your installation consultation.</p>
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl items-stretch gap-6 md:grid-cols-2">
              {/* Starter: plain card */}
              <div className="cine-card flex flex-col p-6 sm:p-8">
                <p className="cine-label">Starter</p>
                <p className="mt-3 font-display text-5xl font-semibold text-cream">$1,997</p>
                <p className="mt-1 text-sm text-cream/60">One-time purchase</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {BOTH.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[15px] text-cream/85">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-light" aria-hidden />
                      {f}
                    </li>
                  ))}
                  <li className="flex items-start gap-3 text-[15px] text-cream/85">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-light" aria-hidden />
                    14 days of support after install
                  </li>
                </ul>
                <Link href={CONSULT_HREF} className="cine-btn-ghost mt-8 justify-center">
                  {CONSULT_CTA_LABEL}
                </Link>
              </div>

              {/* Complete: card in the installed app's design */}
              <div
                className="relative order-first flex flex-col rounded-[24px] p-6 sm:p-8"
                style={{
                  background: APP.panel,
                  border: `1px solid ${APP.border}`,
                  boxShadow: "0 0 0 1px rgba(34,201,214,.25), 0 30px 60px -28px rgba(34,201,214,.45)",
                  backdropFilter: "blur(18px) saturate(1.3)",
                  color: APP.text,
                }}
              >
                <span
                  className="absolute -top-3 right-6 rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ background: APP.grad }}
                >
                  Most complete
                </span>
                <div className="flex items-center gap-3">
                  <BrandMark className="h-8 w-8" />
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: APP.accent }}>
                    Complete
                  </p>
                </div>
                <p className="mt-3 font-display text-5xl font-semibold">$3,997</p>
                <p className="mt-1 text-sm" style={{ color: APP.muted }}>
                  One-time purchase
                </p>
                <p className="mt-6 text-sm font-semibold" style={{ color: APP.muted }}>
                  Everything in Starter, plus:
                </p>
                <ul className="mt-3 flex-1 space-y-3">
                  {COMPLETE_EXTRA.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[15px]">
                      <Check className="mt-0.5 h-5 w-5 shrink-0" style={{ color: APP.accent }} aria-hidden />
                      {f}
                    </li>
                  ))}
                  <li className="flex items-start gap-3 text-[15px]">
                    <Check className="mt-0.5 h-5 w-5 shrink-0" style={{ color: APP.accent }} aria-hidden />
                    30 days of support after install
                  </li>
                </ul>
                <Link
                  href={CONSULT_HREF}
                  className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-[14px] px-6 font-semibold text-white"
                  style={{ background: APP.grad, boxShadow: "0 10px 24px -10px rgba(47,143,234,.65)" }}
                >
                  {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-3xl space-y-4 text-center">
              <p className="cine-body">
                <strong className="text-cream">Optional maintenance: $125 a month, either plan.</strong> Keeps your
                plan&apos;s features updated and working. No long-term commitment.
              </p>
              <div className="flex items-start justify-center gap-3 text-left">
                <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-accent-light" aria-hidden />
                <p className="cine-body">
                  <strong className="text-cream">100% money-back guarantee.</strong> During your install, we test Ask AI
                  Legal on your computer against our written checklist. If it doesn&apos;t do what the checklist says,
                  you get every dollar back. No hassle.
                </p>
              </div>
              <p className="text-sm text-cream/50">
                Third-party usage and paid services are billed separately.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
