import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CineNav } from "@/components/cinematic/nav"
import { Footer } from "@/components/footer"
import {
  REFERRAL_COMPLETE_REWARD_USD,
  REFERRAL_PAY_AFTER_DAYS,
  REFERRAL_NAME_WITHIN_DAYS,
  REFERRAL_STARTER_REWARD_USD,
  REFERRAL_TEXT,
  SITE_DISCLAIMER,
  SUPPORT_EMAIL,
} from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Referral Program",
  description: `Refer someone to Ask AI Legal and you each get $${REFERRAL_STARTER_REWARD_USD} on Starter or $${REFERRAL_COMPLETE_REWARD_USD} on Complete.`,
  alternates: { canonical: "/referrals" },
}

const REWARDS = [
  { plan: "Starter", reward: REFERRAL_STARTER_REWARD_USD },
  { plan: "Complete", reward: REFERRAL_COMPLETE_REWARD_USD },
]

const STEPS = [
  "Tell someone about Ask AI Legal. No sign-up or code needed.",
  "They buy a plan and put your name and email in the “Who referred you?” box on the thank-you page.",
  `We send both rewards ${REFERRAL_PAY_AFTER_DAYS} days after they install.`,
]

const RULES = [
  "Anyone can refer, except lawyers.",
  `The new customer must name you within ${REFERRAL_NAME_WITHIN_DAYS} days of buying, in the thank-you page box or by email to ${SUPPORT_EMAIL}.`,
  "You get your reward by PayPal or Zelle. The new customer gets theirs back on the card they paid with.",
  "If the new customer gets a refund, neither reward is paid.",
  "Each new customer earns one reward for one referrer, and you can’t refer yourself. There is no limit on how many people you refer.",
  "When you share Ask AI Legal, say that you earn a reward. Don’t promise results, give legal advice, or send spam.",
  "We can change or end this program at any time. Rewards already earned will still be paid.",
]

export default function ReferralsPage() {
  return (
    <div className="cine min-h-screen">
      <CineNav />
      <main className="pt-24 pb-10 sm:pt-28">
        <section className="relative bg-ground py-6 sm:py-10">
          <div className="cine-container relative">
            <div className="cine-card mx-auto max-w-3xl border-accent/30 p-6 sm:p-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/referral-star.png" alt="Get $100.00 referral" width={160} height={157} className="h-auto w-40" />
              <h1 className="cine-h2 mt-4 text-cream">Refer someone. You both get paid.</h1>
              <p className="cine-body mt-4">{REFERRAL_TEXT}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {REWARDS.map(({ plan, reward }) => (
                  <div key={plan} className="rounded-sm border border-cream/15 p-5">
                    <p className="text-sm text-cream/65">{plan} plan</p>
                    <p className="mt-1 font-display text-3xl font-semibold text-cream">${reward} each</p>
                  </div>
                ))}
              </div>

              <h2 className="mt-8 font-display text-xl font-semibold text-cream">How it works</h2>
              <ol className="cine-body mt-3 list-decimal space-y-2 pl-5">
                {STEPS.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>

              <h2 className="mt-8 font-display text-xl font-semibold text-cream">The rules</h2>
              <ul className="cine-body mt-3 list-disc space-y-2 pl-5">
                {RULES.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>

              <div className="mt-8">
                <Link href="/plans" className="cine-btn-gold">
                  See the plans <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
              <p className="mt-6 text-sm text-cream/60">{SITE_DISCLAIMER}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
