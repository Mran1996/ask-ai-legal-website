/**
 * Deterministic matter category for personalized Part 1 intake Word forms.
 * Prefer stored matterType / caseTypeLabel; fall back to issue keywords.
 */

export type IntakeMatterCategory =
  | "family"
  | "unlawful_detainer"
  | "civil_answer"
  | "civil_complaint"
  | "small_claims"
  | "demand_letter"
  | "criminal"
  | "post_conviction"
  | "business_dispute"
  | "general"

export type IntakeMatterResolveInput = {
  matterType?: string
  caseTypeLabel?: string
  serviceNeeded?: string
  issueSummary?: string
  role?: string
}

const CATEGORY_FILE_HINT: Record<IntakeMatterCategory, string> = {
  family: "Family",
  unlawful_detainer: "Housing-Eviction",
  civil_answer: "Civil-Answer",
  civil_complaint: "Civil-Complaint",
  small_claims: "Small-Claims",
  demand_letter: "Demand-Letter",
  criminal: "Criminal",
  post_conviction: "Post-Conviction",
  business_dispute: "Business",
  general: "General",
}

const CATEGORY_SECTION_TITLE: Record<IntakeMatterCategory, string> = {
  family: "Family / Divorce / Custody Follow-Up",
  unlawful_detainer: "Housing / Unlawful Detainer Follow-Up",
  civil_answer: "Civil Answer / Response Follow-Up",
  civil_complaint: "Civil Complaint Follow-Up",
  small_claims: "Small Claims Follow-Up",
  demand_letter: "Demand Letter Follow-Up",
  criminal: "Criminal Motion Follow-Up",
  post_conviction: "Post-Conviction Follow-Up",
  business_dispute: "Business Dispute Follow-Up",
  general: "Matter-Specific Follow-Up",
}

export function intakeMatterFileHint(category: IntakeMatterCategory): string {
  return CATEGORY_FILE_HINT[category]
}

export function intakeMatterSectionTitle(category: IntakeMatterCategory): string {
  return CATEGORY_SECTION_TITLE[category]
}

function haystack(input: IntakeMatterResolveInput): string {
  return [
    input.caseTypeLabel,
    input.serviceNeeded,
    input.issueSummary,
    input.role,
    input.matterType,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
}

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text))
}

/** Resolve label/keywords first when matterType is missing or still "custom". */
function fromKeywords(text: string): IntakeMatterCategory | null {
  if (
    matchesAny(text, [
      /unlawful\s*detainer/,
      /\beviction\b/,
      /\bevict/,
      /3-?\s*day/,
      /notice to quit/,
      /landlord/,
      /\btenant\b/,
      /housing\s*\/\s*eviction/,
    ])
  ) {
    return "unlawful_detainer"
  }

  if (
    matchesAny(text, [
      /post[-\s]?conviction/,
      /\bhabeas\b/,
      /\bexpunge/,
      /record relief/,
      /\bappeal\b.*\bconvict/,
    ])
  ) {
    return "post_conviction"
  }

  if (
    matchesAny(text, [
      /\bcriminal\b/,
      /sentencing/,
      /motion to dismiss/,
      /probation/,
      /\bfelony\b/,
      /\bmisdemeanor\b/,
      /arraignment/,
    ])
  ) {
    return "criminal"
  }

  if (
    matchesAny(text, [
      /demand letter/,
      /cease and desist/,
      /demand for payment/,
    ])
  ) {
    return "demand_letter"
  }

  if (matchesAny(text, [/small claims/, /\bsc-?100\b/])) {
    return "small_claims"
  }

  if (
    matchesAny(text, [
      /\bdivorce\b/,
      /dissolution/,
      /spousal support/,
      /\balimony\b/,
      /family\s*\/\s*divorce/,
      /family\s*\/\s*custody/,
      /family\s*\/\s*support/,
      /\bcustody\b/,
      /parenting plan/,
      /visitation/,
      /child support/,
      /family court/,
      /\bpetitioner\b/,
      /\brespondent\b.*\bfamily/,
    ])
  ) {
    return "family"
  }

  if (
    matchesAny(text, [
      /business dispute/,
      /breach of contract/,
      /partnership/,
      /vendor dispute/,
      /llc\b/,
      /commercial dispute/,
    ])
  ) {
    return "business_dispute"
  }

  if (
    matchesAny(text, [
      /civil complaint/,
      /file a lawsuit/,
      /\bsue\b/,
      /\bplaintiff\b/,
      /complaint drafting/,
    ])
  ) {
    return "civil_complaint"
  }

  if (
    matchesAny(text, [
      /response\s*\/\s*answer/,
      /civil answer/,
      /\banswer\b/,
      /\bresponse\b/,
      /\bsummons\b/,
      /filing deadline/,
      /\bdefendant\b/,
    ])
  ) {
    return "civil_answer"
  }

  return null
}

function fromMatterType(
  matterType: string | undefined,
  text: string
): IntakeMatterCategory | null {
  switch (matterType) {
    case "ca_unlawful_detainer":
      return "unlawful_detainer"
    case "ca_small_claims":
      return "small_claims"
    case "ca_demand_letter":
      return "demand_letter"
    case "ca_criminal":
      return "criminal"
    case "ca_family":
      return "family"
    case "ca_post_conviction":
      return "post_conviction"
    case "ca_civil": {
      if (
        matchesAny(text, [
          /civil complaint/,
          /file a lawsuit/,
          /\bsue\b/,
          /\bplaintiff\b/,
          /complaint drafting/,
        ])
      ) {
        return "civil_complaint"
      }
      if (
        matchesAny(text, [
          /business dispute/,
          /breach of contract/,
          /partnership/,
          /vendor dispute/,
        ])
      ) {
        return "business_dispute"
      }
      return "civil_answer"
    }
    default:
      return null
  }
}

/**
 * Pick the intake questionnaire category for a case.
 * Keywords/caseTypeLabel win when matterType is unset or still "custom"
 * (createFromIntake historically defaulted to custom until estimate finalize).
 */
export function resolveIntakeMatterCategory(
  input: IntakeMatterResolveInput
): IntakeMatterCategory {
  const text = haystack(input)
  const fromLabel = fromKeywords(text)
  if (fromLabel) return fromLabel

  const fromStored = fromMatterType(input.matterType, text)
  if (fromStored) return fromStored

  return "general"
}
