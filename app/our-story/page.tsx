import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Footer } from "@/components/footer"
import { ALT_BG, Eyebrow, GHOST_BTN, gold, H1, H2, ink, muted, PAGE_BG, PRIMARY_BTN, serif, SiteHeader } from "@/components/site/ui"

export const metadata: Metadata = {
  title: "Our Story | Why We Built Ask AI Legal",
  description:
    "Ask AI Legal started with one person going to court without a lawyer. Why we built a private legal assistant for people who represent themselves.",
  alternates: { canonical: "/our-story" },
}

const P = `text-lg leading-[1.75] ${muted}`

export default function OurStoryPage() {
  return (
    <div className={PAGE_BG}>
      <SiteHeader />
      <main>
        {/* 1. Intro */}
        <section className="relative overflow-hidden pb-12 pt-16 lg:pt-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,201,138,0.08),transparent_60%)]" />
          <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
            <Eyebrow>Our story</Eyebrow>
            <H1>
              Why we built <em className={gold}>Ask AI Legal.</em>
            </H1>
            <p className={`mt-5 text-lg leading-relaxed ${muted}`}>It started with one person going to court without a lawyer.</p>
          </div>
        </section>

        {/* 2. The story (text kept word for word from the earlier page) */}
        <section className={`border-t border-white/[0.06] ${ALT_BG} pb-20 pt-14`}>
          <article className="mx-auto max-w-2xl space-y-6 px-4 sm:px-6">
            <p className={`${serif} ${ink} text-2xl leading-snug sm:text-[1.7rem]`}>
              Ask AI Legal started with our founder&apos;s own legal problems. Our founder could not afford a lawyer and went to court alone.
            </p>
            <p className={P}>
              ChatGPT and Claude made too many mistakes for court work. They got the format wrong and cited the wrong cases. Deadlines were
              missed, and our founder got called out for filing papers a chatbot had drafted.
            </p>
            <p className={P}>
              So our founder reached out to others for help and input, and together we started building something better. Over three years,
              we fed it the best legal YouTube channels, real court cases, citations, and the rules for what each filing has to include. We
              added helpers that keep working in the background, so it finds the right documents, cases, and files without wasting time or
              money. Every mistake became a lesson it kept.
            </p>

            <blockquote className="!my-10 border-l-2 border-[#e8c98a]/60 py-1 pl-6">
              <p className={`${serif} ${gold} text-3xl italic leading-tight`}>Every mistake became a lesson it kept.</p>
            </blockquote>

            <p className={P}>
              Then friends and family asked for help with their own paperwork. That is when we knew a tool built for one case could help other
              people too.
            </p>
            <p className={P}>
              It has taken countless hours and a lot of our own money to get right. As the technology improves, we keep up with it and keep
              making Ask AI Legal better.
            </p>
            <p className={P}>
              People ask us why they should pay for something that can make mistakes. They are right, it can. So can the firm that charges
              thousands, where an intern may draft your papers, and the lawyer has dozens of other files and limited hours for yours. With Ask
              AI Legal, you read every draft yourself, and you can open the source behind each citation before anything is filed.
            </p>
            <p className={`${serif} ${gold} pt-4 text-xl`}>The Ask AI Legal team</p>
          </article>
        </section>

        {/* 3. Closing */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <H2>
              See what we built, <em className={gold}>then decide.</em>
            </H2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/#brain" className={GHOST_BTN}>See how it works</Link>
              <Link href="/plans" className={PRIMARY_BTN}>See plans <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
