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
  "Document preparation — estimated average for your state and case type"

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
    ourPriceCents: 89900,
    attorneyLowCents: 250000,
    attorneyHighCents: 600000,
    matterType: "ca_criminal",
    serviceId: "ca_criminal_motion_prep",
  },
  {
    id: "family_divorce_petition",
    state: "CA",
    caseType: "Family / divorce",
    keywords: ["divorce", "dissolution", "petition for dissolution", "family"],
    serviceLine: "Divorce / dissolution document preparation",
    ourPriceCents: 84900,
    attorneyLowCents: 250000,
    attorneyHighCents: 750000,
    matterType: "ca_family",
    serviceId: "ca_family_divorce_prep",
  },
  {
    id: "family_custody",
    state: "CA",
    caseType: "Family / custody",
    keywords: ["custody", "parenting plan", "visitation", "parenting"],
    serviceLine: "Custody / parenting plan document preparation",
    ourPriceCents: 74900,
    attorneyLowCents: 200000,
    attorneyHighCents: 650000,
    matterType: "ca_family",
    serviceId: "ca_family_custody_prep",
  },
  {
    id: "family_support",
    state: "CA",
    caseType: "Family / support",
    keywords: ["child support", "spousal support", "alimony", "support modification"],
    serviceLine: "Support / modification document preparation",
    ourPriceCents: 69900,
    attorneyLowCents: 180000,
    attorneyHighCents: 550000,
    matterType: "ca_family",
    serviceId: "ca_family_support_prep",
  },
  {
    id: "post_conviction",
    state: "CA",
    caseType: "Post-conviction",
    keywords: ["post-conviction", "habeas", "appeal", "expunge", "record relief"],
    serviceLine: "Post-conviction relief document preparation",
    ourPriceCents: 99900,
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
    ourPriceCents: 59900,
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
  matterSignature: string
}

const HIGH_COST_STATES = new Set(["CA", "NY", "MA", "CT", "NJ", "DC", "WA", "HI", "CO", "MD"])
const LOW_COST_STATES = new Set(["MS", "WV", "AR", "OK", "ID", "MT", "WY", "ND", "SD", "AL", "KY"])

const OUR_PRICE_FRACTION_OF_LOW = 0.38

function normalizeState(state?: string): string {
  const s = state?.trim().toUpperCase() ?? ""
  if (s.length === 2) return s
  if (/california/i.test(s)) return "CA"
  if (/washington/i.test(s)) return "WA"
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
  return Math.round((cents * factor) / 100) * 100
}

/** Stable 0..n-1 hash for issue text (not crypto — pricing variance only). */
function issueHashBucket(issue: string, buckets: number): number {
  let h = 2166136261
  const s = issue.trim().toLowerCase()
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h) % buckets
}

/**
 * Doc-prep quote: prefer maintained template price, then ~38% of attorney-low,
 * then issue-aware step so unrelated matters do not share an identical number.
 * Never use (low+high)/2 midpoint (that forced many family cases to $1,999).
 */
function computeOurAverageCents(
  attorneyLowCents: number,
  attorneyHighCents: number,
  templateOurPriceCents: number | null,
  issue: string,
  deliverableId: string
): number {
  const baseFromTemplate =
    templateOurPriceCents !== null && templateOurPriceCents > 0
      ? templateOurPriceCents
      : Math.round((attorneyLowCents * OUR_PRICE_FRACTION_OF_LOW) / 100) * 100

  // $25 steps from issue/deliverable so same template + different story ≠ identical quote
  const step = 2500
  const bucket = issueHashBucket(`${deliverableId}|${issue}`, 17) // 0..16 → $0–$400
  const adjusted = baseFromTemplate + bucket * step

  const floor = 29900
  const ceiling = Math.min(
    249900,
    Math.max(floor + 10000, Math.round((attorneyHighCents * 0.55) / 100) * 100)
  )
  return Math.max(floor, Math.min(ceiling, adjusted))
}

/** For UI copy: our quote as % of attorney midpoint (or planned low-fraction if custom). */
export function estimateFractionPercent(
  ourCents: number,
  attorneyLowCents: number,
  attorneyHighCents: number
): number {
  if (ourCents <= 0) {
    return Math.round(OUR_PRICE_FRACTION_OF_LOW * 100)
  }
  const mid = (attorneyLowCents + attorneyHighCents) / 2
  if (mid <= 0) return 0
  return Math.round((ourCents / mid) * 100)
}

function issueMatchesKeywords(issue: string, keywords: readonly string[]): boolean {
  const lower = issue.toLowerCase()
  return keywords.some((kw) => lower.includes(kw.toLowerCase()))
}

function localizeDeliverable(
  template: PricingDeliverable,
  state: string,
  issue: string
): PricingDeliverable {
  const factor = stateLegalMarketFactor(state)
  const attorneyLowCents = scaleCents(template.attorneyLowCents, factor)
  const attorneyHighCents = scaleCents(template.attorneyHighCents, factor)
  const scaledTemplate =
    template.ourPriceCents !== null ? scaleCents(template.ourPriceCents, factor) : null
  const ourPriceCents = computeOurAverageCents(
    attorneyLowCents,
    attorneyHighCents,
    scaledTemplate,
    issue,
    template.id
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

/** Signature so estimates are reused only for the same matter fingerprint. */
export function pricingMatterSignature(input: PricingLookupInput): string {
  const state = normalizeState(input.state)
  const caseType = (input.caseType ?? "").trim().toLowerCase()
  const issue = (input.issue ?? "").trim().toLowerCase().slice(0, 280)
  const template = findTemplate(input.caseType?.trim() ?? "", input.issue?.trim() ?? "")
  return `${state}|${template.id}|${caseType}|${issueHashBucket(issue, 10007)}`
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

  const deliverable = localizeDeliverable(template, state, issue)

  return {
    deliverable,
    isCustomQuote: false,
    matchedBy,
    matterSignature: pricingMatterSignature(input),
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
