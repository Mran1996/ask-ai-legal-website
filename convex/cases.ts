import { paginationOptsValidator } from "convex/server"
import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalMutation, internalQuery, mutation, query } from "./_generated/server"
import { assertOpsToken } from "./lib/opsAuth"
import {
  caseDetailValidator,
  createFromIntakeReturnValidator,
  intakeFormValidator,
  intakeListItemValidator,
} from "./lib/validators"
import {
  buildIntakeRaw,
  buildIntakeStructured,
  formatCaseReference,
  normalizeEmail,
  resolveCaseFromIntake,
  validateIntakeForm,
} from "./lib/intakeMapping"
import { scheduleIntakeEmailsIfNeeded } from "./lib/scheduleIntakeEmails"
import { resolveCaseReference } from "./lib/caseLookup"

const INCLUDED_PLANNING_CALLS = 3

export const createFromIntake = mutation({
  args: intakeFormValidator,
  returns: createFromIntakeReturnValidator,
  handler: async (ctx, args) => {
    validateIntakeForm(args)

    const now = Date.now()
    const email = normalizeEmail(args.email)
    const intakeStructured = buildIntakeStructured(args)
    const intakeRaw = buildIntakeRaw(args)
    const firstName = args.firstName.trim()
    const lastName = args.lastName.trim()
    const phone = args.phone?.trim()

    const existingClient = await ctx.db
      .query("clients")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique()

    let clientId = existingClient?._id

    if (existingClient) {
      if (
        existingClient.firstName !== firstName ||
        existingClient.lastName !== lastName ||
        existingClient.phone !== (phone || existingClient.phone)
      ) {
        await ctx.db.patch("clients", existingClient._id, {
          firstName,
          lastName,
          phone: phone || existingClient.phone,
        })
      }
    } else {
      clientId = await ctx.db.insert("clients", {
        email,
        phone: phone || undefined,
        firstName,
        lastName,
        createdAt: now,
      })
    }

    if (!clientId) {
      throw new Error("Unable to create client record")
    }

    const resolved = resolveCaseFromIntake(args)

    const caseId = await ctx.db.insert("cases", {
      clientId,
      matterType: resolved.matterType,
      jurisdiction: {
        state: resolved.jurisdictionState,
        county: args.county?.trim() || undefined,
      },
      status: "intake",
      intakeRaw,
      intakeStructured,
      assignedServices: resolved.assignedServices,
      storagePrefix: "cases/pending/",
      includedPlanningCallsUsed: 0,
      createdAt: now,
      updatedAt: now,
    })

    const caseReference = formatCaseReference(caseId)
    await ctx.db.patch("cases", caseId, { caseReference })

    return {
      caseId,
      clientId,
      caseReference,
    }
  },
})

/** Deferred housekeeping — keeps createFromIntake under local Convex 1s limit. */
export const finalizeIntakeCase = internalMutation({
  args: {
    caseId: v.id("cases"),
    clientId: v.id("clients"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) {
      return null
    }

    if (caseDoc.storagePrefix === "cases/pending/") {
      await ctx.db.patch("cases", args.caseId, {
        storagePrefix: `cases/${args.caseId}/`,
        updatedAt: Date.now(),
      })
    }

    await ctx.db.insert("agentRuns", {
      caseId: args.caseId,
      agentType: "intake",
      inputRef: `intake:web:${args.clientId}`,
      outputRef: args.caseId,
      status: "completed",
      createdAt: Date.now(),
    })

    return null
  },
})

/** Fire-and-forget after intake UI succeeds — keeps createFromIntake under local 1s limit. */
export const requestIntakeNotifications = mutation({
  args: { caseId: v.id("cases") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) {
      throw new Error("Case not found")
    }

    await ctx.scheduler.runAfter(0, internal.cases.finalizeIntakeCase, {
      caseId: args.caseId,
      clientId: caseDoc.clientId,
    })
    await scheduleIntakeEmailsIfNeeded(ctx, args.caseId)
    return null
  },
})

const intakeEstimateValidator = v.object({
  serviceLine: v.string(),
  finalQuoteCents: v.number(),
  attorneyCompareLowCents: v.number(),
  attorneyCompareHighCents: v.number(),
  isCustomQuote: v.boolean(),
})

export const getFormReturnMeta = internalQuery({
  args: { caseId: v.id("cases") },
  returns: v.union(
    v.object({
      formReturnedAt: v.optional(v.number()),
      formReceivedAckSentAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) return null
    return {
      formReturnedAt: caseDoc.formReturnedAt,
      formReceivedAckSentAt: caseDoc.formReceivedAckSentAt,
    }
  },
})

export const getOutlookFolderContext = internalQuery({
  args: { caseId: v.id("cases") },
  returns: v.union(
    v.object({
      caseReference: v.string(),
      clientLastName: v.string(),
      clientFirstName: v.string(),
      outlookFolderPath: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) return null
    const client = await ctx.db.get("clients", caseDoc.clientId)
    if (!client) return null
    return {
      caseReference: resolveCaseReference(caseDoc),
      clientLastName: client.lastName,
      clientFirstName: client.firstName,
      outlookFolderPath: caseDoc.outlookFolderPath,
    }
  },
})

export const getDraftPackageContext = internalQuery({
  args: { caseId: v.id("cases") },
  returns: v.union(
    v.object({
      caseReference: v.string(),
      clientFirstName: v.string(),
      clientLastName: v.string(),
      intakeRaw: v.string(),
      issueSummary: v.optional(v.string()),
      state: v.optional(v.string()),
      county: v.optional(v.string()),
      caseTypeLabel: v.optional(v.string()),
      deadline: v.optional(v.string()),
      opposingParty: v.optional(v.string()),
      caseNumber: v.optional(v.string()),
      estimateServiceLine: v.optional(v.string()),
      draftIssuesSummary: v.optional(v.string()),
      draftPackageStatus: v.optional(
        v.union(
          v.literal("awaiting_ops_approval"),
          v.literal("approved_sent"),
          v.literal("rejected")
        )
      ),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) return null
    const client = await ctx.db.get("clients", caseDoc.clientId)
    if (!client) return null
    const estimate = await ctx.db
      .query("estimates")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .first()
    return {
      caseReference: resolveCaseReference(caseDoc),
      clientFirstName: client.firstName,
      clientLastName: client.lastName,
      intakeRaw: caseDoc.intakeRaw,
      issueSummary: caseDoc.intakeStructured.issueSummary,
      state: caseDoc.jurisdiction.state || caseDoc.intakeStructured.clientStateInput,
      county: caseDoc.jurisdiction.county,
      caseTypeLabel: caseDoc.intakeStructured.caseTypeLabel,
      deadline: caseDoc.intakeStructured.deadline,
      opposingParty: caseDoc.intakeStructured.opposingParty,
      caseNumber: caseDoc.intakeStructured.caseNumber,
      estimateServiceLine: estimate?.serviceLine,
      draftIssuesSummary: caseDoc.draftIssuesSummary,
      draftPackageStatus: caseDoc.draftPackageStatus,
    }
  },
})

export const getIntakeEmailContext = internalQuery({
  args: { caseId: v.id("cases") },
  returns: v.union(
    v.object({
      caseReference: v.string(),
      clientFirstName: v.string(),
      clientLastName: v.string(),
      clientEmail: v.string(),
      clientPhone: v.optional(v.string()),
      issueSummary: v.optional(v.string()),
      state: v.optional(v.string()),
      county: v.optional(v.string()),
      court: v.optional(v.string()),
      matterType: v.string(),
      caseTypeLabel: v.optional(v.string()),
      role: v.optional(v.string()),
      serviceNeeded: v.optional(v.string()),
      deadline: v.optional(v.string()),
      knownDates: v.optional(v.string()),
      opposingParty: v.optional(v.string()),
      hasDocuments: v.optional(v.string()),
      preferredContact: v.optional(v.string()),
      caseNumber: v.optional(v.string()),
      retrievalRequested: v.optional(v.boolean()),
      personalizedFormSentAt: v.optional(v.number()),
      estimate: v.union(intakeEstimateValidator, v.null()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) return null

    const client = await ctx.db.get("clients", caseDoc.clientId)
    if (!client) return null

    const estimateDoc = await ctx.db
      .query("estimates")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .first()

    const estimate = estimateDoc
      ? {
          serviceLine: estimateDoc.serviceLine,
          finalQuoteCents: estimateDoc.finalQuoteCents,
          attorneyCompareLowCents: estimateDoc.attorneyCompareLowCents,
          attorneyCompareHighCents: estimateDoc.attorneyCompareHighCents,
          isCustomQuote: estimateDoc.finalQuoteCents === 0,
        }
      : null

    const s = caseDoc.intakeStructured

    return {
      caseReference: resolveCaseReference(caseDoc),
      clientFirstName: client.firstName,
      clientLastName: client.lastName,
      clientEmail: client.email,
      clientPhone: client.phone,
      issueSummary: s.issueSummary,
      state: caseDoc.jurisdiction.state || s.clientStateInput,
      county: caseDoc.jurisdiction.county ?? s.county,
      court: caseDoc.jurisdiction.court,
      matterType: caseDoc.matterType,
      caseTypeLabel: s.caseTypeLabel,
      role: s.role,
      serviceNeeded: s.serviceNeeded,
      deadline: s.deadline,
      knownDates: s.knownDates,
      opposingParty: s.opposingParty,
      hasDocuments: s.hasDocuments,
      preferredContact: s.preferredContact,
      caseNumber: s.caseNumber,
      retrievalRequested: s.retrievalRequested,
      personalizedFormSentAt: caseDoc.personalizedFormSentAt,
      estimate,
    }
  },
})

export const listRecentIntakes = query({
  args: {
    opsToken: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  returns: v.object({
    page: v.array(intakeListItemValidator),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)

    const result = await ctx.db
      .query("cases")
      .withIndex("by_createdAt")
      .order("desc")
      .paginate(args.paginationOpts)

    const page = (
      await Promise.all(
        result.page.map(async (caseDoc) => {
          if (
            caseDoc.status !== "intake" &&
            caseDoc.status !== "estimate_sent" &&
            caseDoc.status !== "awaiting_payment" &&
            caseDoc.status !== "awaiting_docs" &&
            caseDoc.status !== "in_drafting" &&
            caseDoc.status !== "delivered"
          ) {
            return null
          }

          const client = await ctx.db.get("clients", caseDoc.clientId)
          if (!client) return null

          return {
            caseId: caseDoc._id,
            caseReference: formatCaseReference(caseDoc._id),
            status: caseDoc.status,
            clientFirstName: client.firstName,
            clientLastName: client.lastName,
            clientEmail: client.email,
            clientPhone: client.phone,
            issueSummary: caseDoc.intakeStructured.issueSummary,
            createdAt: caseDoc.createdAt,
            personalizedFormSentAt: caseDoc.personalizedFormSentAt,
            formReturnedAt: caseDoc.formReturnedAt,
            contractInvoiceSentAt: caseDoc.contractInvoiceSentAt,
            paidAt: caseDoc.paidAt,
            retrievalRequested: caseDoc.intakeStructured.retrievalRequested === true,
          }
        })
      )
    ).filter((row): row is NonNullable<typeof row> => row !== null)

    return {
      page,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    }
  },
})

export const getCaseForOps = query({
  args: {
    opsToken: v.string(),
    caseId: v.id("cases"),
  },
  returns: v.union(caseDetailValidator, v.null()),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)

    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) return null

    const client = await ctx.db.get("clients", caseDoc.clientId)
    if (!client) return null

    const estimateRow = await ctx.db
      .query("estimates")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .order("desc")
      .first()

    const estimate = estimateRow
      ? {
          estimateId: estimateRow._id,
          serviceLine: estimateRow.serviceLine,
          finalQuoteCents: estimateRow.finalQuoteCents,
          attorneyCompareLowCents: estimateRow.attorneyCompareLowCents,
          attorneyCompareHighCents: estimateRow.attorneyCompareHighCents,
          isCustomQuote: estimateRow.finalQuoteCents === 0,
          retrievalCostCents: estimateRow.retrievalCostCents,
        }
      : null

    const paymentRows = await ctx.db
      .query("payments")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect()
    const latestPayment = paymentRows.sort((a, b) => b.createdAt - a.createdAt)[0]
    const payment = latestPayment
      ? {
          paymentId: latestPayment._id,
          type: latestPayment.type,
          amountCents: latestPayment.amountCents,
          status: latestPayment.status,
          createdAt: latestPayment.createdAt,
        }
      : null

    const documentRows = await ctx.db
      .query("documents")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect()
    const documents = await Promise.all(
      documentRows.map(async (row) => {
        const url = await ctx.storage.getUrl(row.storageId)
        return {
          documentId: row._id,
          fileName: row.fileName,
          folder: row.folder,
          type: row.type,
          status: row.status,
          createdAt: row.createdAt,
          url: url ?? undefined,
        }
      })
    )

    const appointmentRows = await ctx.db
      .query("appointments")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .order("desc")
      .collect()

    const notificationRows = await ctx.db
      .query("notifications")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect()

    const appointments = appointmentRows.map((row) => ({
      appointmentId: row._id,
      callType: row.callType,
      scheduledAt: row.scheduledAt,
      timezone: row.timezone,
      durationMinutes: row.durationMinutes,
      status: row.status,
      meetLink: row.meetLink,
      attendeeEmail: row.attendeeEmail,
    }))

    const caseFileReviewPaid = caseDoc.caseFileReviewPaidAt !== undefined
    const planningUsed = caseDoc.includedPlanningCallsUsed ?? 0
    const callCredits = {
      caseFileReviewPaid,
      includedPlanningCallsRemaining: caseFileReviewPaid
        ? Math.max(0, INCLUDED_PLANNING_CALLS - planningUsed)
        : 0,
      followUpCallsPaid: false,
    }

    return {
      caseId: caseDoc._id,
      caseReference: resolveCaseReference(caseDoc),
      status: caseDoc.status,
      matterType: caseDoc.matterType,
      intakeRaw: caseDoc.intakeRaw,
      intakeStructured: caseDoc.intakeStructured,
      storagePrefix: caseDoc.storagePrefix,
      createdAt: caseDoc.createdAt,
      updatedAt: caseDoc.updatedAt,
      caseFileReviewPaidAt: caseDoc.caseFileReviewPaidAt,
      includedPlanningCallsUsed: caseDoc.includedPlanningCallsUsed,
      fulfillment: {
        personalizedFormSentAt: caseDoc.personalizedFormSentAt,
        formReturnedAt: caseDoc.formReturnedAt,
        formReceivedAckSentAt: caseDoc.formReceivedAckSentAt,
        contractInvoiceSentAt: caseDoc.contractInvoiceSentAt,
        paidAt: caseDoc.paidAt,
        paymentLinkUrl: caseDoc.paymentLinkUrl,
        retrievalRequested: caseDoc.intakeStructured.retrievalRequested === true,
        caseNumber: caseDoc.intakeStructured.caseNumber,
        draftIssuesSummary: caseDoc.draftIssuesSummary,
        draftPackageStatus: caseDoc.draftPackageStatus,
        draftPackageGeneratedAt: caseDoc.draftPackageGeneratedAt,
        quotedStartAmountCents: caseDoc.quotedStartAmountCents,
        gapQuestions: caseDoc.gapQuestions,
        gapQuestionsSentAt: caseDoc.gapQuestionsSentAt,
        gapQuestionsAnsweredAt: caseDoc.gapQuestionsAnsweredAt,
        outlookFolderPath: caseDoc.outlookFolderPath,
        outlookFolderId: caseDoc.outlookFolderId,
        outlookFolderCreatedAt: caseDoc.outlookFolderCreatedAt,
      },
      client: {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
      },
      estimate,
      payment,
      documents,
      appointments,
      callCredits,
      notifications: notificationRows
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((row) => ({
          notificationId: row._id,
          type: row.type,
          recipient: row.recipient,
          status: row.status,
          errorMessage: row.errorMessage,
          createdAt: row.createdAt,
        })),
    }
  },
})
