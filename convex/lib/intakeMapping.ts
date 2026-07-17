import type { Infer } from "convex/values"
import { matterTypeFromDeliverable, resolvePricing } from "./servicePricing"
import { intakeFormValidator } from "./validators"
import type { MatterType } from "./servicePricing"

export type IntakeFormArgs = Infer<typeof intakeFormValidator>

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function validateIntakeForm(args: IntakeFormArgs): void {
  if (!args.firstName.trim()) {
    throw new Error("First name is required")
  }
  if (!args.lastName.trim()) {
    throw new Error("Last name is required")
  }
  const email = normalizeEmail(args.email)
  if (!email.includes("@") || email.length < 5) {
    throw new Error("A valid email address is required")
  }
  if (args.issue.trim().length < 10) {
    throw new Error("Please describe your issue in at least 10 characters")
  }
}

export function buildIntakeStructured(args: IntakeFormArgs) {
  const tenantName = `${args.firstName.trim()} ${args.lastName.trim()}`.trim()
  const opposingParty = args.opposingParty?.trim()
  const deadline = args.deadline?.trim()

  return {
    tenantName,
    landlordName: opposingParty || undefined,
    hearingDate: deadline || undefined,
    notes: args.issue.trim(),
    clientStateInput: args.state?.trim() || undefined,
    county: args.county?.trim() || undefined,
    caseTypeLabel: args.caseType?.trim() || undefined,
    deadline: deadline || undefined,
    knownDates: args.knownDates?.trim() || undefined,
    opposingParty: opposingParty || undefined,
    role: args.role?.trim() || undefined,
    serviceNeeded: args.serviceNeeded?.trim() || undefined,
    hasDocuments: args.hasDocuments,
    preferredContact: args.preferredContact,
    preferredLanguage: args.preferredLanguage?.trim() || undefined,
    issueSummary: args.issue.trim(),
    caseNumber: args.caseNumber?.trim() || undefined,
    referralSource: args.referralSource?.trim() || undefined,
    referralCode: args.referralCode?.trim() || undefined,
  }
}

export function buildIntakeRaw(args: IntakeFormArgs): string {
  return JSON.stringify({
    ...args,
    email: normalizeEmail(args.email),
    submittedAt: Date.now(),
    channel: "web_chat_quote_tab",
  })
}

export function formatCaseReference(caseId: string): string {
  const tail = caseId.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()
  return `AAL-${tail}`
}

export function normalizeStateCode(state?: string): string {
  const s = state?.trim().toUpperCase() ?? ""
  if (s.length === 2) return s
  if (/california/i.test(s)) return "CA"
  return s || "CA"
}

export function resolveCaseFromIntake(args: IntakeFormArgs): {
  matterType: MatterType
  jurisdictionState: string
  assignedServices: string[]
} {
  const pricing = resolvePricing({
    state: args.state,
    caseType: args.caseType,
    issue: args.issue,
  })

  return {
    matterType: matterTypeFromDeliverable(pricing.deliverable.matterType),
    jurisdictionState: normalizeStateCode(args.state),
    assignedServices: [pricing.deliverable.serviceId],
  }
}
