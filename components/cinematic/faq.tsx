import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FaqAccordion } from "@/components/faq-accordion"
import { HOME_FAQ } from "@/lib/faq"

/** Homepage FAQ: five collapsed questions and a link to the full /faq page. */
export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-20 bg-ground-surface py-6 sm:py-10">
      <div className="cine-container max-w-4xl">
        <p className="cine-label mb-3">FAQ</p>
        <h2 className="cine-h2 text-cream">Frequently asked questions</h2>
        <div className="mt-6">
          <FaqAccordion items={HOME_FAQ} />
        </div>
        <Link href="/faq" className="cine-btn-ghost mt-6">
          View all FAQs <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  )
}
