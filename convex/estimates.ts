import { v } from "convex/values"
import { mutation } from "./_generated/server"
import { generateForCaseReturnValidator } from "./lib/validators"
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

    const { deliverable, isCustomQuote } = pricing
    const finalQuoteCents = deliverable.ourPriceCents ?? 0
    const now = Date.now()

    const estimateId = await ctx.db.insert("estimates", {
      caseId: args.caseId,
      serviceLine: isCustomQuote ? deliverable.serviceLine : deliverable.serviceLine,
      baseCostCents: finalQuoteCents,
      attorneyCompareLowCents: deliverable.attorneyLowCents,
      attorneyCompareHighCents: deliverable.attorneyHighCents,
      retrievalCostCents: 0,
      finalQuoteCents,
      status: isCustomQuote ? "draft" : "sent",
      createdAt: now,
    })

    await ctx.db.patch("cases", args.caseId, {
      matterType: matterTypeFromDeliverable(deliverable.matterType),
      assignedServices: [deliverable.serviceId],
      status: "estimate_sent",
      updatedAt: now,
    })

    await ctx.db.insert("agentRuns", {
      caseId: args.caseId,
      agentType: "pricing",
      inputRef: `${deliverable.id}:${pricing.matchedBy}`,
      outputRef: estimateId,
      status: "completed",
      createdAt: now,
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
