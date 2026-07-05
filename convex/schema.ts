import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import {
  agentRunStatusValidator,
  agentTypeValidator,
  caseStatusValidator,
  counselDecisionValidator,
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
    intakeRaw: v.string(),
    intakeStructured: intakeStructuredValidator,
    assignedServices: v.array(v.string()),
    storagePrefix: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  notifications: defineTable({
    caseId: v.id("cases"),
    type: notificationTypeValidator,
    recipient: v.string(),
    status: notificationStatusValidator,
    provider: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
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
    createdAt: v.number(),
  }).index("by_case", ["caseId"]),

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
