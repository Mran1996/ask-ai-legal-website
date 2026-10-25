import { v } from "convex/values"
import { internalMutation, mutation } from "./_generated/server"
import { assertOpsToken } from "./lib/opsAuth"

const MAX_FILE_NAME_LENGTH = 255

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})

export const attachIntakeDocument = mutation({
  args: {
    caseId: v.id("cases"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    contentType: v.optional(v.string()),
  },
  returns: v.id("documents"),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) {
      throw new Error("Case not found")
    }

    const fileName = args.fileName.trim().slice(0, MAX_FILE_NAME_LENGTH)
    if (!fileName) {
      throw new Error("File name is required")
    }

    const existing = await ctx.db
      .query("documents")
      .withIndex("by_case_and_folder", (q) =>
        q.eq("caseId", args.caseId).eq("folder", "intake")
      )
      .collect()

    const version = existing.length + 1

    return await ctx.db.insert("documents", {
      caseId: args.caseId,
      type: "uploaded_by_client",
      folder: "intake",
      fileName,
      storageId: args.storageId,
      status: "received",
      version,
      createdAt: Date.now(),
    })
  },
})

/** Ops upload onto a matter (visible in Documents tab immediately). */
export const attachOpsDocument = mutation({
  args: {
    opsToken: v.string(),
    caseId: v.id("cases"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    contentType: v.optional(v.string()),
    folder: v.optional(
      v.union(
        v.literal("intake"),
        v.literal("uploaded_by_client"),
        v.literal("drafts"),
        v.literal("counsel_review"),
        v.literal("final_delivered")
      )
    ),
  },
  returns: v.id("documents"),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) throw new Error("Case not found")

    const fileName = args.fileName.trim().slice(0, MAX_FILE_NAME_LENGTH)
    if (!fileName) throw new Error("File name is required")

    const folder = args.folder ?? "uploaded_by_client"
    const existing = await ctx.db
      .query("documents")
      .withIndex("by_case_and_folder", (q) =>
        q.eq("caseId", args.caseId).eq("folder", folder)
      )
      .collect()

    return await ctx.db.insert("documents", {
      caseId: args.caseId,
      type: "uploaded_by_client",
      folder,
      fileName,
      storageId: args.storageId,
      status: "received",
      version: existing.length + 1,
      createdAt: Date.now(),
    })
  },
})
/** Persist generated Word intake form + mark form sent (audit). */
export const recordPersonalizedFormDelivery = internalMutation({
  args: {
    caseId: v.id("cases"),
    storageId: v.id("_storage"),
    fileName: v.string(),
  },
  returns: v.id("documents"),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) throw new Error("Case not found")

    const now = Date.now()
    const existing = await ctx.db
      .query("documents")
      .withIndex("by_case_and_folder", (q) =>
        q.eq("caseId", args.caseId).eq("folder", "intake")
      )
      .collect()
    const version = existing.length + 1

    const documentId = await ctx.db.insert("documents", {
      caseId: args.caseId,
      type: "personalized_intake_form",
      folder: "intake",
      fileName: args.fileName.slice(0, MAX_FILE_NAME_LENGTH),
      storageId: args.storageId,
      status: "received",
      version,
      createdAt: now,
    })

    await ctx.db.patch("cases", args.caseId, {
      personalizedFormSentAt: now,
      updatedAt: now,
    })

    await ctx.db.insert("agentRuns", {
      caseId: args.caseId,
      agentType: "intake",
      inputRef: `personalized_form:${args.caseId}`,
      outputRef: args.storageId,
      status: "completed",
      createdAt: now,
    })

    return documentId
  },
})

export const saveGeneratedDraftInternal = internalMutation({
  args: {
    caseId: v.id("cases"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    agentRunId: v.optional(v.id("agentRuns")),
    mode: v.string(),
  },
  returns: v.object({
    documentId: v.id("documents"),
    reviewId: v.id("counselReviews"),
  }),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) throw new Error("Case not found")

    const now = Date.now()
    const existing = await ctx.db
      .query("documents")
      .withIndex("by_case_and_folder", (q) =>
        q.eq("caseId", args.caseId).eq("folder", "drafts")
      )
      .collect()
    const version = existing.length + 1

    const documentId = await ctx.db.insert("documents", {
      caseId: args.caseId,
      type: "drafted_by_us",
      folder: "drafts",
      fileName: args.fileName.slice(0, 255),
      storageId: args.storageId,
      status: "processing",
      version,
      createdAt: now,
    })

    const reviewId = await ctx.db.insert("counselReviews", {
      caseId: args.caseId,
      documentId,
      reviewerId: "awaiting_counsel",
      decision: "pending",
      notes: "Auto-queued after AI draft generation",
    })

    await ctx.db.patch("cases", args.caseId, {
      status: "in_counsel_review",
      updatedAt: now,
    })

    if (args.agentRunId) {
      await ctx.db.patch("agentRuns", args.agentRunId, {
        status: "completed",
        outputRef: documentId,
      })
    } else {
      await ctx.db.insert("agentRuns", {
        caseId: args.caseId,
        agentType: "drafting",
        inputRef: "drafting:generate_case_draft",
        outputRef: documentId,
        status: "completed",
        createdAt: now,
      })
    }

    await ctx.db.insert("agentRuns", {
      caseId: args.caseId,
      agentType: "counsel",
      inputRef: `counsel_review:${reviewId}`,
      outputRef: documentId,
      status: "running",
      createdAt: now,
    })

    return { documentId, reviewId }
  },
})

export const markDraftAgentRunFailed = internalMutation({
  args: {
    caseId: v.id("cases"),
    agentRunId: v.id("agentRuns"),
    errorMessage: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch("agentRuns", args.agentRunId, {
      status: "failed",
      outputRef: args.errorMessage.slice(0, 500),
    })
    return null
  },
})

export const promoteApprovedDocumentInternal = internalMutation({
  args: {
    caseId: v.id("cases"),
    documentId: v.id("documents"),
    reviewId: v.id("counselReviews"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
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

    await ctx.db.patch("counselReviews", args.reviewId, {
      reviewedAt: now,
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

    return null
  },
})
