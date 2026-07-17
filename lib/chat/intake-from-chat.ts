import type { UIMessage } from "ai"
import { CASE_TYPES } from "@/lib/chat/types"
import { DEFAULT_INTAKE_STATE } from "@/lib/chat/us-states"
import { resolvePricing } from "@/lib/pricing/service-pricing"
import type { IntakeFormData } from "@/lib/chat/types"

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join(" ")
}

function collectUserText(messages: UIMessage[]): string {
  return messages
    .filter((m) => m.role === "user")
    .map(getMessageText)
    .join("\n")
}

const STATE_PATTERNS: { pattern: RegExp; code: string }[] = [
  { pattern: /\bcalifornia\b|\bca\b/i, code: "CA" },
  { pattern: /\btexas\b|\btx\b/i, code: "TX" },
  { pattern: /\bflorida\b|\bfl\b/i, code: "FL" },
  { pattern: /\bnew york\b|\bny\b/i, code: "NY" },
]

function detectState(text: string): string | undefined {
  for (const { pattern, code } of STATE_PATTERNS) {
    if (pattern.test(text)) return code
  }
  return undefined
}

function detectCaseType(text: string): string | undefined {
  const lower = text.toLowerCase()
  const rules: { type: (typeof CASE_TYPES)[number]; patterns: RegExp[] }[] = [
    { type: "Housing / eviction", patterns: [/evict/, /unlawful detainer/, /landlord/, /3-?day notice/, /notice to quit/] },
    { type: "Family / custody", patterns: [/custody/, /parenting plan/, /visitation/] },
    { type: "Family / support", patterns: [/child support/, /spousal support/, /alimony/] },
    { type: "Family / divorce", patterns: [/divorce/, /dissolution/, /family court/] },
    { type: "Business dispute", patterns: [/business dispute/, /breach of contract/, /partnership dispute/, /vendor dispute/] },
    { type: "Small claims", patterns: [/small claims/] },
    { type: "Demand letter", patterns: [/demand letter/, /cease and desist/] },
    { type: "Civil complaint", patterns: [/civil complaint/, /file a lawsuit/, /sue\b/] },
    { type: "Response / answer", patterns: [/answer to/, /respond to summons/, /filing an answer/] },
    { type: "Criminal motion", patterns: [/criminal motion/, /\bcriminal\b/, /sentencing/] },
    { type: "Post-conviction", patterns: [/post-?conviction/, /expunge/, /habeas/] },
  ]

  for (const { type, patterns } of rules) {
    if (patterns.some((p) => p.test(lower))) return type
  }
  return undefined
}

function extractIssueSummary(messages: UIMessage[]): string {
  const userMessages = messages.filter((m) => m.role === "user")
  const last = userMessages[userMessages.length - 1]
  if (last) {
    const text = getMessageText(last).trim()
    if (text.length >= 10) return text
  }
  const combined = collectUserText(messages).trim()
  if (combined.length >= 10) {
    return combined.slice(0, 500)
  }
  return ""
}

/** Merge chat context into quote form without overwriting user-edited fields. */
export function prefillIntakeFromChat(
  messages: UIMessage[],
  current: IntakeFormData
): Partial<IntakeFormData> {
  if (messages.length === 0) return {}

  const userText = collectUserText(messages)
  if (!userText.trim()) return {}

  const patch: Partial<IntakeFormData> = {}

  if (!current.state || current.state === DEFAULT_INTAKE_STATE) {
    const detected = detectState(userText)
    if (detected) patch.state = detected
  }

  if (!current.caseType.trim()) {
    const detectedType = detectCaseType(userText)
    if (detectedType) patch.caseType = detectedType
  }

  if (!current.issue.trim()) {
    const issue = extractIssueSummary(messages)
    if (issue) patch.issue = issue
  }

  if (!current.caseType.trim() && !patch.caseType && (patch.issue || current.issue)) {
    const pricing = resolvePricing({
      state: patch.state ?? current.state,
      issue: patch.issue ?? current.issue,
    })
    if (pricing.matchedBy === "keyword" && pricing.deliverable.caseType !== "Other") {
      patch.caseType = pricing.deliverable.caseType
    }
  }

  return patch
}
