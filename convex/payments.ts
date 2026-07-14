import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalMutation, internalQuery, mutation, query } from "./_generated/server"
import type { QueryCtx } from "./_generated/server"
import type { Id } from "./_generated/dataModel"
import { assertOpsToken } from "./lib/opsAuth"
import {
  documentPrepStartCents,
  retrievalFeeCents,
  totalDueBeforeWorkCents,
} from "./lib/quoteTotal"

export const savePostIntakeQuoteDetails = mutation({
  args: {
    caseId: v.id("cases"),
    caseNumber: v.optional(v.string()),
    retrievalRequested: v.boolean(),
  },
  returns: v.object({
    documentPrepCents: v.number(),
    retrievalCents: v.number(),
    totalDueCents: v.number(),
    status: v.string(),
  }),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) {
      throw new Error("Case not found")
    }

    // Allow updates until paid work has started / delivered
    if (
      caseDoc.status === "in_drafting" ||
      caseDoc.status === "delivered" ||
      caseDoc.status === "closed" ||
      caseDoc.status === "in_counsel_review"
    ) {
      throw new Error("Quote details can only be updated before work starts")
    }

    const caseNumber = args.caseNumber?.trim() || undefined
    const retrievalRequested = args.retrievalRequested
    const now = Date.now()

    await ctx.db.patch("cases", args.caseId, {
      intakeStructured: {
        ...caseDoc.intakeStructured,
        caseNumber,
        retrievalRequested,
      },
      // Email funnel: stay estimate_sent until ops sends invoice package
      status:
        caseDoc.status === "intake" || caseDoc.status === "estimate_sent"
          ? "estimate_sent"
          : caseDoc.status,
      updatedAt: now,
    })

    const estimate = await ctx.db
      .query("estimates")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .first()

    const retrievalCents = retrievalFeeCents(retrievalRequested)

    if (estimate) {
      const isCustomQuote = estimate.finalQuoteCents === 0
      const documentPrepCents = documentPrepStartCents({
        finalQuoteCents: estimate.finalQuoteCents,
        isCustomQuote,
      })
      const totalDueCents = totalDueBeforeWorkCents({
        finalQuoteCents: estimate.finalQuoteCents,
        isCustomQuote,
        retrievalRequested,
      })

      await ctx.db.patch("estimates", estimate._id, {
        retrievalCostCents: retrievalCents,
      })

      const refreshed = await ctx.db.get("cases", args.caseId)
      return {
        documentPrepCents,
        retrievalCents,
        totalDueCents,
        status: refreshed?.status ?? "estimate_sent",
      }
    }

    // Estimate may still be generating — still persist caseNumber / retrieval
    const refreshed = await ctx.db.get("cases", args.caseId)
    return {
      documentPrepCents: 0,
      retrievalCents,
      totalDueCents: retrievalCents,
      status: refreshed?.status ?? "estimate_sent",
    }
  },
})

export const ensureAwaitingPayment = internalMutation({
  args: { caseId: v.id("cases") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) return null
    if (caseDoc.status === "estimate_sent" || caseDoc.status === "intake") {
      await ctx.db.patch("cases", args.caseId, {
        status: "awaiting_payment",
        updatedAt: Date.now(),
      })
    }
    return null
  },
})

export const recordCheckoutSession = internalMutation({
  args: {
    caseId: v.id("cases"),
    estimateId: v.id("estimates"),
    amountCents: v.number(),
    stripeCheckoutSessionId: v.string(),
  },
  returns: v.id("payments"),
  handler: async (ctx, args) => {
    await ctx.db.patch("estimates", args.estimateId, {
      stripeCheckoutSessionId: args.stripeCheckoutSessionId,
    })

    const existingPending = await ctx.db
      .query("payments")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect()

    for (const row of existingPending) {
      if (row.status === "pending") {
        await ctx.db.patch("payments", row._id, { status: "failed" })
      }
    }

    return await ctx.db.insert("payments", {
      caseId: args.caseId,
      estimateId: args.estimateId,
      type: "case_start",
      amountCents: args.amountCents,
      status: "pending",
      createdAt: Date.now(),
    })
  },
})

export const markCheckoutPaid = internalMutation({
  args: {
    stripeCheckoutSessionId: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    amountCents: v.number(),
  },
  returns: v.union(
    v.object({
      caseId: v.id("cases"),
      nextStatus: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const estimate = await ctx.db
      .query("estimates")
      .withIndex("by_stripeCheckoutSessionId", (q) =>
        q.eq("stripeCheckoutSessionId", args.stripeCheckoutSessionId)
      )
      .first()

    if (!estimate) {
      console.error("No estimate for checkout session", args.stripeCheckoutSessionId)
      return null
    }

    const caseDoc = await ctx.db.get("cases", estimate.caseId)
    if (!caseDoc) return null

    const payments = await ctx.db
      .query("payments")
      .withIndex("by_case", (q) => q.eq("caseId", estimate.caseId))
      .collect()

    let payment =
      payments.find((p) => p.status === "pending") ??
      payments.find((p) => p.estimateId === estimate._id)

    if (payment) {
      await ctx.db.patch("payments", payment._id, {
        status: "paid",
        amountCents: args.amountCents,
        stripePaymentIntentId: args.stripePaymentIntentId,
      })
    } else {
      await ctx.db.insert("payments", {
        caseId: estimate.caseId,
        estimateId: estimate._id,
        type: "case_start",
        amountCents: args.amountCents,
        status: "paid",
        stripePaymentIntentId: args.stripePaymentIntentId,
        createdAt: Date.now(),
      })
    }

    await ctx.db.patch("estimates", estimate._id, { status: "accepted" })

    const retrievalPaid = (estimate.retrievalCostCents ?? 0) > 0
    const docs = await ctx.db
      .query("documents")
      .withIndex("by_case", (q) => q.eq("caseId", estimate.caseId))
      .collect()
    const hasUploads = docs.some(
      (d) => d.folder === "intake" || d.folder === "uploaded_by_client"
    )

    // Money before work: after pay → drafting if materials covered, else awaiting_docs.
    const nextStatus =
      retrievalPaid || hasUploads ? "in_drafting" : "awaiting_docs"

    await ctx.db.patch("cases", estimate.caseId, {
      status: nextStatus,
      caseFileReviewPaidAt: Date.now(),
      updatedAt: Date.now(),
    })

    await ctx.db.insert("agentRuns", {
      caseId: estimate.caseId,
      agentType: "pricing",
      inputRef: `stripe:${args.stripeCheckoutSessionId}`,
      outputRef: `paid:${nextStatus}`,
      status: "completed",
      createdAt: Date.now(),
    })

    return { caseId: estimate.caseId, nextStatus }
  },
})

export const markPersonalizedFormSent = mutation({
  args: { opsToken: v.string(), caseId: v.id("cases") },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) throw new Error("Case not found")
    const now = Date.now()
    await ctx.db.patch("cases", args.caseId, {
      personalizedFormSentAt: now,
      updatedAt: now,
    })
    await ctx.scheduler.runAfter(0, internal.emailActions.sendPersonalizedFormEmail, {
      caseId: args.caseId,
    })
    return null
  },
})

export const markFormReturned = mutation({
  args: { opsToken: v.string(), caseId: v.id("cases") },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) throw new Error("Case not found")
    await ctx.db.patch("cases", args.caseId, {
      formReturnedAt: Date.now(),
      updatedAt: Date.now(),
    })
    return null
  },
})

export const markContractInvoiceSent = mutation({
  args: {
    opsToken: v.string(),
    caseId: v.id("cases"),
    paymentLinkUrl: v.optional(v.string()),
    quotedAmountCents: v.optional(v.number()),
    scopeSummary: v.optional(v.string()),
    timeframe: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) throw new Error("Case not found")
    const now = Date.now()
    const paymentLinkUrl = args.paymentLinkUrl?.trim() || caseDoc.paymentLinkUrl
    await ctx.db.patch("cases", args.caseId, {
      contractInvoiceSentAt: now,
      paymentLinkUrl,
      status: "awaiting_payment",
      updatedAt: now,
    })
    await ctx.scheduler.runAfter(0, internal.emailActions.sendQuoteContractInvoiceEmail, {
      caseId: args.caseId,
      paymentLinkUrl: paymentLinkUrl ?? "",
      quotedAmountCents: args.quotedAmountCents,
      scopeSummary: args.scopeSummary,
      timeframe: args.timeframe,
    })
    return null
  },
})

export const markPaidManual = mutation({
  args: {
    opsToken: v.string(),
    caseId: v.id("cases"),
    amountCents: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) throw new Error("Case not found")

    const estimate = await ctx.db
      .query("estimates")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .first()
    if (!estimate) throw new Error("Estimate not found")

    const now = Date.now()
    const amountCents =
      args.amountCents ??
      totalDueBeforeWorkCents({
        finalQuoteCents: estimate.finalQuoteCents,
        isCustomQuote: estimate.finalQuoteCents === 0,
        retrievalRequested: caseDoc.intakeStructured.retrievalRequested === true,
      })

    await ctx.db.insert("payments", {
      caseId: args.caseId,
      estimateId: estimate._id,
      type: "case_start",
      amountCents,
      status: "paid",
      createdAt: now,
    })

    const retrievalPaid = (estimate.retrievalCostCents ?? 0) > 0
    const docs = await ctx.db
      .query("documents")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect()
    const hasUploads = docs.some(
      (d) => d.folder === "intake" || d.folder === "uploaded_by_client"
    )
    const nextStatus = retrievalPaid || hasUploads ? "in_drafting" : "awaiting_docs"

    await ctx.db.patch("cases", args.caseId, {
      paidAt: now,
      caseFileReviewPaidAt: now,
      status: nextStatus,
      updatedAt: now,
    })
    await ctx.db.patch("estimates", estimate._id, { status: "accepted" })

    return null
  },
})

async function assertCasePaid(
  ctx: { db: QueryCtx["db"] },
  caseId: Id<"cases">
): Promise<void> {
  const caseDoc = await ctx.db.get("cases", caseId)
  if (!caseDoc) throw new Error("Case not found")
  if (caseDoc.paidAt !== undefined) return
  const paid = await ctx.db
    .query("payments")
    .withIndex("by_case", (q) => q.eq("caseId", caseId))
    .collect()
  if (!paid.some((p) => p.status === "paid")) {
    throw new Error("Cannot proceed before payment is noted")
  }
}

export const markWorkStarted = mutation({
  args: {
    opsToken: v.string(),
    caseId: v.id("cases"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    await assertCasePaid(ctx, args.caseId)

    await ctx.db.patch("cases", args.caseId, {
      status: "in_drafting",
      updatedAt: Date.now(),
    })

    await ctx.db.insert("agentRuns", {
      caseId: args.caseId,
      agentType: "drafting",
      inputRef: "ops:mark_work_started",
      outputRef: args.caseId,
      status: "running",
      createdAt: Date.now(),
    })

    return null
  },
})

export const markDelivered = mutation({
  args: {
    opsToken: v.string(),
    caseId: v.id("cases"),
    note: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    await assertCasePaid(ctx, args.caseId)

    await ctx.db.patch("cases", args.caseId, {
      status: "delivered",
      updatedAt: Date.now(),
    })

    await ctx.db.insert("agentRuns", {
      caseId: args.caseId,
      agentType: "drafting",
      inputRef: args.note?.trim() || "ops:mark_delivered",
      outputRef: "delivered",
      status: "completed",
      createdAt: Date.now(),
    })

    await ctx.scheduler.runAfter(0, internal.emailActions.sendDeliveryEmail, {
      caseId: args.caseId,
    })

    return null
  },
})

export const getCheckoutContext = query({
  args: { caseId: v.id("cases") },
  returns: v.union(
    v.object({
      caseReference: v.string(),
      clientEmail: v.string(),
      clientName: v.string(),
      serviceLine: v.string(),
      documentPrepCents: v.number(),
      retrievalCents: v.number(),
      totalDueCents: v.number(),
      retrievalRequested: v.boolean(),
      estimateId: v.id("estimates"),
      status: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await loadCheckoutContext(ctx, args.caseId)
  },
})

export const getCheckoutContextInternal = internalQuery({
  args: { caseId: v.id("cases") },
  returns: v.union(
    v.object({
      caseReference: v.string(),
      clientEmail: v.string(),
      clientName: v.string(),
      serviceLine: v.string(),
      documentPrepCents: v.number(),
      retrievalCents: v.number(),
      totalDueCents: v.number(),
      retrievalRequested: v.boolean(),
      estimateId: v.id("estimates"),
      status: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await loadCheckoutContext(ctx, args.caseId)
  },
})

async function loadCheckoutContext(ctx: QueryCtx, caseId: Id<"cases">) {
  const caseDoc = await ctx.db.get("cases", caseId)
  if (!caseDoc) return null
  const client = await ctx.db.get("clients", caseDoc.clientId)
  if (!client) return null
  const estimate = await ctx.db
    .query("estimates")
    .withIndex("by_case", (q) => q.eq("caseId", caseId))
    .first()
  if (!estimate) return null

  const isCustomQuote = estimate.finalQuoteCents === 0
  const retrievalRequested = caseDoc.intakeStructured.retrievalRequested === true
  const retrievalCents =
    estimate.retrievalCostCents > 0
      ? estimate.retrievalCostCents
      : retrievalFeeCents(retrievalRequested)

  return {
    caseReference: caseDoc.caseReference ?? String(caseDoc._id),
    clientEmail: client.email,
    clientName: `${client.firstName} ${client.lastName}`.trim(),
    serviceLine: estimate.serviceLine,
    documentPrepCents: documentPrepStartCents({
      finalQuoteCents: estimate.finalQuoteCents,
      isCustomQuote,
    }),
    retrievalCents,
    totalDueCents: totalDueBeforeWorkCents({
      finalQuoteCents: estimate.finalQuoteCents,
      isCustomQuote,
      retrievalRequested: retrievalCents > 0,
    }),
    retrievalRequested: retrievalCents > 0,
    estimateId: estimate._id,
    status: caseDoc.status,
  }
}
