import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Footer } from "@/components/footer"
import { ALT_BG, card, Eyebrow, GHOST_BTN, gold, H1, H2, ink, muted, PAGE_BG, PRIMARY_BTN, serif, SiteHeader } from "@/components/site/ui"
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
    <div className={PAGE_BG}>
      <SiteHeader />
      <main>
        {/* 1. Intro and rewards */}
        <section className="relative overflow-hidden pb-16 pt-16 lg:pt-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,201,138,0.08),transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Eyebrow>Referral program</Eyebrow>
            <H1>
              Refer someone. <em className={gold}>You both get paid.</em>
            </H1>
            <p className={`mx-auto mt-5 max-w-xl text-lg leading-relaxed ${muted}`}>{REFERRAL_TEXT}</p>
            <div className="mx-auto mt-10 grid max-w-xl gap-4 sm:grid-cols-2">
              {REWARDS.map(({ plan, reward }, n) => (
                <div key={plan} className={n ? "rounded-2xl border border-[#e8c98a]/35 bg-white/[0.04] p-6" : `${card} p-6`}>
                  <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${n ? gold : muted}`}>{plan} plan</p>
                  <p className={`${serif} ${ink} mt-2 text-5xl`}>${reward}</p>
                  <p className={`mt-1 text-sm ${muted}`}>for you, and ${reward} for them</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. How it works */}
        <section className={`border-t border-white/[0.06] ${ALT_BG} py-20`}>
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Eyebrow>How it works</Eyebrow>
            <H2>
              Three steps, <em className={gold}>no sign-up.</em>
            </H2>
            <ol className="mt-10 grid gap-10 md:grid-cols-3">
              {STEPS.map((step, n) => (
                <li key={step} className="border-t border-white/10 pt-5">
                  <p className={`font-mono text-xs ${gold}`}>0{n + 1}</p>
                  <p className={`mt-3 text-base leading-relaxed ${ink}`}>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 3. Rules */}
        <section className="border-t border-white/[0.06] py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Eyebrow>The rules</Eyebrow>
            <H2>
              Simple and <em className={gold}>fair.</em>
            </H2>
            <ul className="mt-10 space-y-4">
              {RULES.map((rule) => (
                <li key={rule} className={`flex gap-3 text-base leading-relaxed ${muted}`}>
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#9fd3a8]" aria-hidden />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/plans" className={PRIMARY_BTN}>See the plans <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <Link href="/contact" className={GHOST_BTN}>Ask a question</Link>
            </div>
            <p className={`mt-8 text-xs leading-relaxed ${muted} opacity-80`}>{SITE_DISCLAIMER}</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
