import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { CineNav } from "@/components/cinematic/nav"
import { Footer } from "@/components/footer"
import { FaqAccordion } from "@/components/faq-accordion"
import { FaqJsonLd } from "@/lib/seo/faq-json-ld"
import { GUIDES, getGuide } from "@/lib/guides"
import { CONSULT_CTA_LABEL, CONSULT_HREF, SITE_URL } from "@/lib/site-config"

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
    title: { absolute: `${guide.seoTitle} | Ask AI Legal` },
    description: guide.description,
    alternates: { canonical: `/guides/${slug}` },
    openGraph: { title: guide.seoTitle, description: guide.description, url: `${SITE_URL}/guides/${slug}`, type: "article" },
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

  return (
    <div className="cine flex min-h-screen flex-col bg-ground">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <FaqJsonLd items={guide.faq} path={`/guides/${slug}`} />
      <CineNav />
      <main className="flex-grow">
        <article className="pt-28 pb-12 sm:pt-32">
          <div className="cine-container max-w-3xl">
            <Link href="/guides" className="mb-6 inline-flex items-center gap-2 text-sm text-cream/70 hover:text-accent-light">
              <ArrowLeft className="h-4 w-4" aria-hidden /> All guides
            </Link>
            <p className="cine-label mb-3">Guide</p>
            <h1 className="cine-h2 text-cream">{guide.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-cream/80">{guide.intro}</p>

            <div className="mt-10 space-y-9">
              {guide.sections.map((s) => (
                <section key={s.heading}>
                  <h2 className="mb-3 font-display text-xl font-semibold text-accent-light sm:text-2xl">{s.heading}</h2>
                  {s.paragraphs?.map((p) => (
                    <p key={p} className="mb-3 leading-relaxed text-cream/80">{p}</p>
                  ))}
                  {s.bullets && (
                    <ul className="space-y-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3 leading-relaxed text-cream/80">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-accent-light" aria-hidden />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <section className="mt-12">
              <h2 className="mb-3 font-display text-xl font-semibold text-accent-light sm:text-2xl">Common questions</h2>
              <FaqAccordion items={guide.faq} />
            </section>

            <Link href={CONSULT_HREF} className="cine-btn-gold mt-10">
              {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>

            <nav className="mt-14 border-t border-white/10 pt-8" aria-label="More guides">
              <p className="cine-label mb-4">More guides</p>
              <ul className="space-y-2">
                {others.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guides/${g.slug}`} className="text-cream/80 hover:text-accent-light">{g.title}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
