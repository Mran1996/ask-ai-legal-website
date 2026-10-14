import { Minus, Plus } from "lucide-react"
import type { FaqItem } from "@/lib/faq"

/**
 * Collapsed-by-default FAQ rows built on <details>/<summary>, so they open and close
 * with click, Enter, or Space and keep their answers in the page for search engines.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-cream/10 overflow-hidden rounded-2xl border border-cream/10 bg-ground-surface/60">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-display text-lg text-cream transition-colors hover:bg-cream/[0.03] sm:px-6 sm:text-xl [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <Plus className="h-5 w-5 shrink-0 text-accent group-open:hidden" aria-hidden />
            <Minus className="hidden h-5 w-5 shrink-0 text-accent group-open:block" aria-hidden />
          </summary>
          <p className="px-5 pb-5 text-base leading-relaxed text-cream/80 sm:px-6 sm:text-lg">{item.a}</p>
        </details>
      ))}
    </div>
  )
}
