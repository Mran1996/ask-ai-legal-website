import type { Metadata } from "next"
import { Check, Lock, ShieldCheck } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { StripeBuyButton } from "@/components/payments/stripe-buy-button"
import {
  CASE_FILE_REVIEW_PRICE_DISPLAY,
  FILE_REVIEW_DEPOSIT_LABEL,
  SITE_DISCLAIMER,
  SITE_URL,
  SUPPORT_EMAIL,
} from "@/lib/site-config"

const TITLE = `${FILE_REVIEW_DEPOSIT_LABEL} — ${CASE_FILE_REVIEW_PRICE_DISPLAY}`
const DESCRIPTION = `Start your ${FILE_REVIEW_DEPOSIT_LABEL.toLowerCase()} for ${CASE_FILE_REVIEW_PRICE_DISPLAY}. We listen, understand your situation, and guide you on next steps. Not a law firm.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/pay" },
  robots: { index: false, follow: false },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/pay`,
  },
}

const included = [
  "We listen first — your story and documents matter",
  "Judgment about which tools fit your situation — and which don't",
  "Written summary with your path forward and one flat quote",
  `${CASE_FILE_REVIEW_PRICE_DISPLAY} credited in full toward your support package`,
]

export default function PayPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <link rel="preconnect" href="https://js.stripe.com" />
      <link rel="preconnect" href="https://buy.stripe.com" />
      <link rel="preconnect" href="https://m.stripe.network" />
      <link rel="dns-prefetch" href="https://js.stripe.com" />
      <link rel="preload" as="script" href="https://js.stripe.com/v3/buy-button.js" />

      <Navigation />

      <main className="flex-grow">
        <section className="section-navy section-pad-under-header">
          <div className="container-main max-w-lg">
            <div className="mx-auto w-full max-w-md">
              <div className="text-center">
                <p className="firm-label text-gold">Secure payment</p>
                <div className="gold-rule mx-auto mb-6 mt-2" />
                <h1 className="font-display text-3xl leading-tight text-white sm:text-4xl">
                  {FILE_REVIEW_DEPOSIT_LABEL}
                </h1>
                <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-white/70">
                  Tell us what you&apos;re facing. A one-time {CASE_FILE_REVIEW_PRICE_DISPLAY}{" "}
                  assessment — we understand your situation and guide you on how to fight back.
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <div className="w-fit rounded-2xl shadow-[0_0_55px_rgba(197,160,89,0.55)] [&_stripe-buy-button]:block">
                  <StripeBuyButton />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-white/50">
                <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>Secure checkout powered by Stripe</span>
              </div>

              <ul className="mt-8 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/75">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-start gap-3 rounded-sm border border-white/10 bg-white/5 px-4 py-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <p className="text-xs leading-relaxed text-white/55">
                  {SITE_DISCLAIMER}
                  <br />
                  Questions?{" "}
                  <a className="text-gold underline" href={`mailto:${SUPPORT_EMAIL}`}>
                    {SUPPORT_EMAIL}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
