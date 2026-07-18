import type { Metadata } from "next"
import { Check, Lock, ShieldCheck } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { StripeBuyButton } from "@/components/payments/stripe-buy-button"
import {
  CASE_FILE_REVIEW_PRICE_DISPLAY,
  SITE_DISCLAIMER,
  SITE_URL,
  SUPPORT_EMAIL,
} from "@/lib/site-config"

const TITLE = "Pay your case file review deposit"
const DESCRIPTION = `Securely pay your ${CASE_FILE_REVIEW_PRICE_DISPLAY} case file review deposit to open your case. Credited toward your document preparation. Not a law firm.`

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
  "Fully credited toward your document package",
  "We review your information and email your document plan + flat-fee quote",
  "Documents are approved by a licensed attorney before delivery",
]

export default function PayPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow pt-[7.25rem] sm:pt-[7.75rem]">
        <section className="section-navy section-pad">
          <div className="container-main max-w-lg">
            <div className="mx-auto w-full max-w-md">
              <div className="text-center">
                <p className="firm-label text-gold">Secure payment</p>
                <div className="gold-rule mx-auto mb-6 mt-2" />
                <h1 className="font-display text-3xl leading-tight text-white sm:text-4xl">
                  Case file review deposit
                </h1>
                <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-white/70">
                  A one-time {CASE_FILE_REVIEW_PRICE_DISPLAY} deposit to open your case — fully
                  credited toward your document preparation.
                </p>
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/40 ring-1 ring-gold/20">
                <div className="border-b border-gray-100 bg-cream/60 px-6 py-5 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    One-time deposit
                  </p>
                  <p className="mt-1 font-display text-4xl font-semibold text-navy">
                    {CASE_FILE_REVIEW_PRICE_DISPLAY}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Credited toward your documents</p>
                </div>

                <div className="px-6 py-7">
                  <div className="flex justify-center [&_stripe-buy-button]:w-full">
                    <StripeBuyButton />
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                    <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>Secure checkout powered by Stripe</span>
                  </div>
                </div>
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
