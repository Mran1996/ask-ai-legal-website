import type { Metadata } from "next"
import Link from "next/link"
import { NeonButton } from "@/components/neon-button"
import {
  SUPPORT_MAILTO,
  FILE_REVIEW_DEPOSIT_LABEL,
  CASE_REVIEW_CTA_LABEL,
  SITE_DISCLAIMER,
} from "@/lib/site-config"
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
    title: "Thousands of files, one home setup",
    description:
      "Your install is wired to research filings, motions, and published sources — the kind of depth that would take weeks to compile manually — so you can dig in from home.",
  },
  {
    icon: BadgeCheck,
    title: "Source verification",
    description:
      "Every source stays traceable to the original publication, stored in your file, and verified — so from home you can open it, read it, and check it yourself.",
  },
  {
    icon: Receipt,
    title: "Custom quote, no hourly clock",
    description: `A custom-quote ${FILE_REVIEW_DEPOSIT_LABEL.toLowerCase()}, credited toward one flat quote for your installed setup. You know the full cost before you commit to either step.`,
  },
  {
    icon: BookOpen,
    title: "Tools you run yourself",
    description:
      "Document tools, research, and next steps live in your workspace — configured for your facts and jurisdiction so you draft and refine from home.",
  },
  {
    icon: Clock,
    title: "Installed fast",
    description:
      "We configure Ask AI Legal for your situation — usually within 72 hours — so you are not waiting weeks while deadlines approach.",
  },
  {
    icon: Shield,
    title: "We install. You stay in control.",
    description:
      "You describe your situation. We install and configure. You do everything you need from the comfort of your home.",
  },
]

const standards = [
  {
    title: "Install before you run it",
    text: "We configure the workspace around your matter — not a template dump and a billable hour.",
  },
  {
    title: "Clarity before commitment",
    text: "You know the scope, the timeline, and the investment before the install begins.",
  },
  {
    title: "Verified over invented",
    text: "Every reference in your setup is retrieved from source and checked so you can verify it yourself.",
  },
  {
    title: "Service without the clock",
    text: "Install refinements and follow-through included — not metered minute by minute.",
  },
]

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Ask AI Legal installs and configures tools you use from home. Custom quote to start, one flat price for your setup — no hourly billing. Not a law firm.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow">
        <section className="section-navy section-pad-under-header">
          <div className="container-main max-w-4xl">
            <p className="firm-label">About us</p>
            <div className="gold-rule mb-8" />
            <h1 className="firm-title text-white">
              We do the install. You work from home.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
              Ask AI Legal installs and configures the tools you use from the comfort of
              your home. We exist because people handling important paperwork should not
              wait on someone else to do the work for them — and they should not have to
              choose between quality tools and affordability.
            </p>
          </div>
        </section>

        <section className="section-pad bg-cream">
          <div className="container-main">
            <div className="max-w-2xl">
              <p className="firm-label text-gold-dark">What makes us different</p>
              <div className="gold-rule mb-6" />
              <h2 className="firm-title text-navy">
                Capabilities that change how you work from home
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                We built our service around what clients actually need: a configured setup,
                verified sources you can check yourself, and tools you run from home —
                not waiting for someone else to do it for you. Here is what that means in
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

        <section className="section-pad bg-white">
          <div className="container-main">
            <div className="mx-auto max-w-3xl text-center">
              <p className="firm-label text-gold-dark">Our standard</p>
              <div className="gold-rule mx-auto mb-6" />
              <h2 className="firm-title text-navy">
                The home setup your situation deserves
              </h2>
              <p className="mt-5 text-gray-600 leading-relaxed">
                Every client should work from home with research tools behind them,
                sources they can verify, and a clear picture of what to do next. That is
                the bar we hold ourselves to — every matter, every install.
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
                &ldquo;We don&apos;t ask you to wait for someone else to do the work. We
                install Ask AI Legal so you can handle everything from home — with more
                research, more speed, and more clarity.&rdquo;
              </p>
            </blockquote>
          </div>
        </section>

        <section className="section-pad bg-cream-dark">
          <div className="container-main grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold text-navy">
                Who we serve
              </h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                Families fighting for a loved one. Self-represented people who refuse to
                be outgunned. Advocates pushing for reform. Anyone who needs serious tools
                and will no longer accept being priced out of them.
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                We install and configure Ask AI Legal for your matter. You remain in
                control — working from home, informed, and equipped.
              </p>
            </div>
            <div className="rounded-sm border border-gold/30 bg-white p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-navy">
                Important notice
              </p>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                {SITE_DISCLAIMER}
              </p>
              <NeonButton href={SUPPORT_MAILTO} className="btn-neon-light mt-8 inline-flex">
                {CASE_REVIEW_CTA_LABEL}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </NeonButton>
              <p className="mt-4 text-xs text-gray-500">
                Or{" "}
                <Link href="/pay" className="text-gold-dark underline underline-offset-2">
                  start your setup
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
