import { v } from "convex/values"
import { internal } from "./_generated/api"
import type { Id } from "./_generated/dataModel"
import type { MutationCtx } from "./_generated/server"
import { mutation } from "./_generated/server"
import { assertOpsToken } from "./lib/opsAuth"

async function promoteApprovedDocument(
  ctx: MutationCtx,
  args: {
    caseId: Id<"cases">
    documentId: Id<"documents">
    reviewId: Id<"counselReviews">
  }
): Promise<void> {
  const doc = await ctx.db.get("documents", args.documentId)
  if (!doc || doc.caseId !== args.caseId) throw new Error("Document not found")

  const now = Date.now()
  await ctx.db.patch("documents", args.documentId, {
    status: "reviewed",
  })

  const existingFinal = await ctx.db
    .query("documents")
    .withIndex("by_case_and_folder", (q) =>
      q.eq("caseId", args.caseId).eq("folder", "final_delivered")
    )
    .collect()

  await ctx.db.insert("documents", {
    caseId: args.caseId,
    type: "final_delivered",
    folder: "final_delivered",
    fileName: doc.fileName.replace(/^DRAFT-/i, "FINAL-"),
    storageId: doc.storageId,
    status: "delivered",
    version: existingFinal.length + 1,
    createdAt: now,
  })

  const counselRuns = await ctx.db
    .query("agentRuns")
    .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
    .collect()
  for (const run of counselRuns) {
    if (
      run.agentType === "counsel" &&
      run.status === "running" &&
      run.inputRef === `counsel_review:${args.reviewId}`
    ) {
      await ctx.db.patch("agentRuns", run._id, {
        status: "completed",
        outputRef: args.documentId,
      })
    }
  }
}

export const recordCounselDecision = mutation({
  args: {
    opsToken: v.string(),
    reviewId: v.id("counselReviews"),
    decision: v.union(
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("needs_edit")
    ),
    reviewerId: v.string(),
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)

    const review = await ctx.db.get("counselReviews", args.reviewId)
    if (!review) throw new Error("Counsel review not found")

    const reviewerId = args.reviewerId.trim()
    if (!reviewerId) throw new Error("Reviewer name or ID is required")

    const now = Date.now()
    await ctx.db.patch("counselReviews", args.reviewId, {
      decision: args.decision,
      reviewerId,
      notes: args.notes?.trim() || undefined,
      reviewedAt: now,
    })

    if (args.decision === "approved") {
      await promoteApprovedDocument(ctx, {
        caseId: review.caseId,
        documentId: review.documentId,
        reviewId: args.reviewId,
      })
      return null
    }

    await ctx.db.patch("cases", review.caseId, {
      status: "in_drafting",
      updatedAt: now,
    })

    await ctx.db.insert("agentRuns", {
      caseId: review.caseId,
      agentType: "counsel",
      inputRef: `counsel_review:${args.reviewId}`,
      outputRef: args.decision,
      status: "completed",
      reviewedBy: reviewerId,
      createdAt: now,
    })

    return null
  },
})

export const regenerateCaseDraft = mutation({
  args: {
    opsToken: v.string(),
    caseId: v.id("cases"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)

    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) throw new Error("Case not found")

    const now = Date.now()
    const agentRunId = await ctx.db.insert("agentRuns", {
      caseId: args.caseId,
      agentType: "drafting",
      inputRef: "ops:regenerate_case_draft",
      outputRef: "running",
      status: "running",
      createdAt: now,
    })

    await ctx.db.patch("cases", args.caseId, {
      status: "in_drafting",
      updatedAt: now,
    })

    await ctx.scheduler.runAfter(0, internal.draftingActions.generateCaseDraft, {
      caseId: args.caseId,
      agentRunId,
      force: true,
    })

    return null
  },
})
