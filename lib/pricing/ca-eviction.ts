/**
 * Static pricing reference for California unlawful detainer document prep.
 * Attorney comparison ranges must come from maintained data — not LLM guesses.
 */

export type CaEvictionDeliverable = {
  id: string
  serviceLine: string
  ourPriceCents: number
  attorneyLowCents: number
  attorneyHighCents: number
  sourceNote: string
}

/** Phase 1 stub — replace with counsel-reviewed market research table. */
export const CA_EVICTION_DELIVERABLES: readonly CaEvictionDeliverable[] = [
  {
    id: "ca_ud_answer_prep",
    serviceLine: "Unlawful detainer answer preparation (CA)",
    ourPriceCents: 49900,
    attorneyLowCents: 150000,
    attorneyHighCents: 350000,
    sourceNote:
      "Internal placeholder range for Phase 1 development. Replace with verified CA market data before launch.",
  },
] as const

export function getDefaultCaUdDeliverable(): CaEvictionDeliverable {
  const row = CA_EVICTION_DELIVERABLES[0]
  if (!row) {
    throw new Error("CA eviction pricing table is empty")
  }
  return row
}

export function formatUsdFromCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100)
}
