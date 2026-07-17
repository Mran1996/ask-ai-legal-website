import type { Locale } from "@/lib/i18n/languages"
import { DEFAULT_INTAKE_STATE } from "@/lib/chat/us-states"

export type KnowledgeChunk = {
  id: string
  locale: Locale
  category: string
  title: string
  content: string
  keywords: string[]
}

export type HasDocumentsChoice = "yes" | "no" | ""

export type PreferredContactChoice = "email" | "phone" | "either" | ""

export type IntakeFormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  state: string
  county: string
  caseType: string
  issue: string
  /** Court case / docket number if client has one. */
  caseNumber: string
  /** Client's role in the case (e.g. tenant, defendant, petitioner). */
  role: string
  /** Specific service the client needs (e.g. "Answer to unlawful detainer"). */
  serviceNeeded: string
  deadline: string
  /** Additional known filing or hearing dates, comma-separated. */
  knownDates: string
  opposingParty: string
  /** Referral source (how did you hear about us). */
  referralSource: string
  /** Promo / referral code. */
  referralCode: string
  hasDocuments: HasDocumentsChoice
  preferredContact: PreferredContactChoice
  preferredLanguage: string
}

/** Structured facts stored on a case (mirrors convex intakeStructured). */
export type CaUdIntakeStructured = {
  tenantName?: string
  landlordName?: string
  propertyAddress?: string
  noticeDate?: string
  rentOwedCents?: number
  hasReceivedSummons?: boolean
  hearingDate?: string
  notes?: string
  clientStateInput?: string
  county?: string
  caseTypeLabel?: string
  deadline?: string
  knownDates?: string
  opposingParty?: string
  role?: string
  serviceNeeded?: string
  hasDocuments?: "yes" | "no"
  preferredContact?: "email" | "phone" | "either"
  preferredLanguage?: string
  issueSummary?: string
  caseNumber?: string
  referralSource?: string
  referralCode?: string
}

/** Payload accepted by cases.createFromIntake (guest intake). */
export type CreateFromIntakePayload = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  state?: string
  county?: string
  caseType?: string
  issue: string
  caseNumber?: string
  role?: string
  serviceNeeded?: string
  deadline?: string
  knownDates?: string
  opposingParty?: string
  referralSource?: string
  referralCode?: string
  hasDocuments?: "yes" | "no"
  preferredContact?: "email" | "phone" | "either"
  preferredLanguage?: string
}

export const EMPTY_INTAKE: IntakeFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  state: DEFAULT_INTAKE_STATE,
  county: "",
  caseType: "",
  issue: "",
  caseNumber: "",
  role: "",
  serviceNeeded: "",
  deadline: "",
  knownDates: "",
  opposingParty: "",
  referralSource: "",
  referralCode: "",
  hasDocuments: "",
  preferredContact: "either",
  preferredLanguage: "en",
}

export const CASE_TYPES = [
  "Family / divorce",
  "Custody",
  "Civil complaint",
  "Business dispute",
  "Housing / eviction",
  "Small claims",
  "Demand letter",
  "Response / answer",
  "Other",
] as const
