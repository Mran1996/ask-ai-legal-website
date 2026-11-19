import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { Footer } from "@/components/footer"
import { ALT_BG, Eyebrow, GHOST_BTN, gold, H1, H2, ink, muted, PAGE_BG, PRIMARY_BTN, SiteHeader } from "@/components/site/ui"
import { GUARANTEE_TEXT, SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "100% Money-Back Guarantee",
  description:
    "If Ask AI Legal won't install or run on your computer and we can't fix it, you get every dollar back.",
  alternates: { canonical: "/guarantee" },
}

/** Only restates GUARANTEE_TEXT. Do not add terms (time limits, conditions) that are not in the purchase agreement. */
const POINTS = [
  { t: "When it applies", b: "Ask AI Legal will not install or run on your computer, and we cannot fix it." },
  { t: "What you get", b: "Every dollar you paid for your plan, back. No hassle." },
  { t: "How to ask", b: "Contact us by phone, email or the contact form, and tell us what happened on your computer." },
]

export default function GuaranteePage() {
  return (
    <div className={PAGE_BG}>
      <SiteHeader />
      <main>
        {/* 1. Intro */}
        <section className="relative overflow-hidden pb-12 pt-16 lg:pt-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,201,138,0.08),transparent_60%)]" />
          <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
            <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#e8c98a]/40">
              <ShieldCheck className="h-6 w-6 text-[#e8c98a]" aria-hidden />
            </span>
            <Eyebrow>Money-back guarantee</Eyebrow>
            <H1>
              If it won&apos;t run, <em className={gold}>you get every dollar back.</em>
            </H1>
            <p className={`mt-5 text-lg leading-relaxed ${muted}`}>{GUARANTEE_TEXT}</p>
          </div>
        </section>

        {/* 2. How it works */}
        <section className={`border-t border-white/[0.06] ${ALT_BG} pb-20 pt-14`}>
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ol className="grid gap-10 md:grid-cols-3">
              {POINTS.map((p, n) => (
                <li key={p.t} className="border-t border-white/10 pt-5">
                  <p className={`font-mono text-xs ${gold}`}>0{n + 1}</p>
                  <h2 className={`mt-3 text-lg font-semibold ${ink}`}>{p.t}</h2>
                  <p className={`mt-2 text-sm leading-relaxed ${muted}`}>{p.b}</p>
                </li>
              ))}
            </ol>
            <p className={`mt-10 text-sm ${muted}`}>
              Email{" "}
              <a href={SUPPORT_MAILTO} className="underline underline-offset-4 hover:text-[#f3ead8]">
                {SUPPORT_EMAIL}
              </a>{" "}
              or use the{" "}
              <Link href="/contact" className="underline underline-offset-4 hover:text-[#f3ead8]">
                contact page
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 3. Closing */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <H2>
              Questions before you buy? <em className={gold}>Ask us.</em>
            </H2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className={GHOST_BTN}>Ask a question</Link>
              <Link href="/plans" className={PRIMARY_BTN}>See plans <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
