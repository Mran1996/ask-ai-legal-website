import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import {
  agentRunStatusValidator,
  agentTypeValidator,
  appointmentCallTypeValidator,
  appointmentStatusValidator,
  casePriorityValidator,
  caseStatusValidator,
  chatAuthorTypeValidator,
  citationTypeValidator,
  counselDecisionValidator,
  deadlineKindValidator,
  notificationChannelValidator,
  notificationStatusValidator,
  notificationTypeValidator,
  documentFolderValidator,
  documentStatusValidator,
  documentTypeValidator,
  estimateStatusValidator,
  intakeStructuredValidator,
  jurisdictionValidator,
  matterTypeValidator,
  paymentStatusValidator,
  paymentTypeValidator,
} from "./lib/validators"

export default defineSchema({
  clients: defineTable({
    email: v.string(),
    phone: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.string(),
    authUserId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  cases: defineTable({
    clientId: v.id("clients"),
    matterType: matterTypeValidator,
    jurisdiction: jurisdictionValidator,
    status: caseStatusValidator,
    caseReference: v.optional(v.string()),
    intakeRaw: v.string(),
    intakeStructured: intakeStructuredValidator,
    assignedServices: v.array(v.string()),
    storagePrefix: v.string(),
    caseFileReviewPaidAt: v.optional(v.number()),
    includedPlanningCallsUsed: v.optional(v.number()),
    /** Email funnel: personalized intake form sent to client */
    personalizedFormSentAt: v.optional(v.number()),
    formReturnedAt: v.optional(v.number()),
    contractInvoiceSentAt: v.optional(v.number()),
    /** Manual or Stripe — payment received off-site / noted in ops */
    paidAt: v.optional(v.number()),
    /** Stripe Payment Link or invoice URL pasted by ops for email package */
    paymentLinkUrl: v.optional(v.string()),
    /** Client auto-ack after Part 1 returned */
    formReceivedAckSentAt: v.optional(v.number()),
    /** LLM draft of issues/docs we can prepare — ops must approve before client send */
    draftIssuesSummary: v.optional(v.string()),
    draftPackageStatus: v.optional(
      v.union(
        v.literal("awaiting_ops_approval"),
        v.literal("approved_sent"),
        v.literal("rejected")
      )
    ),
    draftPackageGeneratedAt: v.optional(v.number()),
    /** Start fee used in approve/send package (default $499.99) */
    quotedStartAmountCents: v.optional(v.number()),
    /** Outlook mail folder path created after paid */
    outlookFolderPath: v.optional(v.string()),
    outlookFolderId: v.optional(v.string()),
    outlookFolderCreatedAt: v.optional(v.number()),
    /** Practice OS: staff member responsible for this case */
    ownerId: v.optional(v.string()),
    priority: v.optional(casePriorityValidator),
    /** Denormalized earliest open deadline for board sorting / urgency color */
    nextDeadlineAt: v.optional(v.number()),
    lastActivityAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"])
    .index("by_caseReference", ["caseReference"]),

  appointments: defineTable({
    caseId: v.id("cases"),
    callType: appointmentCallTypeValidator,
    scheduledAt: v.number(),
    timezone: v.optional(v.string()),
    durationMinutes: v.number(),
    status: appointmentStatusValidator,
    provider: v.string(),
    externalEventId: v.string(),
    meetLink: v.optional(v.string()),
    attendeeEmail: v.optional(v.string()),
    attendeeName: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_case", ["caseId"])
    .index("by_externalEventId", ["externalEventId"]),

  notifications: defineTable({
    caseId: v.id("cases"),
    type: notificationTypeValidator,
    recipient: v.string(),
    status: notificationStatusValidator,
    provider: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    /** Practice OS: delivery channel + in-app read state + display copy */
    channel: v.optional(notificationChannelValidator),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_case", ["caseId"])
    .index("by_channel", ["channel"]),

  deadlines: defineTable({
    caseId: v.id("cases"),
    label: v.string(),
    dueAt: v.number(),
    kind: deadlineKindValidator,
    completedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    /** Largest reminder window already sent (7, 3, or 1 days) so the cron never repeats */
    lastReminderDays: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_case", ["caseId"])
    .index("by_dueAt", ["dueAt"]),

  caseChatMessages: defineTable({
    caseId: v.id("cases"),
    authorType: chatAuthorTypeValidator,
    authorId: v.string(),
    body: v.string(),
    attachments: v.optional(
      v.array(v.object({ documentId: v.id("documents"), fileName: v.string() }))
    ),
    agentType: v.optional(agentTypeValidator),
    createdAt: v.number(),
  }).index("by_case", ["caseId"]),

  documentVersions: defineTable({
    documentId: v.id("documents"),
    caseId: v.id("cases"),
    version: v.number(),
    content: v.string(),
    editedBy: v.string(),
    changeNote: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_document", ["documentId"])
    .index("by_case", ["caseId"]),

  citations: defineTable({
    caseId: v.id("cases"),
    agentRunId: v.optional(v.id("agentRuns")),
    type: citationTypeValidator,
    reference: v.string(),
    title: v.optional(v.string()),
    sourceUrl: v.string(),
    /** Hard rule: drafting may only use citations with verified === true */
    verified: v.boolean(),
    snippet: v.optional(v.string()),
    retrievedAt: v.number(),
  }).index("by_case", ["caseId"]),

  accessLogs: defineTable({
    caseId: v.id("cases"),
    actorId: v.string(),
    action: v.string(),
    createdAt: v.number(),
  }).index("by_case", ["caseId"]),

  estimates: defineTable({
    caseId: v.id("cases"),
    serviceLine: v.string(),
    baseCostCents: v.number(),
    attorneyCompareLowCents: v.number(),
    attorneyCompareHighCents: v.number(),
    retrievalCostCents: v.number(),
    finalQuoteCents: v.number(),
    status: estimateStatusValidator,
    stripeCheckoutSessionId: v.optional(v.string()),
    /** state|deliverableId|caseType|issueBucket — reuse estimate only when this matches */
    matterSignature: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_case", ["caseId"])
    .index("by_stripeCheckoutSessionId", ["stripeCheckoutSessionId"]),

  documents: defineTable({
    caseId: v.id("cases"),
    type: documentTypeValidator,
    folder: documentFolderValidator,
    fileName: v.string(),
    storageId: v.string(),
    status: documentStatusValidator,
    version: v.number(),
    createdAt: v.number(),
  })
    .index("by_case", ["caseId"])
    .index("by_case_and_folder", ["caseId", "folder"]),

  payments: defineTable({
    caseId: v.id("cases"),
    estimateId: v.id("estimates"),
    type: paymentTypeValidator,
    amountCents: v.number(),
    status: paymentStatusValidator,
    stripePaymentIntentId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_case", ["caseId"]),

  agentRuns: defineTable({
    caseId: v.id("cases"),
    agentType: agentTypeValidator,
    inputRef: v.string(),
    outputRef: v.string(),
    status: agentRunStatusValidator,
    reviewedBy: v.optional(v.string()),
    /** Practice OS council: human-readable result + verified citation ids + model confidence */
    summary: v.optional(v.string()),
    citationIds: v.optional(v.array(v.id("citations"))),
    confidence: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_case", ["caseId"]),

  counselReviews: defineTable({
    caseId: v.id("cases"),
    documentId: v.id("documents"),
    reviewerId: v.string(),
    decision: counselDecisionValidator,
    notes: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
  })
    .index("by_case", ["caseId"])
    .index("by_document", ["documentId"]),
})
