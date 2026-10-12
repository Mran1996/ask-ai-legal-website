"use client"

import { Slot } from "@/components/cinematic/slot"
import { COMPARISON } from "@/lib/comparison"

/** Side-by-side cost picture: attorney retainer (hourglass draining coins) vs. Ask AI Legal (flat price). */
export function CostVisual() {
  const { attorney, ours } = COMPARISON.visual
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <article className="cine-card relative overflow-hidden border-brick/25">
        <div className="pointer-events-none absolute -right-12 -top-6 h-44 w-44 opacity-80 sm:-right-6 sm:h-80 sm:w-80 [mask-image:radial-gradient(closest-side,black_55%,transparent)]">
          <Slot src="retainer-trap.png" alt="" className="h-full w-full rounded-2xl" imgClassName="object-cover" quiet />
        </div>
        <div className="relative p-7 sm:p-10">
          <p className="cine-label !text-[#E8836B]">{attorney.label}</p>
          <p className="font-display mt-5 text-5xl font-semibold tracking-tight text-cream sm:text-6xl">{attorney.price}</p>
          <p className="font-mono mt-2 text-xs uppercase tracking-widest text-cream/60">{attorney.unit}</p>
          <p className="cine-body mt-6 max-w-sm !text-base">{attorney.detail}</p>
        </div>
      </article>

      <article className="cine-card relative overflow-hidden border-accent/30">
        <div className="pointer-events-none absolute -right-12 -top-8 h-44 w-44 opacity-90 sm:-right-6 sm:-top-6 sm:h-80 sm:w-80 [mask-image:radial-gradient(closest-side,black_55%,transparent)]">
          <Slot src="flat-price.png" alt="" className="h-full w-full rounded-2xl" imgClassName="object-contain" quiet />
        </div>
        <div className="relative p-7 sm:p-10">
          <p className="cine-label">{ours.label}</p>
          <p className="font-display mt-5 text-5xl font-semibold tracking-tight text-accent-light sm:text-6xl">{ours.price}</p>
          <p className="font-mono mt-2 text-xs uppercase tracking-widest text-cream/60">{ours.unit}</p>
          <p className="cine-body mt-6 max-w-sm !text-base">{ours.detail}</p>
        </div>
      </article>
    </div>
  )
}
