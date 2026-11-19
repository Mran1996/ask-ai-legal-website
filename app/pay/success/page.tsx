import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Check, Mail } from "lucide-react"
import { Footer } from "@/components/footer"
import { card, Eyebrow, H1, ink, muted, PAGE_BG, PRIMARY_BTN, SiteHeader } from "@/components/site/ui"
import { PaySuccessPurchase } from "@/components/analytics/pay-success-purchase"
import { ComputerChoice } from "@/components/pay/computer-choice"
import { verifyCheckoutSession, type PaidItem, type VerifiedPurchase } from "@/lib/stripe-receipt"
import {
  MAINTENANCE_PRICE_USD,
  PURCHASE_PRICE_USD,
  SITE_URL,
  STARTER_PRICE_USD,
  SUPPORT_EMAIL,
  WALKTHROUGH_VIDEO_ID,
  WALKTHROUGH_VIDEO_URL,
} from "@/lib/site-config"

const TITLE = "Payment received"
const DESCRIPTION = "Your Ask AI Legal payment was received. Your Stripe receipt shows exactly what you paid for."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/pay/success" },
  robots: { index: false, follow: false },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/pay/success`,
  },
}

type Item = PaidItem

// Checked against Stripe on every visit, never cached.
export const dynamic = "force-dynamic"

const planCopy = (name: string, price: number, days: number) => ({
  heading: "Thank you. Your purchase is confirmed",
  body: `We received your one-time payment of $${price.toLocaleString("en-US", { minimumFractionDigits: 2 })} for the Ask AI Legal ${name} plan. This payment does not enroll you in maintenance.`,
  next: [
    "Choose Windows or Mac below. We email your download link, usually within one business day.",
    "Install Ask AI Legal and open it. It shows your computer code.",
    "Reply with that code and we send your license code to activate it.",
    `Questions? Use the chat on our website, email us, or call. We include our support phone number with your download. Your ${days} days of support start when you are activated.`,
  ],
  value: price,
})

/** Stripe payment links send customers here with ?session_id={CHECKOUT_SESSION_ID} (plus ?item=...).
 *  The page only opens for a real, paid Stripe checkout; anyone else is sent to /plans. */
const COPY: Record<Item, { heading: string; body: string; next: string[]; value?: number }> = {
  starter: planCopy("Starter", STARTER_PRICE_USD, 14),
  complete: planCopy("Complete", PURCHASE_PRICE_USD, 30),
  maintenance: {
    heading: "Your optional maintenance is active",
    body: "We received your maintenance enrollment at $125.00 per month, billed monthly under the maintenance terms provided before enrollment. This is separate from the one-time purchase.",
    next: ["Your Stripe receipt shows the billing date for each month.", "Contact us with any maintenance or billing question."],
    value: MAINTENANCE_PRICE_USD,
  },
  unknown: {
    heading: "Payment received",
    body: "Thank you. Your Stripe receipt shows what you paid for: your Ask AI Legal plan or the optional $125-per-month maintenance.",
    next: ["Check your email for your Stripe receipt.", "Contact us if anything on your receipt looks wrong."],
  },
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function PaySuccessPage({ searchParams }: PageProps) {
  const params = await searchParams
  const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)
  const hint = pick(params.item) ?? pick(params.plan)

  let purchase: VerifiedPurchase | null = await verifyCheckoutSession(pick(params.session_id), hint === "purchase" ? "complete" : hint)

  // Local preview only (never on the live site): /pay/success?preview=starter|complete|maintenance
  const preview = pick(params.preview)
  if (!purchase && process.env.NODE_ENV === "development" && (preview === "starter" || preview === "complete" || preview === "maintenance")) {
    purchase = {
      sessionId: "",
      item: preview,
      value: preview === "starter" ? STARTER_PRICE_USD : preview === "complete" ? PURCHASE_PRICE_USD : MAINTENANCE_PRICE_USD,
    }
  }

  if (!purchase) redirect("/plans")

  const item: Item = purchase.item
  const base = COPY[item]
  // Show and report what Stripe says was actually paid.
  const copy =
    item === "starter" || item === "complete"
      ? planCopy(item === "starter" ? "Starter" : "Complete", purchase.value, item === "starter" ? 14 : 30)
      : { ...base, value: purchase.value || base.value }
  const receipt = purchase.sessionId
    ? `Stripe checkout ${purchase.sessionId}, paid $${purchase.value.toFixed(2)}`
    : "Local preview, not a real payment"

  return (
    <div className={PAGE_BG}>
      {purchase.sessionId ? <PaySuccessPurchase item={item} value={copy.value} eventId={purchase.sessionId} /> : null}
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden pb-20 pt-16 lg:pt-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,201,138,0.08),transparent_60%)]" />
          <div className="relative mx-auto w-full max-w-xl px-4 text-center sm:px-6">
            <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#e8c98a]/40">
              <Check className="h-6 w-6 text-[#e8c98a]" aria-hidden />
            </span>
            <Eyebrow>Payment confirmed</Eyebrow>
            <H1>{copy.heading}</H1>
            <p className={`mx-auto mt-5 max-w-md text-lg leading-relaxed ${muted}`}>{copy.body}</p>

            <div className={`${card} mt-10 p-6 text-left`}>
              <p className={`font-mono text-[11px] uppercase tracking-[0.16em] text-[#e8c98a]`}>What happens next</p>
              <ol className="mt-4 space-y-3">
                {copy.next.map((line, n) => (
                  <li key={line} className={`flex gap-3 text-sm leading-relaxed ${muted}`}>
                    <span className="font-mono text-xs text-[#e8c98a]">0{n + 1}</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ol>
            </div>

            {item === "starter" || item === "complete" ? (
              <>
                <div className="mt-6">
                  <ComputerChoice plan={item === "starter" ? "Starter" : "Complete"} receipt={receipt} />
                </div>
                <div className="mt-10 text-left">
                  <p className={`text-base font-semibold ${ink}`}>See Ask AI Legal in action</p>
                  <p className={`mt-1 text-sm ${muted}`}>A short preview. Your full walkthrough video, which explains everything step by step, comes by email with your download.</p>
                  <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-white/10">
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${WALKTHROUGH_VIDEO_ID}`}
                      title="Ask AI Legal preview"
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <a className="mt-3 inline-block text-sm text-[#e8c98a] underline underline-offset-4" href={WALKTHROUGH_VIDEO_URL} target="_blank" rel="noopener noreferrer">
                    Open it on YouTube
                  </a>
                </div>
              </>
            ) : null}

            <div className={`mt-10 flex items-center justify-center gap-2 text-sm ${muted}`}>
              <Mail className="h-4 w-4 shrink-0 text-[#e8c98a]" aria-hidden />
              <span>
                Questions?{" "}
                <a className="text-[#e8c98a] underline underline-offset-4" href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>
              </span>
            </div>

            <Link href="/" className={`${PRIMARY_BTN} mt-8`}>
              Return home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
