import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react"
import { CopyBox } from "@/components/copy-box"
import { Footer } from "@/components/footer"
import { ALT_BG, Eyebrow, gold, H1, ink, muted, PAGE_BG, PRIMARY_BTN, serif, SiteHeader } from "@/components/site/ui"
import { FaqAccordion } from "@/components/faq-accordion"
import { FaqJsonLd } from "@/lib/seo/faq-json-ld"
import { GUIDES, getGuide } from "@/lib/guides"
import { CONSULT_CTA_LABEL, CONSULT_HREF, OG_IMAGE, SITE_URL } from "@/lib/site-config"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return { title: "Guide" }
  return {
    // Keep titles under 60 characters so Google shows them whole.
    title: { absolute: guide.seoTitle.length > 45 ? guide.seoTitle : `${guide.seoTitle} | Ask AI Legal` },
    description: guide.description,
    alternates: { canonical: `/guides/${slug}` },
    openGraph: {
      title: guide.seoTitle,
      description: guide.description,
      url: `${SITE_URL}/guides/${slug}`,
      type: "article",
      images: [OG_IMAGE],
    },
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    dateModified: guide.updated,
    author: { "@type": "Organization", name: "Ask AI Legal" },
    publisher: { "@type": "Organization", name: "Ask AI Legal", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/guides/${slug}`,
  }
  const others = GUIDES.filter((g) => g.slug !== slug)

  const H = `${serif} ${ink} mb-4 text-2xl leading-tight sm:text-[1.75rem]`
  const P = `leading-[1.75] ${muted}`

  return (
    <div className={PAGE_BG}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <FaqJsonLd items={guide.faq} path={`/guides/${slug}`} />
      <SiteHeader />
      <main>
        {/* 1. Intro */}
        <section className="relative overflow-hidden pb-12 pt-12 lg:pt-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,201,138,0.08),transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
            <Link href="/guides" className={`mb-8 inline-flex items-center gap-2 text-sm ${muted} hover:text-[#f3ead8]`}>
              <ArrowLeft className="h-4 w-4" aria-hidden /> All guides
            </Link>
            <Eyebrow>Guide</Eyebrow>
            <H1>{guide.title}</H1>
            <p className={`mt-5 text-lg leading-relaxed ${muted}`}>{guide.intro}</p>
          </div>
        </section>

        {/* 2. Article body */}
        <article className={`border-t border-white/[0.06] ${ALT_BG} pb-20 pt-14`}>
          <div className="mx-auto max-w-3xl space-y-12 px-4 sm:px-6">
            {guide.sections.map((s) => (
              <section key={s.heading}>
                <h2 className={H}>{s.heading}</h2>
                {s.paragraphs?.map((p) => (
                  <p key={p} className={`mb-4 ${P}`}>{p}</p>
                ))}
                {s.bullets && (
                  <ul className="space-y-3">
                    {s.bullets.map((b) => (
                      <li key={b} className={`flex items-start gap-3 ${P}`}>
                        <Check className="mt-1.5 h-4 w-4 shrink-0 text-[#9fd3a8]" aria-hidden />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.copy && <CopyBox text={s.copy} />}
                {s.after?.map((p) => (
                  <p key={p} className={`mt-4 ${P}`}>{p}</p>
                ))}
                {s.links && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {s.links.map((l) => {
                      const external = l.href.startsWith("http")
                      return (
                        <a
                          key={l.href}
                          href={l.href}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-[#f3ead8] transition hover:border-[#e8c98a]/60 hover:text-[#e8c98a]"
                        >
                          {l.label}
                          {external ? <ExternalLink className="h-3.5 w-3.5" aria-hidden /> : <ArrowRight className="h-3.5 w-3.5" aria-hidden />}
                        </a>
                      )
                    })}
                  </div>
                )}
              </section>
            ))}

            <section>
              <h2 className={H}>Common questions</h2>
              <FaqAccordion items={guide.faq} />
            </section>

            <Link href={CONSULT_HREF} className={PRIMARY_BTN}>
              {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </article>

        {/* 3. More guides */}
        <nav className="py-20" aria-label="More guides">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Eyebrow>More guides</Eyebrow>
            <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {others.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className={`group flex items-center justify-between gap-4 py-4 ${ink} hover:text-[#e8c98a]`}>
                    <span>{g.title}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#e8c98a] transition group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </main>
      <Footer />
    </div>
  )
}
