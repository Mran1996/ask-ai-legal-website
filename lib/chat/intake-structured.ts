import type {
  CaUdIntakeStructured,
  CreateFromIntakePayload,
  IntakeFormData,
} from "./types"

export function intakeFormToPayload(
  data: IntakeFormData,
  preferredLanguage: string
): CreateFromIntakePayload {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim() || undefined,
    state: data.state.trim() || undefined,
    county: data.county.trim() || undefined,
    caseType: data.caseType.trim() || undefined,
    issue: data.issue.trim(),
    caseNumber: data.caseNumber.trim() || undefined,
    role: data.role.trim() || undefined,
    serviceNeeded: data.serviceNeeded.trim() || undefined,
    deadline: data.deadline.trim() || undefined,
    knownDates: data.knownDates.trim() || undefined,
    opposingParty: data.opposingParty.trim() || undefined,
    referralSource: data.referralSource.trim() || undefined,
    referralCode: data.referralCode.trim() || undefined,
    hasDocuments:
      data.hasDocuments === "yes" || data.hasDocuments === "no"
        ? data.hasDocuments
        : undefined,
    preferredContact:
      data.preferredContact === "email" ||
      data.preferredContact === "phone" ||
      data.preferredContact === "either"
        ? data.preferredContact
        : undefined,
    preferredLanguage: preferredLanguage || data.preferredLanguage || "en",
  }
}

export function buildIntakeStructuredPreview(data: IntakeFormData): CaUdIntakeStructured {
  const tenantName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim()
  const opposingParty = data.opposingParty.trim()
  const deadline = data.deadline.trim()

  return {
    tenantName,
    landlordName: opposingParty || undefined,
    hearingDate: deadline || undefined,
    notes: data.issue.trim(),
    clientStateInput: data.state.trim() || undefined,
    county: data.county.trim() || undefined,
    caseTypeLabel: data.caseType.trim() || undefined,
    deadline: deadline || undefined,
    knownDates: data.knownDates.trim() || undefined,
    opposingParty: opposingParty || undefined,
    role: data.role.trim() || undefined,
    serviceNeeded: data.serviceNeeded.trim() || undefined,
    hasDocuments:
      data.hasDocuments === "yes" || data.hasDocuments === "no"
        ? data.hasDocuments
        : undefined,
    preferredContact:
      data.preferredContact === "email" ||
      data.preferredContact === "phone" ||
      data.preferredContact === "either"
        ? data.preferredContact
        : undefined,
    preferredLanguage: data.preferredLanguage || undefined,
    issueSummary: data.issue.trim(),
    caseNumber: data.caseNumber.trim() || undefined,
    referralSource: data.referralSource.trim() || undefined,
    referralCode: data.referralCode.trim() || undefined,
  }
}
