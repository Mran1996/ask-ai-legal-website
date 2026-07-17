/** Keep in sync with convex/lib/servicePricing.ts */

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

/**
 * Attorney-low bases must all be unique so localized half-price quotes never collide.
 * Client quote = half of (attorneyLow × state factor), rounded to nearest $1.
 */
export const PRICING_ROWS: readonly PricingDeliverable[] = [
  {
    id: "housing_eviction",
    state: "CA",
    caseType: "Housing / eviction",
    keywords: ["evict", "unlawful detainer", "3-day", "notice to quit", "landlord", "tenant"],
    serviceLine: "Unlawful detainer answer preparation",
    ourPriceCents: null,
    attorneyLowCents: 150000,
    attorneyHighCents: 350000,
    matterType: "ca_unlawful_detainer",
    serviceId: "ca_ud_answer_prep",
  },
  {
    id: "response_answer",
    state: "CA",
    caseType: "Response / answer",
    keywords: ["answer to complaint", "respond to summons", "civil answer", "filing an answer"],
    serviceLine: "Civil answer / response preparation",
    ourPriceCents: null,
    attorneyLowCents: 120000,
    attorneyHighCents: 300000,
    matterType: "ca_civil",
    serviceId: "ca_civil_answer_prep",
  },
  {
    id: "small_claims",
    state: "CA",
    caseType: "Small claims",
    keywords: ["small claims", "sc-100"],
    serviceLine: "Small claims document preparation",
    ourPriceCents: null,
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
    ourPriceCents: null,
    attorneyLowCents: 50000,
    attorneyHighCents: 150000,
    matterType: "ca_demand_letter",
    serviceId: "ca_demand_letter_prep",
  },
  {
    id: "civil_complaint",
    state: "CA",
    caseType: "Civil complaint",
    keywords: ["civil complaint", "file a lawsuit", "sue for"],
    serviceLine: "Civil complaint drafting",
    ourPriceCents: null,
    attorneyLowCents: 200000,
    attorneyHighCents: 500000,
    matterType: "ca_civil",
    serviceId: "ca_civil_complaint_prep",
  },
  {
    id: "business_dispute",
    state: "CA",
    caseType: "Business dispute",
    keywords: ["business dispute", "breach of contract", "partnership dispute", "vendor dispute"],
    serviceLine: "Business dispute document preparation",
    ourPriceCents: null,
    attorneyLowCents: 185000,
    attorneyHighCents: 480000,
    matterType: "ca_civil",
    serviceId: "ca_business_dispute_prep",
  },
  {
    id: "criminal_motion",
    state: "CA",
    caseType: "Criminal motion",
    keywords: ["criminal motion", "sentencing motion", "motion to dismiss", "felony", "misdemeanor"],
    serviceLine: "Criminal motion preparation",
    ourPriceCents: null,
    attorneyLowCents: 275000,
    attorneyHighCents: 600000,
    matterType: "ca_criminal",
    serviceId: "ca_criminal_motion_prep",
  },
  {
    id: "family_divorce_petition",
    state: "CA",
    caseType: "Family / divorce",
    keywords: ["divorce", "dissolution", "petition for dissolution"],
    serviceLine: "Divorce / dissolution document preparation",
    ourPriceCents: null,
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
    ourPriceCents: null,
    attorneyLowCents: 220000,
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
    ourPriceCents: null,
    attorneyLowCents: 180000,
    attorneyHighCents: 550000,
    matterType: "ca_family",
    serviceId: "ca_family_support_prep",
  },
  {
    id: "post_conviction",
    state: "CA",
    caseType: "Post-conviction",
    keywords: ["post-conviction", "habeas", "expunge", "record relief"],
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
    attorneyLowCents: 165000,
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

/** Client-facing quote is always half of the displayed attorney-low. */
const OUR_PRICE_FRACTION_OF_LOW = 0.5

/** Map intake form labels / shorthand onto PRICING_ROWS.caseType. */
const CASE_TYPE_ALIASES: Record<string, string> = {
  custody: "Family / custody",
  "family / custody": "Family / custody",
  "family/custody": "Family / custody",
  divorce: "Family / divorce",
  "family / divorce": "Family / divorce",
  "family/divorce": "Family / divorce",
  "family / support": "Family / support",
  support: "Family / support",
  eviction: "Housing / eviction",
  "housing / eviction": "Housing / eviction",
  "housing/eviction": "Housing / eviction",
  "unlawful detainer": "Housing / eviction",
  "business dispute": "Business dispute",
  business: "Business dispute",
  "small claims": "Small claims",
  "demand letter": "Demand letter",
  "civil complaint": "Civil complaint",
  "response / answer": "Response / answer",
  "response/answer": "Response / answer",
  answer: "Response / answer",
  "criminal motion": "Criminal motion",
  criminal: "Criminal motion",
  "post-conviction": "Post-conviction",
  "post conviction": "Post-conviction",
  other: "Other",
}

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
 * Doc-prep quote = half of the displayed Typical attorney low, rounded to nearest $1.
 * Example: attorney low $2,875 → Ask AI Legal $1,438.
 */
export function computeOurAverageCents(attorneyLowCents: number): number {
  if (attorneyLowCents <= 0) return 0
  return Math.round(attorneyLowCents / 2 / 100) * 100
}

/** For UI copy: our quote as % of attorney low (target 50%). */
export function estimateFractionPercent(
  ourCents: number,
  attorneyLowCents: number,
  _attorneyHighCents: number
): number {
  if (ourCents <= 0 || attorneyLowCents <= 0) {
    return Math.round(OUR_PRICE_FRACTION_OF_LOW * 100)
  }
  return Math.round((ourCents / attorneyLowCents) * 100)
}

function issueMatchesKeywords(issue: string, keywords: readonly string[]): boolean {
  const lower = issue.toLowerCase()
  return keywords.some((kw) => lower.includes(kw.toLowerCase()))
}

function localizeDeliverable(
  template: PricingDeliverable,
  state: string,
  _issue: string
): PricingDeliverable {
  const factor = stateLegalMarketFactor(state)
  const attorneyLowCents = scaleCents(template.attorneyLowCents, factor)
  const attorneyHighCents = scaleCents(template.attorneyHighCents, factor)
  const ourPriceCents = computeOurAverageCents(attorneyLowCents)

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

/** Resolve intake case-type label to a PRICING_ROWS.caseType value. */
export function normalizeCaseTypeLabel(caseType: string): string | null {
  const raw = caseType.trim()
  if (!raw) return null

  const key = raw.toLowerCase()
  const aliased = CASE_TYPE_ALIASES[key]
  if (aliased) return aliased

  const exact = PRICING_ROWS.find((r) => r.caseType.toLowerCase() === key)
  if (exact) return exact.caseType

  return raw
}

function findByCaseType(caseType: string): PricingDeliverable | null {
  const normalized = normalizeCaseTypeLabel(caseType)
  if (!normalized) return null

  const exact = PRICING_ROWS.find((r) => r.caseType === normalized)
  if (exact) return exact

  return (
    PRICING_ROWS.find((r) => r.caseType.toLowerCase() === normalized.toLowerCase()) ?? null
  )
}

function otherTemplate(): PricingDeliverable {
  return PRICING_ROWS.find((r) => r.caseType === "Other") ?? PRICING_ROWS[PRICING_ROWS.length - 1]!
}

/**
 * Prefer the intake form case type. Never let issue keywords override a selected type.
 * Keywords are only used when case type is blank.
 */
function findTemplate(caseType: string, issue: string): {
  template: PricingDeliverable
  matchedBy: PricingLookupResult["matchedBy"]
} {
  if (caseType.trim()) {
    const byType = findByCaseType(caseType)
    if (byType) return { template: byType, matchedBy: "caseType" }
    // Unknown dropdown value — do not guess from issue text.
    return { template: otherTemplate(), matchedBy: "fallback" }
  }

  if (issue.trim()) {
    const keywordMatches = PRICING_ROWS.filter(
      (r) => r.keywords.length > 0 && issueMatchesKeywords(issue, r.keywords)
    ).sort((a, b) => b.keywords.length - a.keywords.length)

    const best = keywordMatches[0]
    if (best) return { template: best, matchedBy: "keyword" }
  }

  return { template: otherTemplate(), matchedBy: "fallback" }
}

/** Signature so estimates are reused only for the same matter fingerprint. */
export function pricingMatterSignature(input: PricingLookupInput): string {
  const state = normalizeState(input.state)
  const caseType = (input.caseType ?? "").trim().toLowerCase()
  const issue = (input.issue ?? "").trim().toLowerCase().slice(0, 280)
  const { template } = findTemplate(input.caseType?.trim() ?? "", input.issue?.trim() ?? "")
  return `${state}|${template.id}|${caseType}|${issueHashBucket(issue, 10007)}`
}

/**
 * @deprecated Quote is now exactly half of attorney-low; kept for callers/tests.
 * Cent-safe: round to nearest $1 (100 cents).
 */
export const SERVICE_MARKUP_FACTOR = 1.0

export function applyServiceMarkup(baseCents: number): number {
  if (baseCents <= 0) return 0
  return Math.round((baseCents * SERVICE_MARKUP_FACTOR) / 100) * 100
}

export function resolvePricing(input: PricingLookupInput): PricingLookupResult {
  const state = normalizeState(input.state)
  const caseType = input.caseType?.trim() ?? ""
  const issue = input.issue?.trim() ?? ""

  const { template, matchedBy } = findTemplate(caseType, issue)
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
