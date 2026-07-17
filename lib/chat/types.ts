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
  caseType: string
  issue: string
  deadline: string
  opposingParty: string
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
  caseType?: string
  issue: string
  deadline?: string
  opposingParty?: string
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
  caseType: "",
  issue: "",
  deadline: "",
  opposingParty: "",
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
