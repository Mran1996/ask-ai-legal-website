import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CompareTable } from "@/components/compare-table"
import { CostVisual } from "@/components/cost-visual"
import { COMPARISON } from "@/lib/comparison"
import { CONSULT_CTA_LABEL, CONSULT_HREF } from "@/lib/site-config"

/** Homepage: short cost-and-responsibilities comparison, linking to the full table on /pricing. */
export function KnowWhatYouBuy() {
  return (
    <section id="compare" className="relative scroll-mt-20 overflow-hidden bg-ground py-24 sm:py-32">
      <div className="cine-container">
        <p className="cine-label mb-6">{COMPARISON.tagline}</p>
        <h2 className="cine-h2 max-w-[20ch] text-cream">{COMPARISON.title}</h2>
        <p className="cine-body mt-8 max-w-2xl">{COMPARISON.intro}</p>

        <div className="mt-12">
          <CostVisual />
        </div>

        <div className="mt-8">
          <CompareTable tone="dark" short />
        </div>

        <p className="cine-body mt-8 max-w-2xl !text-base !text-cream/60">{COMPARISON.note}</p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href={CONSULT_HREF} className="cine-btn-gold">
            {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/pricing#compare" className="cine-btn-ghost">
            See the full comparison
          </Link>
        </div>
      </div>
    </section>
  )
}
