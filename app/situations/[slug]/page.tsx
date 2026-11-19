import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Footer } from "@/components/footer"
import { ALT_BG, card, Eyebrow, GHOST_BTN, gold, H1, H2, ink, muted, PAGE_BG, PRIMARY_BTN, serif, SiteHeader } from "@/components/site/ui"
import { getSituationGuide, HERO_CATEGORY_LINKS, listSituationSlugs } from "@/lib/situations/guides"
import { CONSULT_HREF, OG_IMAGE, SITE_DISCLAIMER, SITE_URL } from "@/lib/site-config"

type Props = { params: Promise<{ slug: string }> }

/** One search description per page, each under 160 characters. */
const SEO_DESCRIPTIONS: Record<string, string> = {
  divorce:
    "Starting a divorce or answering papers your spouse filed? Organize your finances and parenting issues and draft your court papers from home.",
  custody:
    "Make sense of custody forms, parenting plans and support papers. Draft your custody requests and responses from home, on your own computer.",
  housing:
    "Got an eviction notice or a lease dispute? Read every paragraph and deadline, then draft your written response and housing papers from home.",
  civil:
    "Sued in civil court, or suing someone? Research the law with sources and draft your answer, motions and declarations on your own computer.",
  "small-claims":
    "Prepare your small claims case from home. Organize the facts, state what you are asking for, and draft papers in the format the court expects.",
  criminal:
    "Gather your case papers, look up the law with sources and draft documents for your criminal matter in a private workspace on your computer.",
}

export function generateStaticParams() {
  return listSituationSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = getSituationGuide(slug)
  if (!guide) return { title: "Situation guide" }

  const description = SEO_DESCRIPTIONS[slug] ?? guide.intro.slice(0, 155)
  return {
    title: `${guide.title}: Representing Yourself`,
    description,
    alternates: { canonical: `/situations/${slug}` },
    openGraph: {
      title: `${guide.title} | Ask AI Legal`,
      description,
      url: `${SITE_URL}/situations/${slug}`,
      images: [OG_IMAGE],
    },
  }
}

export default async function SituationGuidePage({ params }: Props) {
  const { slug } = await params
  const guide = getSituationGuide(slug)
  if (!guide) notFound()

  return (
    <div className={PAGE_BG}>
      <SiteHeader />
      <main>
        {/* 1. Intro */}
        <section className="relative overflow-hidden pb-12 pt-12 lg:pt-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,201,138,0.08),transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Link href="/" className={`mb-8 inline-flex items-center gap-2 text-sm ${muted} hover:text-[#f3ead8]`}>
              <ArrowLeft className="h-4 w-4" aria-hidden /> Back to home
            </Link>
            <Eyebrow>Situation guide</Eyebrow>
            <H1>{guide.title}</H1>
            <p className={`mx-auto mt-5 max-w-2xl text-lg leading-relaxed ${muted}`}>{guide.intro}</p>
            <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Situations">
              {HERO_CATEGORY_LINKS.map((item) => {
                const href = "href" in item ? item.href : `/situations/${item.slug}`
                const active = !("href" in item) && item.slug === slug
                return (
                  <Link
                    key={item.slug}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "border-[#e8c98a]/70 bg-[#e8c98a]/10 text-[#e8c98a]"
                        : "border-white/15 text-[#f3ead8] hover:border-[#e8c98a]/60 hover:text-[#e8c98a]"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </section>

        {/* 2. What people use it for + drafts */}
        <section className={`border-t border-white/[0.06] ${ALT_BG} py-20`}>
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <Eyebrow>What it helps with</Eyebrow>
              <H2>
                What people use <em className={gold}>the workspace for.</em>
              </H2>
              <p className={`mt-4 text-sm ${muted} opacity-80`}>
                Examples only. Available features and sources depend on your plan and the services you connect.
              </p>
              <ul className="mt-8 space-y-4">
                {guide.weHelpWith.map((item) => (
                  <li key={item} className={`flex items-start gap-3 text-base leading-relaxed ${muted}`}>
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#9fd3a8]" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${card} p-6 sm:p-8 lg:self-start`}>
              <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${gold}`}>Examples of drafts you can prepare</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {guide.documentsExamples.map((doc) => (
                  <li key={doc} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-[#f3ead8]">
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Questions people ask first */}
        <section className="border-t border-white/[0.06] py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Eyebrow>Questions</Eyebrow>
            <H2>
              Questions people <em className={gold}>ask first.</em>
            </H2>
            <dl className="mt-10 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {guide.commonQuestions.map((item) => (
                <div key={item.q} className="py-6">
                  <dt className={`${serif} ${ink} text-xl leading-snug sm:text-2xl`}>{item.q}</dt>
                  <dd className={`mt-3 text-base leading-relaxed ${muted}`}>{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 4. Closing */}
        <section className={`border-t border-white/[0.06] ${ALT_BG} py-20 text-center`}>
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <H2>
              Ready when <em className={gold}>you are.</em>
            </H2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className={GHOST_BTN}>Ask a question</Link>
              <Link href={CONSULT_HREF} className={PRIMARY_BTN}>
                {guide.ctaLabel} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <p className={`mx-auto mt-8 max-w-xl text-xs leading-relaxed ${muted} opacity-80`}>{SITE_DISCLAIMER}</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
