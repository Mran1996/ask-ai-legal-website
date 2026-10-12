import type { Metadata } from "next"
import Link from "next/link"
import { Check, Lock, ShieldCheck } from "lucide-react"
import { CineNav } from "@/components/cinematic/nav"
import { Footer } from "@/components/footer"
import { StripeBuyButton } from "@/components/payments/stripe-buy-button"
import { MaintenanceEnroll } from "@/components/payments/maintenance-enroll"
import {
  CONSULT_CTA_LABEL,
  CONSULT_HREF,
  PRICING_NOTICE,
  PURCHASE_INCLUSIONS,
  SITE_URL,
  SUPPORT_EMAIL,
} from "@/lib/site-config"

const TITLE = "Secure payment"
const DESCRIPTION =
  "Pay for your Ask AI Legal purchase ($3,997.00 one time) or enroll in optional maintenance ($125.00 per month)."

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

/**
 * Each item has its own Stripe Buy Button, set in Vercel:
 *   NEXT_PUBLIC_STRIPE_PURCHASE_BUY_BUTTON_ID    → $3,997.00 one-time price
 *   NEXT_PUBLIC_STRIPE_MAINTENANCE_BUY_BUTTON_ID → $125.00 / month recurring price
 * Until a button is configured, that item shows a contact fallback instead of a checkout.
 */
const PURCHASE_BUTTON_ID = process.env.NEXT_PUBLIC_STRIPE_PURCHASE_BUY_BUTTON_ID?.trim() ?? ""
const MAINTENANCE_BUTTON_ID = process.env.NEXT_PUBLIC_STRIPE_MAINTENANCE_BUY_BUTTON_ID?.trim() ?? ""

function CheckoutUnavailable({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-white/15 bg-white/5 px-5 py-5 text-sm leading-relaxed text-white/75">
      {children}{" "}
      <Link href={CONSULT_HREF} className="font-semibold text-gold underline underline-offset-2">
        {CONSULT_CTA_LABEL}
      </Link>
      .
    </div>
  )
}

export default function PayPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <link rel="preconnect" href="https://js.stripe.com" />
      <link rel="preconnect" href="https://buy.stripe.com" />
      <link rel="preconnect" href="https://m.stripe.network" />
      <link rel="dns-prefetch" href="https://js.stripe.com" />

      <CineNav />

      <main className="flex-grow">
        <section className="section-navy section-pad-under-header">
          <div className="container-main max-w-2xl">
            <div className="text-center">
              <p className="firm-label text-gold">Secure payment</p>
              <div className="gold-rule mx-auto mb-6 mt-2" />
              <h1 className="font-display text-3xl leading-tight text-white sm:text-4xl">Pay for Ask AI Legal</h1>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/70">
                The one-time purchase and optional maintenance are separate payments. Please review your written
                purchase summary and the terms that govern your purchase before paying.
              </p>
            </div>

            {/* One-time purchase */}
            <article className="mt-10 rounded-md border-2 border-gold/40 bg-white/[0.03] p-6 sm:p-8" aria-labelledby="pay-purchase">
              <p className="firm-label text-gold">One-time purchase</p>
              <h2 id="pay-purchase" className="mt-2 font-display text-2xl text-white">
                Ask AI Legal
              </h2>
              <p className="mt-2 font-display text-3xl font-semibold text-white">
                $3,997.00 <span className="text-base font-normal text-white/60">USD, charged once</span>
              </p>
              <ul className="mt-6 space-y-2.5">
                {PURCHASE_INCLUSIONS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/75">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-white/55">
                Applicable taxes and any third-party charges are listed in your purchase summary. Third-party AI usage,
                research subscriptions, and cloud services are separate unless expressly included there.
              </p>
              <div className="mt-6 flex justify-center">
                {PURCHASE_BUTTON_ID ? (
                  <StripeBuyButton buyButtonId={PURCHASE_BUTTON_ID} />
                ) : (
                  <CheckoutUnavailable>
                    Online checkout for the purchase isn&apos;t available yet. We&apos;ll send a secure payment link
                    with your purchase summary after your consultation.
                  </CheckoutUnavailable>
                )}
              </div>
            </article>

            {/* Optional maintenance */}
            <article className="mt-8 rounded-md border border-white/15 bg-white/[0.03] p-6 sm:p-8" aria-labelledby="pay-maintenance">
              <p className="firm-label text-gold">Optional · recurring</p>
              <h2 id="pay-maintenance" className="mt-2 font-display text-2xl text-white">
                Maintenance
              </h2>
              <p className="mt-2 font-display text-3xl font-semibold text-white">
                $125.00 <span className="text-base font-normal text-white/60">USD per month, billed monthly</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Supported software updates, maintenance of existing AI connections, compatibility fixes, and technical
                assistance within the maintenance plan&rsquo;s stated limits. Maintenance is optional. Coverage,
                billing, service limits, and cancellation terms are provided before enrollment.
              </p>
              <div className="mt-6">
                {MAINTENANCE_BUTTON_ID ? (
                  <MaintenanceEnroll buyButtonId={MAINTENANCE_BUTTON_ID} />
                ) : (
                  <CheckoutUnavailable>
                    Maintenance enrollment is arranged separately after we provide the maintenance terms.
                  </CheckoutUnavailable>
                )}
              </div>
            </article>

            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-white/50">
              <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>Card details are entered on Stripe&apos;s secure checkout, not on this site.</span>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-sm border border-white/10 bg-white/5 px-4 py-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
              <p className="text-xs leading-relaxed text-white/55">
                {PRICING_NOTICE}
                <br />
                Questions?{" "}
                <a className="text-gold underline" href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
