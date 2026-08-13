import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SituationCta } from "@/components/situation-cta"
import { HeroCategoryPills } from "@/components/hero-category-pills"
import { getSituationGuide, listSituationSlugs } from "@/lib/situations/guides"
import { SITE_DISCLAIMER, SITE_URL } from "@/lib/site-config"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return listSituationSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = getSituationGuide(slug)
  if (!guide) return { title: "Situation guide" }

  const description = guide.intro.slice(0, 155)
  return {
    title: `${guide.title} — Document preparation help`,
    description,
    alternates: { canonical: `/situations/${slug}` },
    openGraph: {
      title: `${guide.title} | Ask AI Legal`,
      description,
      url: `${SITE_URL}/situations/${slug}`,
    },
  }
}

export default async function SituationGuidePage({ params }: Props) {
  const { slug } = await params
  const guide = getSituationGuide(slug)
  if (!guide) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow">
        <section className="section-navy section-pad-under-header">
          <div className="container-main max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to home
            </Link>
            <p className="firm-label mt-8 text-gold">Situation guide</p>
            <div className="gold-rule mb-6 mt-2" />
            <h1 className="firm-title text-white">{guide.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-white/70">{guide.intro}</p>
            <div className="mt-8 flex justify-center">
              <HeroCategoryPills />
            </div>
          </div>
        </section>

        <section className="section-pad bg-cream">
          <div className="container-main max-w-3xl space-y-12">
            <div>
              <h2 className="font-display text-2xl font-semibold text-navy">What we can prepare for you</h2>
              <p className="mt-3 text-sm text-gray-600">
                Examples — your written quote lists exactly what your files need after review.
              </p>
              <ul className="mt-6 space-y-3">
                {guide.weHelpWith.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl font-semibold text-navy">Questions people ask first</h2>
              <dl className="mt-6 space-y-6">
                {guide.commonQuestions.map((item) => (
                  <div key={item.q} className="firm-card border border-gold/25 bg-white p-5 sm:p-6">
                    <dt className="font-display text-lg font-semibold text-navy">{item.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-gray-600">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h2 className="font-display text-2xl font-semibold text-navy">Documents we often prepare</h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {guide.documentsExamples.map((doc) => (
                  <li
                    key={doc}
                    className="rounded-full border-2 border-gold/30 bg-white px-3 py-1.5 text-xs font-medium text-navy sm:text-sm"
                  >
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-sm border border-navy/10 bg-white p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-navy">Important</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{SITE_DISCLAIMER}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <SituationCta label={guide.ctaLabel} />
                <Link
                  href="/"
                  className="text-sm font-semibold text-gold-dark underline-offset-2 hover:underline"
                >
                  ← Back to home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
