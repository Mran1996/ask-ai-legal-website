import type { Metadata } from "next"
import Link from "next/link"
import { Check, Mail } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PaySuccessPurchase } from "@/components/analytics/pay-success-purchase"
import {
  CASE_REVIEW_PRICE_DISPLAY,
  CASE_REVIEW_LABEL,
  SITE_URL,
  SUPPORT_EMAIL,
} from "@/lib/site-config"

const TITLE = "Payment received"
const DESCRIPTION = `Your ${CASE_REVIEW_LABEL.toLowerCase()} payment was received. We will read what you send and reply within one business day.`

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

export default function PaySuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PaySuccessPurchase />
      <Navigation />

      <main className="flex-grow">
        <section className="section-navy section-pad-under-header">
          <div className="container-main max-w-lg">
            <div className="mx-auto w-full max-w-md text-center">
              <p className="firm-label text-gold">Payment confirmed</p>
              <div className="gold-rule mx-auto mb-6 mt-2" />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                <Check className="h-7 w-7 text-gold" aria-hidden />
              </div>

              <h1 className="mt-6 font-display text-3xl leading-tight text-white sm:text-4xl">
                Thank you — your case review is started
              </h1>
              <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-white/70">
                Your {CASE_REVIEW_PRICE_DISPLAY} {CASE_REVIEW_LABEL.toLowerCase()} was received. It is
                credited in full toward complete hands-on support if we&apos;re the right fit.
              </p>

              <div className="mt-8 rounded-sm border border-white/10 bg-white/5 px-5 py-5 text-left">
                <p className="text-sm font-semibold text-white">What happens next</p>
                <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-white/70">
                  <li>Share your situation and upload what you have.</li>
                  <li>We read everything and reply within one business day.</li>
                  <li>If we can help, we&apos;ll schedule your walkthrough. If not, we refund you.</li>
                </ul>
              </div>

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
