/**
 * Service pricing reference — matter type × state (attorney market factor).
 * Mirror in convex/lib/servicePricing.ts. Prices are estimates from maintained
 * reference data until counsel-reviewed; not LLM-invented at runtime.
 */

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
  "Document preparation — estimated average for your state and case type"

/** National matter-type templates (CA-labeled rows = baseline attorney market). */
export const PRICING_ROWS: readonly PricingDeliverable[] = [
  {
    id: "housing_eviction",
    state: "CA",
    caseType: "Housing / eviction",
    keywords: ["evict", "unlawful detainer", "3-day", "notice to quit", "landlord", "tenant"],
    serviceLine: "Unlawful detainer answer preparation",
    ourPriceCents: 49900,
    attorneyLowCents: 150000,
    attorneyHighCents: 350000,
    matterType: "ca_unlawful_detainer",
    serviceId: "ca_ud_answer_prep",
  },
  {
    id: "response_answer",
    state: "CA",
    caseType: "Response / answer",
    keywords: ["answer", "response", "summons", "complaint", "filing deadline"],
    serviceLine: "Civil answer / response preparation",
    ourPriceCents: 44900,
    attorneyLowCents: 120000,
    attorneyHighCents: 300000,
    matterType: "ca_civil",
    serviceId: "ca_civil_answer_prep",
  },
  {
    id: "small_claims",
    state: "CA",
    caseType: "Small claims",
    keywords: ["small claims", "sc-100", "claim under"],
    serviceLine: "Small claims document preparation",
    ourPriceCents: 39900,
    attorneyLowCents: 80000,
    attorneyHighCents: 200000,
    matterType: "ca_small_claims",
    serviceId: "ca_small_claims_prep",
  },
  {
    id: "demand_letter",
    state: "CA",
    caseType: "Demand letter",
    keywords: ["demand letter", "demand for payment", "cease and desist"],
    serviceLine: "Demand letter preparation",
    ourPriceCents: 29900,
    attorneyLowCents: 50000,
    attorneyHighCents: 150000,
    matterType: "ca_demand_letter",
    serviceId: "ca_demand_letter_prep",
  },
  {
    id: "civil_complaint",
    state: "CA",
    caseType: "Civil complaint",
    keywords: ["civil complaint", "plaintiff", "lawsuit"],
    serviceLine: "Civil complaint drafting",
    ourPriceCents: 59900,
    attorneyLowCents: 200000,
    attorneyHighCents: 500000,
    matterType: "ca_civil",
    serviceId: "ca_civil_complaint_prep",
  },
  {
    id: "criminal_motion",
    state: "CA",
    caseType: "Criminal motion",
    keywords: ["motion", "criminal", "sentencing", "dismiss"],
    serviceLine: "Criminal motion preparation",
    ourPriceCents: null,
    attorneyLowCents: 250000,
    attorneyHighCents: 600000,
    matterType: "ca_criminal",
    serviceId: "ca_criminal_motion_prep",
  },
  {
    id: "family_divorce",
    state: "CA",
    caseType: "Family / divorce",
    keywords: ["divorce", "custody", "family", "dissolution", "spousal"],
    serviceLine: "Family / divorce document preparation",
    ourPriceCents: null,
    attorneyLowCents: 200000,
    attorneyHighCents: 800000,
    matterType: "ca_family",
    serviceId: "ca_family_prep",
  },
  {
    id: "post_conviction",
    state: "CA",
    caseType: "Post-conviction",
    keywords: ["post-conviction", "habeas", "appeal", "expunge", "record relief"],
    serviceLine: "Post-conviction relief document preparation",
    ourPriceCents: null,
    attorneyLowCents: 300000,
    attorneyHighCents: 900000,
    matterType: "ca_post_conviction",
    serviceId: "ca_post_conviction_prep",
  },
  {
    id: "other",
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
] as const

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

const HIGH_COST_STATES = new Set(["CA", "NY", "MA", "CT", "NJ", "DC", "WA", "HI", "CO", "MD"])
const LOW_COST_STATES = new Set(["MS", "WV", "AR", "OK", "ID", "MT", "WY", "ND", "SD", "AL", "KY"])

/** Reference fraction when no computed price exists (custom-quote path). */
export const OUR_PRICE_FRACTION = 0.5

export function estimateFractionPercent(
  ourPriceCents: number,
  attorneyLowCents: number,
  attorneyHighCents: number
): number {
  const mid = (attorneyLowCents + attorneyHighCents) / 2
  if (ourPriceCents <= 0 || mid <= 0) return Math.round(OUR_PRICE_FRACTION * 100)
  return Math.max(1, Math.min(100, Math.round((ourPriceCents / mid) * 100)))
}

function normalizeState(state?: string): string {
  const s = state?.trim().toUpperCase() ?? ""
  if (s.length === 2) return s
  if (/california/i.test(s)) return "CA"
  if (/texas/i.test(s)) return "TX"
  if (/new york/i.test(s)) return "NY"
  if (/florida/i.test(s)) return "FL"
  return s || "US"
}

function stateLegalMarketFactor(state: string): number {
  if (HIGH_COST_STATES.has(state)) return 1.15
  if (LOW_COST_STATES.has(state)) return 0.88
  return 1
}

function scaleCents(cents: number, factor: number): number {
  return Math.round(cents * factor / 100) * 100
}

function computeOurAverageCents(
  attorneyLowCents: number,
  attorneyHighCents: number,
  _templateOurPriceCents: number | null
): number {
  const midpoint =
    Math.round((attorneyLowCents + attorneyHighCents) / 2 / 100) * 100
  return Math.max(29900, Math.min(199900, midpoint))
}

function issueMatchesKeywords(issue: string, keywords: readonly string[]): boolean {
  const lower = issue.toLowerCase()
  return keywords.some((kw) => lower.includes(kw.toLowerCase()))
}

function localizeDeliverable(template: PricingDeliverable, state: string): PricingDeliverable {
  const factor = stateLegalMarketFactor(state)
  const attorneyLowCents = scaleCents(template.attorneyLowCents, factor)
  const attorneyHighCents = scaleCents(template.attorneyHighCents, factor)
  const ourPriceCents = computeOurAverageCents(
    attorneyLowCents,
    attorneyHighCents,
    template.ourPriceCents !== null ? scaleCents(template.ourPriceCents, factor) : null
  )

  const baseLine = template.serviceLine.replace(/\s*\([A-Z]{2}\)\s*$/, "").trim()
  const serviceLine =
    template.caseType === "Other"
      ? `${CUSTOM_QUOTE_SERVICE_LINE} (${state})`
      : `${baseLine} (${state}) — estimated average`

  return {
    ...template,
    state,
    serviceLine,
    ourPriceCents,
    attorneyLowCents,
    attorneyHighCents,
  }
}

function findTemplate(caseType: string, issue: string): PricingDeliverable {
  if (caseType) {
    const exact = PRICING_ROWS.find((r) => r.caseType === caseType)
    if (exact) return exact
  }

  if (issue) {
    const keywordMatches = PRICING_ROWS.filter(
      (r) => r.keywords.length > 0 && issueMatchesKeywords(issue, r.keywords)
    ).sort((a, b) => b.keywords.length - a.keywords.length)

    const best = keywordMatches[0]
    if (best) return best
  }

  return PRICING_ROWS.find((r) => r.caseType === "Other") ?? PRICING_ROWS[PRICING_ROWS.length - 1]!
}

export function resolvePricing(input: PricingLookupInput): PricingLookupResult {
  const state = normalizeState(input.state)
  const caseType = input.caseType?.trim() ?? ""
  const issue = input.issue?.trim() ?? ""

  const template = findTemplate(caseType, issue)
  const matchedBy: PricingLookupResult["matchedBy"] =
    caseType && template.caseType === caseType
      ? "caseType"
      : issue && template.keywords.some((kw) => issueMatchesKeywords(issue, [kw]))
        ? "keyword"
        : "fallback"

  const deliverable = localizeDeliverable(template, state)

  return {
    deliverable,
    isCustomQuote: false,
    matchedBy,
  }
}
