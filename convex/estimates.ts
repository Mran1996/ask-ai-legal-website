import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalMutation, mutation } from "./_generated/server"
import { generateForCaseReturnValidator, matterTypeValidator } from "./lib/validators"
import { resolvePricing, matterTypeFromDeliverable } from "./lib/servicePricing"

export const generateForCase = mutation({
  args: { caseId: v.id("cases") },
  returns: generateForCaseReturnValidator,
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) {
      throw new Error("Case not found")
    }

    if (caseDoc.status !== "intake" && caseDoc.status !== "estimate_sent") {
      throw new Error("Estimate cannot be generated for this case status")
    }

    const existing = await ctx.db
      .query("estimates")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .first()

    if (existing) {
      const isCustomQuote = existing.finalQuoteCents === 0
      return {
        estimateId: existing._id,
        serviceLine: existing.serviceLine,
        finalQuoteCents: existing.finalQuoteCents,
        attorneyCompareLowCents: existing.attorneyCompareLowCents,
        attorneyCompareHighCents: existing.attorneyCompareHighCents,
        isCustomQuote,
      }
    }

    const structured = caseDoc.intakeStructured
    const pricing = resolvePricing({
      state: structured.clientStateInput ?? caseDoc.jurisdiction.state,
      caseType: structured.caseTypeLabel,
      issue: structured.issueSummary ?? structured.notes,
    })

    const { deliverable } = pricing
    const finalQuoteCents = deliverable.ourPriceCents ?? 0
    const isCustomQuote = finalQuoteCents === 0
    const now = Date.now()

    const estimateId = await ctx.db.insert("estimates", {
      caseId: args.caseId,
      serviceLine: deliverable.serviceLine,
      baseCostCents: finalQuoteCents,
      attorneyCompareLowCents: deliverable.attorneyLowCents,
      attorneyCompareHighCents: deliverable.attorneyHighCents,
      retrievalCostCents: 0,
      finalQuoteCents,
      status: isCustomQuote ? "draft" : "sent",
      createdAt: now,
    })

    await ctx.scheduler.runAfter(0, internal.estimates.finalizeEstimate, {
      caseId: args.caseId,
      estimateId,
      matterType: matterTypeFromDeliverable(deliverable.matterType),
      serviceId: deliverable.serviceId,
      inputRef: `${deliverable.id}:${pricing.matchedBy}`,
    })

    return {
      estimateId,
      serviceLine: deliverable.serviceLine,
      finalQuoteCents,
      attorneyCompareLowCents: deliverable.attorneyLowCents,
      attorneyCompareHighCents: deliverable.attorneyHighCents,
      isCustomQuote,
    }
  },
})

/** Deferred case update + audit — keeps generateForCase under local Convex 1s limit. */
export const finalizeEstimate = internalMutation({
  args: {
    caseId: v.id("cases"),
    estimateId: v.id("estimates"),
    matterType: matterTypeValidator,
    serviceId: v.string(),
    inputRef: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) {
      return null
    }

    if (caseDoc.status === "intake") {
      await ctx.db.patch("cases", args.caseId, {
        matterType: args.matterType,
        assignedServices: [args.serviceId],
        status: "estimate_sent",
        updatedAt: Date.now(),
      })
    }

    await ctx.db.insert("agentRuns", {
      caseId: args.caseId,
      agentType: "pricing",
      inputRef: args.inputRef,
      outputRef: args.estimateId,
      status: "completed",
      createdAt: Date.now(),
    })

    return null
  },
})
