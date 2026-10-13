import type { Metadata } from "next"
import Link from "next/link"
import { NeonButton } from "@/components/neon-button"
import {
  CONSULT_CTA_LABEL,
  CONSULT_HREF,
  SITE_DISCLAIMER,
} from "@/lib/site-config"
import { CineNav } from "@/components/cinematic/nav"
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
    title: "Research you can check",
    description:
      "Source links let you open the opinions, statutes, court rules, and documents behind your research. AI can make mistakes, so check each source before relying on it.",
  },
  {
    icon: BookOpen,
    title: "Document drafting for your review",
    description:
      "Prepare editable drafts with personalized document generation. Review the facts, citations, formatting, and applicable court requirements before filing.",
  },
  {
    icon: Receipt,
    title: "One price, stated up front",
    description:
      "A one-time purchase of $3,997 for your installed copy, setup, personal training, a written getting-started guide, and 30 days of installation support. Optional maintenance is $125 per month.",
  },
  {
    icon: Clock,
    title: "Personal setup and training",
    description:
      "We install and configure your workspace, set it up around your issues and goals, and show you how to use it.",
  },
  {
    icon: BadgeCheck,
    title: "Clear about data handling",
    description:
      "We explain which features operate locally, which send information to outside providers, and the settings available to you.",
  },
  {
    icon: Shield,
    title: "You stay in control",
    description:
      "You decide what to research, draft, and file. Ask AI Legal is not a law firm and does not represent you.",
  },
]

const standards = [
  {
    title: "Install before you run it",
    text: "We configure the workspace with you, then show you how it works.",
  },
  {
    title: "Clarity before commitment",
    text: "You know the price, the included services, and any additional costs before you purchase.",
  },
  {
    title: "Sources you can open",
    text: "Research comes with source links so you can read the original and confirm it supports your point.",
  },
  {
    title: "Support after setup",
    text: "30 days of installation support, with optional maintenance afterward.",
  },
]

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Ask AI Legal installs a legal workspace on your computer: a $3,997 one-time purchase with setup and personal training, plus optional $125/month maintenance.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <CineNav />

      <main className="flex-grow">
        <section className="section-navy section-pad-under-header">
          <div className="container-main max-w-4xl">
            <p className="firm-label">About us</p>
            <div className="gold-rule mb-8" />
            <h1 className="firm-title text-white">
              Your legal workspace, installed and explained.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
              Ask AI Legal installs legal workspace software on your computer and shows you how to use it. We exist
              because people handling important paperwork should have organized, capable tools of their own — at a
              price that is stated up front.
            </p>
          </div>
        </section>

        <section className="section-pad bg-cream">
          <div className="container-main">
            <div className="max-w-2xl">
              <p className="firm-label text-gold-dark">What makes us different</p>
              <div className="gold-rule mb-6" />
              <h2 className="firm-title text-navy">
                What you get when you work from home
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                We built our service around what people actually need: a configured workspace, sources they can check
                themselves, and clear pricing. Here is what that means in practice.
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
                Everyone working from home should have research tools behind them, sources they can verify, and a
                clear picture of what they are paying for. That is the bar we hold ourselves to on every install.
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
          </div>
        </section>

        <section className="section-pad bg-cream-dark">
          <div className="container-main grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold text-navy">
                Who we serve
              </h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                Families fighting for a loved one. Self-represented people who want to stay organized. Advocates
                pushing for reform. Anyone who wants capable tools of their own.
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                We install and configure Ask AI Legal and show you how to use it. You remain in control — working from
                home, informed, and organized.
              </p>
            </div>
            <div className="rounded-sm border border-gold/30 bg-white p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-navy">
                Important notice
              </p>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                {SITE_DISCLAIMER}
              </p>
              <NeonButton href={CONSULT_HREF} className="btn-neon-light mt-8 inline-flex">
                {CONSULT_CTA_LABEL}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </NeonButton>
              <p className="mt-4 text-xs text-gray-500">
                Or{" "}
                <Link href="/pricing" className="text-gold-dark underline underline-offset-2">
                  see pricing
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
