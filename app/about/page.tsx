import type { Metadata } from "next"
import Link from "next/link"
import { NeonButton } from "@/components/neon-button"
import { SUPPORT_MAILTO, CASE_REVIEW_PRICE_DISPLAY, TOTAL_PRICE_DISPLAY } from "@/lib/site-config"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Clock,
  FileSearch,
  Receipt,
  Shield,
} from "lucide-react"

const capabilities = [
  {
    icon: FileSearch,
    title: "We actually listen",
    description:
      "You share your situation. We read what you send — not filling in a template, but understanding what you're dealing with. That's what the case review is for.",
  },
  {
    icon: BadgeCheck,
    title: "Honest fit decision",
    description:
      "If we can help, we tell you how. If not, we refund your case review and explain why. No sales pitch, no pressure.",
  },
  {
    icon: Receipt,
    title: "Two flat fees, no hourly clock",
    description:
      `${CASE_REVIEW_PRICE_DISPLAY} case review, then ${TOTAL_PRICE_DISPLAY} total for complete hands-on support — walkthrough and 30 days of guidance included.`,
  },
  {
    icon: BookOpen,
    title: "Hands-on walkthrough",
    description:
      "Screen share. Video call. We show you exactly how to use your setup until you're confident — not a link and goodbye.",
  },
  {
    icon: Clock,
    title: "30 days of support",
    description:
      "Email, call — you hit a snag, we help you fix it. You're not abandoned after payment.",
  },
  {
    icon: Shield,
    title: "Someone in your corner",
    description:
      "Tell us what you're facing. We understand. We guide you step by step. You stay in control of every filing and every decision.",
  },
]

const standards = [
  {
    title: "Depth before draft",
    text: "Planning built on exhaustive research — not a first impression and a billable hour.",
  },
  {
    title: "Clarity before commitment",
    text: "You know the scope, the timeline, and the investment before work begins.",
  },
  {
    title: "Verified over invented",
    text: "Every reference in your documents is retrieved from source and checked twice before delivery.",
  },
  {
    title: "Service without the clock",
    text: "Revisions, availability, and follow-through included — not metered minute by minute.",
  },
]

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Ask AI Legal provides case review and hands-on support — someone in your corner when you're facing divorce, custody, housing, or civil disputes. Not a law firm.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow">
        {/* Hero */}
        <section className="section-navy section-pad-under-header">
          <div className="container-main max-w-4xl">
            <p className="firm-label">About us</p>
            <div className="gold-rule mb-8" />
            <h1 className="firm-title text-white">
              Built for people who deserve more than the status quo
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
              Ask AI Legal exists for people who shouldn&apos;t have to figure it out alone.
              We listen to your situation, tell you honestly if we can help, walk you through
              your complete setup hands-on, and stay with you for 30 days — because your
              situation is too important to be kept in the dark or priced out of help.
            </p>
          </div>
        </section>

        {/* What makes us different */}
        <section className="section-pad bg-cream">
          <div className="container-main">
            <div className="max-w-2xl">
              <p className="firm-label text-gold-dark">What makes us different</p>
              <div className="gold-rule mb-6" />
              <h2 className="firm-title text-navy">
                Support that actually shows up
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                We built our service around what clients actually need: someone who listens,
                honest guidance, a hands-on walkthrough, and real support while they move
                forward — not templates they fill in alone.
              </p>
            </div>

            <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((item) => (
                <li key={item.title} className="firm-card">
                  <item.icon className="h-8 w-8 text-gold-dark" aria-hidden />
                  <h3 className="mt-5 font-display text-xl font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Compare without comparing */}
        <section className="section-pad bg-white">
          <div className="container-main">
            <div className="mx-auto max-w-3xl text-center">
              <p className="firm-label text-gold-dark">Our standard</p>
              <div className="gold-rule mx-auto mb-6" />
              <h2 className="firm-title text-navy">
                The support your situation deserves
              </h2>
              <p className="mt-5 text-gray-600 leading-relaxed">
                Every client should feel understood, guided, and confident —
                with someone in their corner, not left staring at blank forms alone.
                That is the bar we hold ourselves to.
              </p>
            </div>

            <ul className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2">
              {standards.map((item) => (
                <li
                  key={item.title}
                  className="border-l-2 border-gold pl-6 py-2"
                >
                  <h3 className="font-display text-xl font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>

            <blockquote className="mx-auto mt-16 max-w-2xl border-t border-b border-navy/10 py-10 text-center">
              <p className="font-display text-2xl italic leading-relaxed text-navy">
                &ldquo;We don&apos;t ask you to accept less. We built a service
                that delivers more — more research, more speed, more clarity —
                because your situation is too important for anything else.&rdquo;
              </p>
            </blockquote>
          </div>
        </section>

        {/* Mission + disclaimer */}
        <section className="section-pad bg-cream-dark">
          <div className="container-main grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold text-navy">
                Who we serve
              </h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                Families fighting for a loved one. Self-represented defendants
                who refuse to be outgunned. Advocates pushing for reform. People
                who need serious legal preparation and will no longer accept
                being priced out of it.
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                We guide and support you. You remain in control of every filing
                and every decision — informed, equipped, and not alone.
              </p>
            </div>
            <div className="rounded-sm border border-gold/30 bg-white p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-navy">
                Important notice
              </p>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                Ask AI Legal is not a law firm and does not provide legal advice.
                You review everything and take every next step on your own.
              </p>
              <NeonButton href="/pay" className="btn-neon-light mt-8 inline-flex">
                Tell us what you&apos;re facing
                <ArrowRight className="h-4 w-4" aria-hidden />
              </NeonButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
