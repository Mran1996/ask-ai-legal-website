"use client"

import Link from "next/link"
import { ArrowRight, ClipboardCheck, Feather, GraduationCap, Lock, Orbit, Play, Scale, ShieldCheck } from "lucide-react"
import { ReferralStarSticker } from "@/components/referral-star"
import { VoiceCallButton } from "@/components/voice-call-button"
import { CONSULT_CTA_LABEL, CONSULT_HREF, GUARANTEE_HREF, MAINTENANCE_PRICE_USD, STARTER_PRICE_USD } from "@/lib/site-config"

/** Each card matches a real feature in the app (Second Brain, the Learner, Writing Check, Second Opinion,
 *  the plain-language pass, Privacy mode). Check the app before changing any claim. */
const STANDOUTS = [
  {
    icon: Orbit,
    name: "Second Brain",
    title: "Fix a mistake once",
    body: "Save a correction one time. Every draft after that follows it.",
  },
  {
    icon: GraduationCap,
    name: "Keeps learning",
    title: "Studies how good writers argue",
    body: "In the background it reads writing guides and videos from law school writing centers, law professors, judges and bar associations, and saves the lessons.",
  },
  {
    icon: ClipboardCheck,
    name: "Writing Check",
    title: "Scores every draft",
    body: "Flags machine-sounding phrases, long sentences, missing record cites, missing headings and word limits before you file.",
  },
  {
    icon: Scale,
    name: "Second Opinion",
    title: "A tough read before you file",
    body: "A second, different model reads your paper the way the other side would. You choose which changes to keep.",
  },
  {
    icon: Feather,
    name: "Sounds like you",
    title: "Plain words, not robot words",
    body: "Stiff phrases like “utilize” and “delve into” become plain English. Quotes are never touched, and a change that would alter a fact is undone.",
  },
  {
    icon: Lock,
    name: "Privacy on",
    title: "Names stay private",
    body: "Names and case details are swapped for placeholders before anything is sent for drafting.",
  },
]

/** A real screenshot of the app, using only the fictional Rivera demo case. Never use a real person's matter. */
function AppShot() {
  return (
    <figure className="relative">
      <ReferralStarSticker className="absolute -right-3 -top-14 w-[96px] sm:-right-6 sm:-top-16 sm:w-[124px]" />
      <div className="absolute -inset-6 rounded-[2rem] bg-accent/10 blur-3xl" aria-hidden />
      <div className="relative overflow-hidden rounded-2xl border border-cream/10 shadow-2xl shadow-black/50">
        <div className="flex items-center gap-1.5 bg-[#0e1d30] px-4 py-2.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-cream/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-cream/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-cream/20" />
          <span className="ml-3 font-sans text-[11px] text-cream/50">Ask AI Legal</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/app-shots/chat-draft-rivera-no.webp"
          width={1920}
          height={1156}
          alt="The Ask AI Legal app with a sample case: the chat on the left and a finished Answer to the complaint on court paper on the right"
          className="block h-auto w-full"
          fetchPriority="high"
        />
      </div>
      <figcaption className="mt-3 text-center font-sans text-xs text-cream/45">The real app, shown with a sample case.</figcaption>
    </figure>
  )
}

export function WorkspaceHero() {
  return (
    <section className="relative overflow-hidden bg-ground pb-14 pt-28 sm:pb-20 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,176,52,0.10),transparent_55%)]" />
      <div className="cine-container relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div className="text-center lg:text-left">
            <p className="cine-label mb-4">Private legal workspace</p>
            <h1 className="font-display text-cream">
              <span className="block text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
                Your case. Your documents.
              </span>
              <span className="cine-serif block text-[clamp(2.2rem,4.8vw,3.8rem)] leading-[1.08] text-accent-light">
                On your own computer.
              </span>
            </h1>
            <p className="cine-body mx-auto mt-5 max-w-xl !text-lg !text-cream/80 lg:mx-0">
              Sort your court papers, look up the law, track your deadlines and get drafts you can edit. Your files stay with you.
            </p>

            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href={CONSULT_HREF} className="cine-btn-gold w-full sm:w-auto">
                {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="#samples" className="cine-btn-ghost w-full sm:w-auto">
                View sample documents
              </Link>
            </div>
            <Link
              href="#demo"
              className="mt-4 inline-flex items-center gap-2 font-sans text-sm text-cream/80 underline underline-offset-4 hover:text-accent-light"
            >
              <Play className="h-4 w-4 text-accent-light" aria-hidden /> Watch the walkthrough
            </Link>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 lg:justify-start gap-y-2 font-sans text-sm text-cream/80">
              <span>Questions? Call us now.</span>
              <VoiceCallButton showPhone />
            </div>

            <div className="mt-7 font-sans text-sm text-cream/70">
              <p className="text-base font-semibold text-cream">
                One-time purchase from ${STARTER_PRICE_USD.toLocaleString("en-US")}
              </p>
              <p className="mt-1">
                Optional maintenance ${MAINTENANCE_PRICE_USD}/month ·{" "}
                <Link href={GUARANTEE_HREF} className="inline-flex items-center gap-1 align-middle text-accent-light hover:underline">
                  <ShieldCheck className="h-4 w-4" aria-hidden /> Money-back guarantee
                </Link>
              </p>
            </div>
          </div>

          <AppShot />
        </div>

        <div className="mt-16 text-center">
          <p className="cine-label mb-3">Inside the app</p>
          <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-tight text-cream">
            What a chat window can&apos;t do.{" "}
            <span className="cine-serif text-accent-light">This can.</span>
          </h2>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STANDOUTS.map(({ icon: Icon, name, title, body }) => (
            <li key={name} className="cine-card flex gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-light">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-light/80">{name}</p>
                <h3 className="font-display text-lg font-semibold text-cream">{title}</h3>
                <p className="mt-1 font-sans text-sm leading-relaxed text-cream/65">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center font-sans text-xs text-cream/45">
          Software for people handling their own legal matters. Not a law firm, and not legal advice.
        </p>
      </div>
    </section>
  )
}
