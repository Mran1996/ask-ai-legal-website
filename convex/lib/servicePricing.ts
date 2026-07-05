/** Mirror of lib/pricing/service-pricing.ts — keep in sync. */

export type PricingDeliverable = {
  id: string
  state: string
  caseType: string
  keywords: readonly string[]
  serviceLine: string
  ourPriceCents: number | null
  attorneyLowCents: number
  attorneyHighCents: number
  matterType: string
  serviceId: string
}

export const CUSTOM_QUOTE_SERVICE_LINE =
  "Custom quote — our team will review your intake and follow up by email"

export const PRICING_ROWS: readonly PricingDeliverable[] = [
  {
    id: "ca_housing_eviction",
    state: "CA",
    caseType: "Housing / eviction",
    keywords: ["evict", "unlawful detainer", "3-day", "notice to quit", "landlord", "tenant"],
    serviceLine: "Unlawful detainer answer preparation (CA)",
    ourPriceCents: 49900,
    attorneyLowCents: 150000,
    attorneyHighCents: 350000,
    matterType: "ca_unlawful_detainer",
    serviceId: "ca_ud_answer_prep",
  },
  {
    id: "ca_response_answer",
    state: "CA",
    caseType: "Response / answer",
    keywords: ["answer", "response", "summons", "complaint", "filing deadline"],
    serviceLine: "Civil answer / response preparation (CA)",
    ourPriceCents: 44900,
    attorneyLowCents: 120000,
    attorneyHighCents: 300000,
    matterType: "ca_civil",
    serviceId: "ca_civil_answer_prep",
  },
  {
    id: "ca_small_claims",
    state: "CA",
    caseType: "Small claims",
    keywords: ["small claims", "sc-100", "claim under"],
    serviceLine: "Small claims document preparation (CA)",
    ourPriceCents: 39900,
    attorneyLowCents: 80000,
    attorneyHighCents: 200000,
    matterType: "ca_small_claims",
    serviceId: "ca_small_claims_prep",
  },
  {
    id: "ca_demand_letter",
    state: "CA",
    caseType: "Demand letter",
    keywords: ["demand letter", "demand for payment", "cease and desist"],
    serviceLine: "Demand letter preparation (CA)",
    ourPriceCents: 29900,
    attorneyLowCents: 50000,
    attorneyHighCents: 150000,
    matterType: "ca_demand_letter",
    serviceId: "ca_demand_letter_prep",
  },
  {
    id: "ca_civil_complaint",
    state: "CA",
    caseType: "Civil complaint",
    keywords: ["civil complaint", "plaintiff", "lawsuit"],
    serviceLine: "Civil complaint drafting (CA)",
    ourPriceCents: 59900,
    attorneyLowCents: 200000,
    attorneyHighCents: 500000,
    matterType: "ca_civil",
    serviceId: "ca_civil_complaint_prep",
  },
  {
    id: "ca_criminal_motion",
    state: "CA",
    caseType: "Criminal motion",
    keywords: ["motion", "criminal", "sentencing", "dismiss"],
    serviceLine: "Criminal motion preparation (CA)",
    ourPriceCents: null,
    attorneyLowCents: 250000,
    attorneyHighCents: 600000,
    matterType: "ca_criminal",
    serviceId: "ca_criminal_motion_prep",
  },
  {
    id: "ca_family_divorce",
    state: "CA",
    caseType: "Family / divorce",
    keywords: ["divorce", "custody", "family", "dissolution", "spousal"],
    serviceLine: "Family / divorce document preparation (CA)",
    ourPriceCents: null,
    attorneyLowCents: 200000,
    attorneyHighCents: 800000,
    matterType: "ca_family",
    serviceId: "ca_family_prep",
  },
  {
    id: "ca_post_conviction",
    state: "CA",
    caseType: "Post-conviction",
    keywords: ["post-conviction", "habeas", "appeal", "expunge", "record relief"],
    serviceLine: "Post-conviction relief document preparation (CA)",
    ourPriceCents: null,
    attorneyLowCents: 300000,
    attorneyHighCents: 900000,
    matterType: "ca_post_conviction",
    serviceId: "ca_post_conviction_prep",
  },
  {
    id: "ca_other",
    state: "CA",
    caseType: "Other",
    keywords: [],
    serviceLine: CUSTOM_QUOTE_SERVICE_LINE,
    ourPriceCents: null,
    attorneyLowCents: 150000,
    attorneyHighCents: 400000,
    matterType: "custom",
    serviceId: "custom_review",
  },
]

export type PricingLookupInput = {
  state?: string
  caseType?: string
  issue?: string
}

export type PricingLookupResult = {
  deliverable: PricingDeliverable
  isCustomQuote: boolean
  matchedBy: "caseType" | "keyword" | "fallback"
}

function normalizeState(state?: string): string {
  const s = state?.trim().toUpperCase() ?? ""
  if (s.length === 2) return s
  if (/california/i.test(s)) return "CA"
  if (/texas/i.test(s)) return "TX"
  return s || "CA"
}

function issueMatchesKeywords(issue: string, keywords: readonly string[]): boolean {
  const lower = issue.toLowerCase()
  return keywords.some((kw) => lower.includes(kw.toLowerCase()))
}

export function resolvePricing(input: PricingLookupInput): PricingLookupResult {
  const state = normalizeState(input.state)
  const caseType = input.caseType?.trim() ?? ""
  const issue = input.issue?.trim() ?? ""

  if (state !== "CA") {
    return {
      deliverable: {
        id: "out_of_state_custom",
        state,
        caseType: caseType || "Other",
        keywords: [],
        serviceLine: CUSTOM_QUOTE_SERVICE_LINE,
        ourPriceCents: null,
        attorneyLowCents: 150000,
        attorneyHighCents: 400000,
        matterType: "custom",
        serviceId: "custom_review",
      },
      isCustomQuote: true,
      matchedBy: "fallback",
    }
  }

  const caRows = PRICING_ROWS.filter((r) => r.state === "CA")

  if (caseType) {
    const exact = caRows.find((r) => r.caseType === caseType)
    if (exact) {
      return {
        deliverable: exact,
        isCustomQuote: exact.ourPriceCents === null,
        matchedBy: "caseType",
      }
    }
  }

  if (issue) {
    const keywordMatches = caRows
      .filter((r) => r.keywords.length > 0 && issueMatchesKeywords(issue, r.keywords))
      .sort((a, b) => b.keywords.length - a.keywords.length)

    const best = keywordMatches[0]
    if (best) {
      return {
        deliverable: best,
        isCustomQuote: best.ourPriceCents === null,
        matchedBy: "keyword",
      }
    }
  }

  const fallback = caRows.find((r) => r.caseType === "Other") ?? caRows[caRows.length - 1]
  if (!fallback) {
    throw new Error("Pricing table is empty")
  }

  return {
    deliverable: fallback,
    isCustomQuote: true,
    matchedBy: "fallback",
  }
}

export function matterTypeFromDeliverable(matterType: string): MatterType {
  const allowed: MatterType[] = [
    "ca_unlawful_detainer",
    "ca_civil",
    "ca_small_claims",
    "ca_demand_letter",
    "ca_criminal",
    "ca_family",
    "ca_post_conviction",
    "custom",
  ]
  if (allowed.includes(matterType as MatterType)) {
    return matterType as MatterType
  }
  return "custom"
}

export type MatterType =
  | "ca_unlawful_detainer"
  | "ca_civil"
  | "ca_small_claims"
  | "ca_demand_letter"
  | "ca_criminal"
  | "ca_family"
  | "ca_post_conviction"
  | "custom"
