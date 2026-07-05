import { paginationOptsValidator } from "convex/server"
import { v } from "convex/values"
import { internalQuery, mutation, query } from "./_generated/server"
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

export const createFromIntake = mutation({
  args: intakeFormValidator,
  returns: createFromIntakeReturnValidator,
  handler: async (ctx, args) => {
    validateIntakeForm(args)

    const now = Date.now()
    const email = normalizeEmail(args.email)
    const intakeStructured = buildIntakeStructured(args)
    const intakeRaw = buildIntakeRaw(args)
    const caseMeta = resolveCaseFromIntake(args)

    const existingClient = await ctx.db
      .query("clients")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique()

    let clientId = existingClient?._id

    if (existingClient) {
      await ctx.db.patch("clients", existingClient._id, {
        firstName: args.firstName.trim(),
        lastName: args.lastName.trim(),
        phone: args.phone?.trim() || existingClient.phone,
      })
    } else {
      clientId = await ctx.db.insert("clients", {
        email,
        phone: args.phone?.trim() || undefined,
        firstName: args.firstName.trim(),
        lastName: args.lastName.trim(),
        createdAt: now,
      })
    }

    if (!clientId) {
      throw new Error("Unable to create client record")
    }

    const caseId = await ctx.db.insert("cases", {
      clientId,
      matterType: caseMeta.matterType,
      jurisdiction: { state: caseMeta.jurisdictionState },
      status: "intake",
      intakeRaw,
      intakeStructured,
      assignedServices: caseMeta.assignedServices,
      storagePrefix: "cases/pending/",
      createdAt: now,
      updatedAt: now,
    })

    const storagePrefix = `cases/${caseId}/`
    const caseReference = formatCaseReference(caseId)

    await ctx.db.patch("cases", caseId, {
      storagePrefix,
      updatedAt: now,
    })

    await ctx.db.insert("agentRuns", {
      caseId,
      agentType: "intake",
      inputRef: `intake:web:${clientId}`,
      outputRef: caseId,
      status: "completed",
      createdAt: now,
    })

    return {
      caseId,
      clientId,
      caseReference,
    }
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
    await scheduleIntakeEmailsIfNeeded(ctx, args.caseId)
    return null
  },
})

export const getIntakeEmailContext = internalQuery({
  args: { caseId: v.id("cases") },
  returns: v.union(
    v.object({
      clientFirstName: v.string(),
      clientLastName: v.string(),
      clientEmail: v.string(),
      clientPhone: v.optional(v.string()),
      issueSummary: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) return null

    const client = await ctx.db.get("clients", caseDoc.clientId)
    if (!client) return null

    return {
      clientFirstName: client.firstName,
      clientLastName: client.lastName,
      clientEmail: client.email,
      clientPhone: client.phone,
      issueSummary: caseDoc.intakeStructured.issueSummary,
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
          if (caseDoc.status !== "intake" && caseDoc.status !== "estimate_sent") {
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
        }
      : null

    return {
      caseId: caseDoc._id,
      caseReference: formatCaseReference(caseDoc._id),
      status: caseDoc.status,
      matterType: caseDoc.matterType,
      intakeRaw: caseDoc.intakeRaw,
      intakeStructured: caseDoc.intakeStructured,
      storagePrefix: caseDoc.storagePrefix,
      createdAt: caseDoc.createdAt,
      updatedAt: caseDoc.updatedAt,
      client: {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
      },
      estimate,
    }
  },
})
