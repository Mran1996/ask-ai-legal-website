import type { Metadata } from "next"
import Link from "next/link"
import { NeonButton } from "@/components/neon-button"
import { SUPPORT_MAILTO, CASE_FILE_REVIEW_PRICE_DISPLAY } from "@/lib/site-config"
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
    title: "Thousands of files, one plan",
    description:
      "Your matter is researched against a vast body of filings, motions, and published sources — the kind of depth that would take weeks to compile manually. We deliver it as part of your preparation.",
  },
  {
    icon: BadgeCheck,
    title: "Source verification",
    description:
      "Every source we use is retrieved from the original publication, stored in your case file, and verified in a separate review pass before it reaches your documents — never invented, never guessed.",
  },
  {
    icon: Receipt,
    title: "Two flat fees, no hourly clock",
    description:
      `A ${CASE_FILE_REVIEW_PRICE_DISPLAY} case file review, credited toward one flat quote for your documents. You know the full cost before you commit to either step.`,
  },
  {
    icon: BookOpen,
    title: "Precision drafting",
    description:
      "Every motion, petition, and response is prepared for your facts, your jurisdiction, and your goals — formatted, referenced, and ready for your review.",
  },
  {
    icon: Clock,
    title: "Delivered fast",
    description:
      "Preparation moves on your timeline. No waiting weeks for a return call while deadlines approach.",
  },
  {
    icon: Shield,
    title: "Full-service, start to finish",
    description:
      "You describe your situation. We generate your documents — researched, drafted, and revised until ready.",
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
    "What makes Ask AI Legal different: institutional-scale file research, verified source work, and a two-step flat fee — no hourly billing, no retainer trap.",
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
              Ask AI Legal is a full-service document preparation company.
              We exist because most people handling important paperwork on their own cannot access the depth
              of research, speed, and preparation serious situations require —
              and they should not have to choose between quality and affordability.
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
                Capabilities that change what preparation looks like
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                We built our service around what clients actually need: exhaustive
                research, clear document planning, and documents prepared for them
                — not templates they fill in alone. Here is what that means in
                practice.
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
                The preparation your case deserves
              </h2>
              <p className="mt-5 text-gray-600 leading-relaxed">
                Every client should walk into court with research behind them,
                documents they trust, and a clear picture of what lies ahead.
                That is the bar we hold ourselves to — every case, every time.
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
                because your case is too important for anything else.&rdquo;
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
                We prepare your documents and strategy. You remain in control of
                your case — informed, equipped, and ready.
              </p>
            </div>
            <div className="rounded-sm border border-gold/30 bg-white p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-navy">
                Important notice
              </p>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                Ask AI Legal generates documents only. We are not a law firm
                and do not provide legal advice. All materials are prepared for your
                review and use at your own discretion.
              </p>
              <NeonButton href={SUPPORT_MAILTO} className="btn-neon-light mt-8 inline-flex">
                Email for a free case review
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
