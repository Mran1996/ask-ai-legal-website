import type { Metadata } from "next"
import Link from "next/link"
import { Check, Mail } from "lucide-react"
import { CineNav } from "@/components/cinematic/nav"
import { Footer } from "@/components/footer"
import { PaySuccessPurchase } from "@/components/analytics/pay-success-purchase"
import { ComputerChoice } from "@/components/pay/computer-choice"
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

type Item = "starter" | "complete" | "maintenance" | "unknown"

const planCopy = (name: string, price: number, days: number) => ({
  heading: "Thank you. Your purchase is confirmed",
  body: `We received your one-time payment of $${price.toLocaleString("en-US", { minimumFractionDigits: 2 })} for the Ask AI Legal ${name} plan. This payment does not enroll you in maintenance.`,
  next: [
    "Choose Windows or Mac below. We email your download link, usually within one business day.",
    "Install Ask AI Legal and open it. It shows your computer code.",
    "Reply with that code and we send your license code to activate it.",
    `Questions? Use the chat on our website or email us. Your ${days} days of support start when you are activated.`,
  ],
  value: price,
})

/** Stripe payment links send customers here with ?item=starter, ?item=complete or ?item=maintenance,
 *  so Meta records each Purchase at the right amount. ?item=purchase (older links) means Complete. */
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
  // Stripe links send ?item=starter|complete (older ones may use ?plan=).
  const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)
  const raw = pick(params.item) ?? pick(params.plan)
  const item: Item = raw === "purchase" ? "complete" : raw === "starter" || raw === "complete" || raw === "maintenance" ? raw : "unknown"
  const copy = COPY[item]

  return (
    <div className="min-h-screen flex flex-col">
      <PaySuccessPurchase value={copy.value} />
      <CineNav />

      <main className="flex-grow">
        <section className="section-navy section-pad-under-header">
          <div className="container-main max-w-lg">
            <div className="mx-auto w-full max-w-md text-center">
              <p className="firm-label text-gold">Payment confirmed</p>
              <div className="gold-rule mx-auto mb-6 mt-2" />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                <Check className="h-7 w-7 text-gold" aria-hidden />
              </div>

              <h1 className="mt-6 font-display text-3xl leading-tight text-white sm:text-4xl">{copy.heading}</h1>
              <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-white/70">{copy.body}</p>

              <div className="mt-8 rounded-sm border border-white/10 bg-white/5 px-5 py-5 text-left">
                <p className="text-sm font-semibold text-white">What happens next</p>
                <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-white/70">
                  {copy.next.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>

              {item === "starter" || item === "complete" ? (
                <>
                  <div className="mt-6">
                    <ComputerChoice plan={item === "starter" ? "Starter" : "Complete"} />
                  </div>
                  <div className="mt-6 text-left">
                    <p className="text-sm font-semibold text-white">Watch the step-by-step walkthrough</p>
                    <div className="mt-3 aspect-video overflow-hidden rounded-sm border border-white/10">
                      <iframe
                        className="h-full w-full"
                        src={`https://www.youtube-nocookie.com/embed/${WALKTHROUGH_VIDEO_ID}`}
                        title="Ask AI Legal walkthrough"
                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                    <a className="mt-2 inline-block text-xs text-gold underline" href={WALKTHROUGH_VIDEO_URL} target="_blank" rel="noopener noreferrer">
                      Open it on YouTube
                    </a>
                  </div>
                </>
              ) : null}

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
                <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>
                  Questions?{" "}
                  <a className="text-gold underline" href={`mailto:${SUPPORT_EMAIL}`}>
                    {SUPPORT_EMAIL}
                  </a>
                </span>
              </div>

              <Link
                href="/"
                className="btn-gold mt-8 inline-flex min-h-[48px] items-center justify-center px-8"
              >
                Return home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
