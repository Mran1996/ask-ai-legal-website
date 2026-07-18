import type { Metadata } from "next"
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

export default function PayPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow pt-[7.25rem] sm:pt-[7.75rem]">
        <section className="section-navy section-pad">
          <div className="container-main max-w-2xl">
            <p className="firm-label">Secure payment</p>
            <div className="gold-rule mb-8" />
            <h1 className="firm-title text-white">Case file review deposit</h1>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Pay your {CASE_FILE_REVIEW_PRICE_DISPLAY} case file review deposit to open your case.
              This deposit is credited toward your document preparation. After payment, we review
              your information and email your document plan and flat-fee quote.
            </p>

            <div className="mt-10 rounded-sm border border-gold/25 bg-white/95 p-6 sm:p-8">
              <StripeBuyButton />
            </div>

            <ul className="mt-8 space-y-2 text-sm text-white/60">
              <li>Secure checkout powered by Stripe.</li>
              <li>Deposit credited toward your document package.</li>
              <li>
                Questions? Email{" "}
                <a className="text-gold underline" href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>
                .
              </li>
            </ul>

            <p className="mt-8 text-sm text-white/50">{SITE_DISCLAIMER}</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
