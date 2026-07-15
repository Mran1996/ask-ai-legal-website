import { v } from "convex/values"

export const matterTypeValidator = v.union(
  v.literal("ca_unlawful_detainer"),
  v.literal("ca_civil"),
  v.literal("ca_small_claims"),
  v.literal("ca_demand_letter"),
  v.literal("ca_criminal"),
  v.literal("ca_family"),
  v.literal("ca_post_conviction"),
  v.literal("custom")
)

export const jurisdictionValidator = v.object({
  state: v.string(),
  county: v.optional(v.string()),
})

export const caseStatusValidator = v.union(
  v.literal("intake"),
  v.literal("estimate_sent"),
  v.literal("awaiting_payment"),
  v.literal("awaiting_docs"),
  v.literal("in_drafting"),
  v.literal("in_counsel_review"),
  v.literal("delivered"),
  v.literal("closed")
)

export const estimateStatusValidator = v.union(
  v.literal("draft"),
  v.literal("sent"),
  v.literal("accepted"),
  v.literal("expired")
)

export const documentTypeValidator = v.union(
  v.literal("uploaded_by_client"),
  v.literal("drafted_by_us"),
  v.literal("final_delivered"),
  v.literal("personalized_intake_form")
)

export const documentFolderValidator = v.union(
  v.literal("intake"),
  v.literal("uploaded_by_client"),
  v.literal("drafts"),
  v.literal("counsel_review"),
  v.literal("final_delivered")
)

export const documentStatusValidator = v.union(
  v.literal("received"),
  v.literal("processing"),
  v.literal("reviewed"),
  v.literal("delivered")
)

export const paymentTypeValidator = v.union(
  v.literal("per_document"),
  v.literal("case_start")
)

export const paymentStatusValidator = v.union(
  v.literal("pending"),
  v.literal("paid"),
  v.literal("failed"),
  v.literal("refunded")
)

export const agentTypeValidator = v.union(
  v.literal("intake"),
  v.literal("pricing"),
  v.literal("drafting"),
  v.literal("counsel")
)

export const agentRunStatusValidator = v.union(
  v.literal("running"),
  v.literal("completed"),
  v.literal("failed")
)

export const counselDecisionValidator = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("needs_edit")
)

export const hasDocumentsValidator = v.union(v.literal("yes"), v.literal("no"))

export const preferredContactValidator = v.union(
  v.literal("email"),
  v.literal("phone"),
  v.literal("either")
)

/** Guest intake form fields (quote tab / chat completion). */
export const intakeFormValidator = v.object({
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),
  state: v.optional(v.string()),
  caseType: v.optional(v.string()),
  issue: v.string(),
  deadline: v.optional(v.string()),
  opposingParty: v.optional(v.string()),
  hasDocuments: v.optional(hasDocumentsValidator),
  preferredContact: v.optional(preferredContactValidator),
  preferredLanguage: v.optional(v.string()),
})

/** Parsed intake facts for CA unlawful detainer. */
export const intakeStructuredValidator = v.object({
  tenantName: v.optional(v.string()),
  landlordName: v.optional(v.string()),
  propertyAddress: v.optional(v.string()),
  noticeDate: v.optional(v.string()),
  rentOwedCents: v.optional(v.number()),
  hasReceivedSummons: v.optional(v.boolean()),
  hearingDate: v.optional(v.string()),
  notes: v.optional(v.string()),
  clientStateInput: v.optional(v.string()),
  caseTypeLabel: v.optional(v.string()),
  deadline: v.optional(v.string()),
  opposingParty: v.optional(v.string()),
  hasDocuments: v.optional(hasDocumentsValidator),
  preferredContact: v.optional(preferredContactValidator),
  preferredLanguage: v.optional(v.string()),
  issueSummary: v.optional(v.string()),
  /** Court / docket / case number if the client has one. */
  caseNumber: v.optional(v.string()),
  /** Client asked us to retrieve documents for an additional fee. */
  retrievalRequested: v.optional(v.boolean()),
})

export const createFromIntakeReturnValidator = v.object({
  caseId: v.id("cases"),
  clientId: v.id("clients"),
  caseReference: v.string(),
})

export const notificationTypeValidator = v.union(
  v.literal("intake_client"),
  v.literal("intake_support"),
  v.literal("appointment_booked_support"),
  v.literal("delivery_client"),
  v.literal("personalized_form_client"),
  v.literal("quote_contract_invoice_client"),
  v.literal("form_received_ack_client"),
  v.literal("form_received_support"),
  v.literal("issues_invoice_client"),
  v.literal("draft_package_ops"),
  v.literal("package_approved_client")
)

export const draftPackageStatusValidator = v.union(
  v.literal("awaiting_ops_approval"),
  v.literal("approved_sent"),
  v.literal("rejected")
)

export const fulfillmentChecklistValidator = v.object({
  personalizedFormSentAt: v.optional(v.number()),
  formReturnedAt: v.optional(v.number()),
  formReceivedAckSentAt: v.optional(v.number()),
  contractInvoiceSentAt: v.optional(v.number()),
  paidAt: v.optional(v.number()),
  paymentLinkUrl: v.optional(v.string()),
  retrievalRequested: v.boolean(),
  caseNumber: v.optional(v.string()),
  draftIssuesSummary: v.optional(v.string()),
  draftPackageStatus: v.optional(draftPackageStatusValidator),
  draftPackageGeneratedAt: v.optional(v.number()),
  quotedStartAmountCents: v.optional(v.number()),
  outlookFolderPath: v.optional(v.string()),
  outlookFolderId: v.optional(v.string()),
  outlookFolderCreatedAt: v.optional(v.number()),
})

export const appointmentCallTypeValidator = v.union(
  v.literal("intake"),
  v.literal("document_planning"),
  v.literal("follow_up_paid")
)

export const appointmentStatusValidator = v.union(
  v.literal("scheduled"),
  v.literal("cancelled"),
  v.literal("completed"),
  v.literal("rescheduled")
)

export const appointmentSummaryValidator = v.object({
  appointmentId: v.id("appointments"),
  callType: appointmentCallTypeValidator,
  scheduledAt: v.number(),
  timezone: v.optional(v.string()),
  durationMinutes: v.number(),
  status: appointmentStatusValidator,
  meetLink: v.optional(v.string()),
  attendeeEmail: v.optional(v.string()),
})

export const callCreditsValidator = v.object({
  caseFileReviewPaid: v.boolean(),
  includedPlanningCallsRemaining: v.number(),
  followUpCallsPaid: v.boolean(),
})

export const notificationStatusValidator = v.union(
  v.literal("pending"),
  v.literal("sent"),
  v.literal("failed")
)

export const estimateSummaryValidator = v.object({
  estimateId: v.id("estimates"),
  serviceLine: v.string(),
  finalQuoteCents: v.number(),
  attorneyCompareLowCents: v.number(),
  attorneyCompareHighCents: v.number(),
  isCustomQuote: v.boolean(),
  retrievalCostCents: v.number(),
})

export const paymentSummaryValidator = v.object({
  paymentId: v.id("payments"),
  type: paymentTypeValidator,
  amountCents: v.number(),
  status: paymentStatusValidator,
  createdAt: v.number(),
})

export const documentSummaryValidator = v.object({
  documentId: v.id("documents"),
  fileName: v.string(),
  folder: documentFolderValidator,
  type: documentTypeValidator,
  status: documentStatusValidator,
  createdAt: v.number(),
  url: v.optional(v.string()),
})

export const generateForCaseReturnValidator = estimateSummaryValidator

export const intakeListItemValidator = v.object({
  caseId: v.id("cases"),
  caseReference: v.string(),
  status: caseStatusValidator,
  clientFirstName: v.string(),
  clientLastName: v.string(),
  clientEmail: v.string(),
  clientPhone: v.optional(v.string()),
  issueSummary: v.optional(v.string()),
  createdAt: v.number(),
  personalizedFormSentAt: v.optional(v.number()),
  formReturnedAt: v.optional(v.number()),
  contractInvoiceSentAt: v.optional(v.number()),
  paidAt: v.optional(v.number()),
  retrievalRequested: v.boolean(),
})

export const caseDetailValidator = v.object({
  caseId: v.id("cases"),
  caseReference: v.string(),
  status: caseStatusValidator,
  matterType: matterTypeValidator,
  intakeRaw: v.string(),
  intakeStructured: intakeStructuredValidator,
  storagePrefix: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
  caseFileReviewPaidAt: v.optional(v.number()),
  includedPlanningCallsUsed: v.optional(v.number()),
  fulfillment: fulfillmentChecklistValidator,
  client: v.object({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
  }),
  estimate: v.union(estimateSummaryValidator, v.null()),
  payment: v.union(paymentSummaryValidator, v.null()),
  documents: v.array(documentSummaryValidator),
  appointments: v.array(appointmentSummaryValidator),
  callCredits: callCreditsValidator,
})
