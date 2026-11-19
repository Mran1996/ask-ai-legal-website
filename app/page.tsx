import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, Check, Eye, Minus, PenLine, Repeat, Scale, ShieldCheck, X } from "lucide-react"
import { Footer } from "@/components/footer"
import { card, Eyebrow, GHOST_BTN, gold, H2, ink, muted, PRIMARY_BTN, serif, SiteHeader } from "@/components/site/ui"
import { BrainOrb } from "@/components/cinematic/brain-orb"
import { HOME_FAQ } from "@/lib/faq"
import { FaqJsonLd } from "@/lib/seo/faq-json-ld"
import {
  GUARANTEE_HREF,
  RESEARCH_SOURCES,
  MAINTENANCE_PRICE_USD,
  STARTER_PRICE_USD,
  SITE_SEO_DESCRIPTION,
  SITE_SEO_TITLE,
  SITE_URL,
  THIRD_PARTY_COSTS_NOTE,
} from "@/lib/site-config"

export const metadata: Metadata = {
  title: { absolute: SITE_SEO_TITLE },
  description: SITE_SEO_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_SEO_TITLE,
    description: SITE_SEO_DESCRIPTION,
    url: `${SITE_URL}/`,
  },
  twitter: {
    title: SITE_SEO_TITLE,
    description: SITE_SEO_DESCRIPTION,
  },
}

/** Only features listed on /plans. Chat column is a general, conservative read. Verify before publishing. */
type Mark = "yes" | "partly" | "no"
const COMPARE: { row: string; us: Mark; chat: Mark }[] = [
  { row: "Your files stay on your own computer", us: "yes", chat: "no" },
  { row: "Hides names before anything is sent to an AI", us: "yes", chat: "no" },
  { row: "Reads your papers and builds a case folder", us: "yes", chat: "partly" },
  { row: "Remembers facts, dates and names across every draft", us: "yes", chat: "partly" },
  { row: "Deadline calendar with reminders", us: "yes", chat: "partly" },
  { row: "Court rules for your state", us: "yes", chat: "partly" },
  { row: "Case law research with source links", us: "yes", chat: "partly" },
  { row: "Drafting that never changes your citations or quotes", us: "yes", chat: "no" },
  { row: "A second, different model reads it like the other side", us: "yes", chat: "no" },
]

function MarkCell({ m }: { m: Mark }) {
  if (m === "yes")
    return (
      <span className="inline-flex items-center gap-1.5 text-[#9fd3a8]">
        <Check className="h-4 w-4" aria-hidden /> Yes
      </span>
    )
  if (m === "partly")
    return (
      <span className="inline-flex items-center gap-1.5 text-[#e8c98a]">
        <Minus className="h-4 w-4" aria-hidden /> Partly
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 text-[#a9b3c1]/70">
      <X className="h-4 w-4" aria-hidden /> No
    </span>
  )
}

/** Second Brain features, taken from the live FAQ and feature cards. Check the app before changing any claim. */
const BRAIN = [
  { t: "Reads and sorts your papers", b: "Upload what you have. It files each paper and remembers the facts, dates and names." },
  { t: "Fix a mistake once", b: "Correct a draft one time. It saves that as a rule, and every draft after follows it." },
  { t: "Learns the law", b: "It studies case law with source links and your state's court rules, and uses them when drafting." },
  { t: "Keeps learning how to write", b: "In the background it reads writing guides from law school writing centers, law professors, judges and bar associations." },
  { t: "Stays with you", b: "The memory is saved on your computer. Learning runs on your own AI account, within a daily limit you set." },
]

/** How it improves. Each step is a real feature (Learner, Writing Check, Second Opinion). Check the app before changing. */
const LOOP = [
  { icon: PenLine, t: "You fix something once", b: "Edit a draft or correct it in chat. It saves that as a rule for every later draft." },
  { icon: BookOpen, t: "It studies in the background", b: "It reads writing guides and videos from law school writing centers, professors, judges and bar associations, and saves the lessons." },
  { icon: Eye, t: "It checks its own work", b: "Writing Check flags robot phrases, long sentences, missing record cites and word limits." },
  { icon: Scale, t: "A second model pushes back", b: "Second Opinion reads your paper the way the other side would. You choose which changes to keep." },
]

/** Research features from /plans and the FAQ. Case watcher and paid services are Complete-plan items on /plans. */
const RESEARCH = [
  { t: "Case law with source links", b: "Every case it finds comes with a link, so you can read it yourself." },
  { t: "Your state's court rules", b: "Formatting, deadlines and filing rules for your court, built in." },
  { t: "A report on which cases help or hurt", b: "See where the law is on your side and where it is not, before you file." },
  { t: "Case watcher (Complete plan)", b: "Alerts when new rulings may help or hurt you." },
]

const STEPS = [
  { n: "01", t: "Pay once", b: "Buy online and tell us whether you use Windows or Mac." },
  { n: "02", t: "Install it at home", b: "We email your download and a walkthrough video. Install takes minutes, then you activate it with your license code." },
  { n: "03", t: "Add your papers", b: "It reads them, sorts them by date, title and judge, and puts your deadlines on a calendar." },
  { n: "04", t: "Ask, draft, check", b: "Ask in plain words. Get a draft you can edit, a Writing Check score and a Second Opinion before you file." },
]


function Tag({ className, label, text, delay = 0 }: { className: string; label: string; text: string; delay?: number }) {
  return (
    <div
      style={{ animationDelay: `${delay}s` }}
      className={`aal-float absolute z-10 hidden rounded-xl border border-white/15 bg-[#121c28]/90 px-3.5 py-2 shadow-xl shadow-black/50 backdrop-blur sm:block ${className}`}
    >
      <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#e8c98a]/80">
        <span className="h-1.5 w-1.5 rounded-full bg-[#9fd3a8]" aria-hidden />
        {label}
      </p>
      <p className="mt-0.5 whitespace-nowrap font-sans text-xs font-semibold text-[#f3ead8]">{text}</p>
    </div>
  )
}

/** An open laptop drawn in CSS, with the real app on screen (fictional Rivera sample matter). */
function Laptop() {
  return (
    <figure className="relative mx-auto w-full max-w-[640px]">
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(232,201,138,0.14),transparent_65%)]" aria-hidden />
      {/* Lid */}
      <div className="relative mx-auto w-[88%] rounded-t-[18px] border border-white/15 bg-[#1b232d] p-[2.2%] pb-[3%] shadow-2xl shadow-black/60">
        <div className="mx-auto mb-[1.5%] h-1.5 w-1.5 rounded-full bg-black/60 ring-1 ring-white/10" aria-hidden />
        <div className="overflow-hidden rounded-[4px] bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/app-shots/chat-draft-rivera-no.webp"
            width={1920}
            height={1156}
            alt="The Ask AI Legal app open on a laptop: chat on the left, a finished Answer on court paper on the right"
            className="block h-auto w-full"
            fetchPriority="high"
          />
        </div>
      </div>
      {/* Floating labels, each pointing at a real part of the screen */}
      <Tag className="left-[-4%] top-[30%]" label="Chat" text="Ask in plain words" />
      <Tag className="right-[-5%] top-[14%]" label="Draft" text="Court paper, ready to edit" />
      <Tag className="bottom-[10%] left-[34%]" label="Private" text="Files stay on this computer" />
      {/* Base */}
      <div className="relative h-[14px] rounded-b-[14px] rounded-t-[3px] bg-gradient-to-b from-[#3a434e] to-[#1a2028] shadow-[0_18px_30px_-10px_rgba(0,0,0,0.8)]">
        <div className="mx-auto h-[5px] w-[16%] rounded-b-md bg-black/40" aria-hidden />
      </div>
      <figcaption className={`mt-5 text-center text-xs ${muted} opacity-70`}>The real app, shown with a fictional sample matter.</figcaption>
    </figure>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b131d] font-sans">
      <style>{`
        @keyframes aalFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        .aal-float { animation: aalFloat 5s ease-in-out infinite }
        @keyframes aalMarq { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .aal-marquee { animation: aalMarq 40s linear infinite }
        .aal-marquee-rev { animation: aalMarq 46s linear infinite reverse }
        .aal-mask { mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent) }
        @media (prefers-reduced-motion: reduce) { .aal-float, .aal-marquee, .aal-marquee-rev { animation: none } }
      `}</style>
      <FaqJsonLd items={HOME_FAQ} path="/#faq" />

      <SiteHeader />

      <main>
        {/* 1. Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_10%,rgba(232,201,138,0.08),transparent_60%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:pt-24">
            <div>
              <Eyebrow>A private legal workspace for your own computer</Eyebrow>
              <h1 className={`${serif} ${ink} text-[clamp(2.6rem,5.6vw,4.4rem)] leading-[1.03] tracking-[-0.015em]`}>
                Built for your case from start to finish. <em className={gold}>It remembers everything.</em>
              </h1>
              <p className={`mt-6 max-w-xl text-lg leading-relaxed ${muted}`}>
                It reads your papers, tracks your deadlines, finds the law with sources and drafts documents you can edit. Your files stay on your computer.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#compare" className={PRIMARY_BTN}>
                  See how it compares <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a href="/samples/civil-motion-with-exhibits.pdf" target="_blank" rel="noopener" className={GHOST_BTN}>
                  Open a sample document
                </a>
              </div>
              <p className={`mt-6 text-sm ${muted}`}>
                From ${STARTER_PRICE_USD.toLocaleString("en-US")}, paid once ·{" "}
                <Link href={GUARANTEE_HREF} className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-[#f3ead8]">
                  <ShieldCheck className="h-4 w-4" aria-hidden /> Money-back guarantee
                </Link>
              </p>
            </div>

            <Laptop />
          </div>
        </section>

        {/* 2. Second Brain */}
        <section id="brain" className="scroll-mt-20 border-t border-white/[0.06] bg-[#0e1824] py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1fr]">
            <div>
              <Eyebrow>Second Brain</Eyebrow>
              <H2>
                It remembers. <em className={gold}>And it keeps learning.</em>
              </H2>
              <ol className="mt-10 space-y-6">
                {BRAIN.map((f, n) => (
                  <li key={f.t} className="flex gap-4">
                    <span className={`font-mono text-xs ${gold} mt-1`}>0{n + 1}</span>
                    <div>
                      <h3 className={`text-lg font-semibold ${ink}`}>{f.t}</h3>
                      <p className={`mt-1 text-sm leading-relaxed ${muted}`}>{f.b}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(232,201,138,0.10),transparent_65%)]" aria-hidden />
              <div className="relative mx-auto aspect-square w-full rounded-full bg-[#0b1220]" style={{ maxWidth: "min(520px, 70vh)" }}>
                <BrainOrb className="absolute inset-0 h-full w-full" />
                <Tag className="left-[-6%] top-[8%]" label="Court papers" text="Every paper read and filed" delay={0} />
                <Tag className="right-[-8%] top-[22%]" label="Cited cases" text="Kept with source links" delay={1.2} />
                <Tag className="left-[-10%] bottom-[24%]" label="Writing lessons" text="Saved from guides and your edits" delay={2.4} />
                <Tag className="right-[-4%] bottom-[8%]" label="Memory" text="Facts, dates and names" delay={0.6} />
              </div>
              <p className={`mt-4 text-center text-xs ${muted} opacity-70`}>A live copy of the Second Brain map in the app.</p>
            </div>
          </div>
        </section>

        {/* 2b. How it learns */}
        <section id="learns" className="scroll-mt-20 border-t border-white/[0.06] py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Eyebrow>How it gets better</Eyebrow>
            <H2>
              Every correction <em className={gold}>makes the next draft better.</em>
            </H2>
            <p className={`mt-4 max-w-2xl text-lg ${muted}`}>
              A chat window starts over every time. This one keeps what it learned, on your computer.
            </p>
            <ol className="mt-10 grid gap-10 md:grid-cols-4">
              {LOOP.map(({ icon: Icon, t, b }, n) => (
                <li key={t} className="relative">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e8c98a]/40 text-[#e8c98a]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  {n < LOOP.length - 1 && (
                    <span className="absolute left-14 right-2 top-6 hidden h-px bg-gradient-to-r from-[#e8c98a]/50 to-transparent md:block" aria-hidden />
                  )}
                  <h3 className={`mt-5 text-lg font-semibold ${ink}`}>{t}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${muted}`}>{b}</p>
                </li>
              ))}
            </ol>
            <p className={`mt-10 flex items-center gap-2 text-sm ${muted}`}>
              <Repeat className="h-4 w-4 text-[#e8c98a]" aria-hidden /> Then it starts again with your next paper. Learning runs on your own AI account, within a daily limit you set.
            </p>
          </div>
        </section>

        {/* 2c. Legal research */}
        <section id="research" className="scroll-mt-20 border-t border-white/[0.06] bg-[#0e1824] py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <div className="min-w-0">
              <Eyebrow>Legal research</Eyebrow>
              <H2>
                Find the law <em className={gold}>with the source attached.</em>
              </H2>
              <ul className="mt-8 space-y-5">
                {RESEARCH.map((r) => (
                  <li key={r.t} className="flex gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#9fd3a8]" aria-hidden />
                    <div>
                      <h3 className={`font-semibold ${ink}`}>{r.t}</h3>
                      <p className={`mt-1 text-sm leading-relaxed ${muted}`}>{r.b}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <a href="/samples/civil-research-report.pdf" target="_blank" rel="noopener" className={`${GHOST_BTN} mt-8`}>
                Open a sample research report <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
            <div className="min-w-0">
              <p className={`mb-4 text-sm ${muted}`}>Research platforms we can connect for you (Complete plan):</p>
              <div className="aal-mask space-y-3 overflow-hidden">
                {[0, 1].map((row) => (
                  <div key={row} className={`flex w-max gap-3 ${row ? "aal-marquee-rev" : "aal-marquee"}`}>
                    {[...RESEARCH_SOURCES, ...RESEARCH_SOURCES].filter((_, k) => k % 2 === row).map((name, k) => (
                      <span key={name + k} className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#f3ead8]">
                        {name}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <p className={`mt-4 text-xs leading-relaxed ${muted} opacity-80`}>
                Connected with your own account. Provider subscriptions and usage fees are separate. Names only, no partnership implied.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Compare */}
        <section id="compare" className="scroll-mt-20 border-t border-white/[0.06] py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Eyebrow>How we compare</Eyebrow>
            <H2>
              A chat window answers. <em className={gold}>This one keeps the whole file.</em>
            </H2>
            <p className={`mt-4 max-w-2xl text-lg ${muted}`}>
              The same AI models, set up for court papers and kept on your own computer.
            </p>

            <div className={`mt-10 overflow-x-auto ${card}`}>
              <table className="w-full min-w-[560px] text-left text-sm">
                <caption className="sr-only">Ask AI Legal compared with a general AI chat app</caption>
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    <th scope="col" className={`p-4 font-normal ${muted}`}>What you get</th>
                    <th scope="col" className={`p-4 font-semibold ${ink}`}>Ask AI Legal™</th>
                    <th scope="col" className={`p-4 font-semibold ${ink}`}>
                      ChatGPT or Claude <span className={`block text-xs font-normal ${muted}`}>on their own</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((r) => (
                    <tr key={r.row} className="border-b border-white/[0.05] last:border-0">
                      <th scope="row" className={`p-4 font-normal ${ink}`}>{r.row}</th>
                      <td className="p-4"><MarkCell m={r.us} /></td>
                      <td className="p-4"><MarkCell m={r.chat} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`mt-4 text-xs leading-relaxed ${muted} opacity-80`}>
              Yes means it is a main feature. Partly means you can get some of it with extra work. No means it is not built in. Checked November 18, 2026. Products change. If we got something wrong, tell us and we will fix it. ChatGPT and Claude are trademarks of their owners and did not review this table.
            </p>
          </div>
        </section>

        {/* 5. Pricing */}
        <section id="pricing" className="scroll-mt-20 border-t border-white/[0.06] bg-[#0e1824] py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Eyebrow>Pricing</Eyebrow>
            <H2>
              Pay once. <em className={gold}>Keep it on your computer.</em>
            </H2>
            <p className={`mt-4 max-w-2xl text-lg ${muted}`}>
              No subscription to keep using it. Monthly maintenance is optional.
            </p>

            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-[#e8c98a]/35 bg-white/[0.04] p-8 text-center">
              <p className={`${serif} ${ink} text-6xl`}>${STARTER_PRICE_USD.toLocaleString("en-US")}</p>
              <p className={`mt-2 text-sm ${muted}`}>Starting price, paid once. Yours to keep.</p>
              <p className={`mx-auto mt-6 max-w-md text-sm leading-relaxed ${ink}`}>
                Drafting, your case folder, deadline calendar, case law with sources, your state&apos;s court rules, Second Brain memory and the privacy switch.
              </p>
              <Link href="/plans" className={`${PRIMARY_BTN} mt-8 w-full`}>Buy now <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <p className={`mt-5 text-xs leading-relaxed ${muted}`}>
                Optional maintenance ${MAINTENANCE_PRICE_USD}/month. {THIRD_PARTY_COSTS_NOTE} Money back if it will not install or run on your computer and we cannot fix it.
              </p>
            </div>
          </div>
        </section>

        {/* 6. How it works */}
        <section id="how" className="scroll-mt-20 border-t border-white/[0.06] py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Eyebrow>How it works</Eyebrow>
            <H2>
              Four steps, <em className={gold}>in order.</em>
            </H2>
            <ol className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <li key={s.n} className="border-t border-white/10 pt-5">
                  <p className={`font-mono text-xs ${gold}`}>{s.n}</p>
                  <h3 className={`mt-3 text-lg font-semibold ${ink}`}>{s.t}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${muted}`}>{s.b}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 7. Is / is not */}
        <section className="border-t border-white/[0.06] bg-[#0e1824] py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Eyebrow>Straight talk</Eyebrow>
            <H2>
              What Ask AI Legal is, <em className={gold}>and is not.</em>
            </H2>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <div>
                <h3 className={`font-semibold ${ink}`}>It is</h3>
                <ul className={`mt-4 space-y-3 text-sm ${muted}`}>
                  {["Software you install and keep on your own computer", "A place to sort your papers, track deadlines and research the law with sources", "Drafts you edit, check and decide on", "Built by someone who went to court without a lawyer"].map((x) => (
                    <li key={x} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9fd3a8]" aria-hidden />{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className={`font-semibold ${ink}`}>It is not</h3>
                <ul className={`mt-4 space-y-3 text-sm ${muted}`}>
                  {["A law firm or a lawyer", "Legal advice for your situation", "A promise about how a matter ends", "Free of mistakes. AI can misread a paper or a citation, so check every one"].map((x) => (
                    <li key={x} className="flex gap-2.5"><X className="mt-0.5 h-4 w-4 shrink-0 text-[#a9b3c1]/70" aria-hidden />{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 8. FAQ */}
        <section id="faq" className="scroll-mt-20 border-t border-white/[0.06] pb-12 pt-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Eyebrow>Questions</Eyebrow>
            <H2>
              What people <em className={gold}>ask first.</em>
            </H2>
            <div className="mt-10 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {HOME_FAQ.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold ${ink}`}>
                    {f.q}
                    <span className={`text-xl transition-transform group-open:rotate-45 ${gold}`} aria-hidden>+</span>
                  </summary>
                  <p className={`mt-3 text-sm leading-relaxed ${muted}`}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Closing */}
        <section className="pb-24 pt-8 text-center">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <H2>
              See the app, <em className={gold}>then decide.</em>
            </H2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/plans" className={PRIMARY_BTN}>Buy now <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <a href="#compare" className={GHOST_BTN}>Compare</a>
            </div>
            <p className={`mt-8 text-xs leading-relaxed ${muted} opacity-80`}>
              Ask AI Legal provides legal information and document automation for educational and informational purposes only. It does not constitute formal legal advice or an attorney-client relationship.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
