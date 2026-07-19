import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalMutation, mutation, query } from "./_generated/server"
import { assertOpsToken } from "./lib/opsAuth"
import { counselDecisionValidator } from "./lib/validators"
import { postToCaseChat } from "./caseChat"

const MAX_CONTENT_LENGTH = 400_000

export const AI_DISCLAIMER =
  "Prepared by Ask AI Legal, a document-preparation service — not a law firm and not legal advice. Reviewed and approved by a human before delivery."

/** Drafting agent output: creates the editable document + version 1. */
export const createDraftWithVersion = internalMutation({
  args: {
    caseId: v.id("cases"),
    fileName: v.string(),
    storageId: v.string(),
    content: v.string(),
    editedBy: v.string(),
    changeNote: v.optional(v.string()),
  },
  returns: v.id("documents"),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) throw new Error("Case not found")

    const drafts = await ctx.db
      .query("documents")
      .withIndex("by_case_and_folder", (q) =>
        q.eq("caseId", args.caseId).eq("folder", "drafts")
      )
      .collect()

    const documentId = await ctx.db.insert("documents", {
      caseId: args.caseId,
      type: "drafted_by_us",
      folder: "drafts",
      fileName: args.fileName,
      storageId: args.storageId,
      status: "processing",
      version: drafts.length + 1,
      createdAt: Date.now(),
    })

    await ctx.db.insert("documentVersions", {
      documentId,
      caseId: args.caseId,
      version: 1,
      content: args.content.slice(0, MAX_CONTENT_LENGTH),
      editedBy: args.editedBy,
      changeNote: args.changeNote,
      createdAt: Date.now(),
    })

    await ctx.db.patch("cases", args.caseId, {
      lastActivityAt: Date.now(),
      updatedAt: Date.now(),
    })

    return documentId
  },
})

/** Editor save: appends a new version (never overwrites history). */
export const saveVersion = mutation({
  args: {
    opsToken: v.string(),
    documentId: v.id("documents"),
    content: v.string(),
    changeNote: v.optional(v.string()),
  },
  returns: v.number(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const doc = await ctx.db.get("documents", args.documentId)
    if (!doc) throw new Error("Document not found")

    const versions = await ctx.db
      .query("documentVersions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect()
    const nextVersion = versions.length
      ? Math.max(...versions.map((row) => row.version)) + 1
      : 1

    await ctx.db.insert("documentVersions", {
      documentId: args.documentId,
      caseId: doc.caseId,
      version: nextVersion,
      content: args.content.slice(0, MAX_CONTENT_LENGTH),
      editedBy: "ops",
      changeNote: args.changeNote?.trim() || undefined,
      createdAt: Date.now(),
    })

    await ctx.db.patch("cases", doc.caseId, {
      lastActivityAt: Date.now(),
      updatedAt: Date.now(),
    })

    return nextVersion
  },
})

const workspaceDocValidator = v.object({
  documentId: v.id("documents"),
  fileName: v.string(),
  folder: v.string(),
  status: v.string(),
  latestVersion: v.number(),
  latestContent: v.string(),
  lastEditedBy: v.string(),
  lastEditedAt: v.number(),
  reviewDecision: v.union(counselDecisionValidator, v.null()),
  reviewNotes: v.optional(v.string()),
})

/** Workspace tab: every editable draft with its latest version + review state. */
export const getWorkspaceForCase = query({
  args: { opsToken: v.string(), caseId: v.id("cases") },
  returns: v.array(workspaceDocValidator),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)

    const versionRows = await ctx.db
      .query("documentVersions")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect()

    const byDocument = new Map<string, typeof versionRows>()
    for (const row of versionRows) {
      const list = byDocument.get(row.documentId) ?? []
      list.push(row)
      byDocument.set(row.documentId, list)
    }

    const result = []
    for (const [documentId, rows] of byDocument) {
      const doc = await ctx.db.get(
        "documents",
        documentId as (typeof versionRows)[number]["documentId"]
      )
      if (!doc) continue
      const latest = rows.sort((a, b) => b.version - a.version)[0]!

      const reviews = await ctx.db
        .query("counselReviews")
        .withIndex("by_document", (q) => q.eq("documentId", doc._id))
        .collect()
      const latestReview = reviews.sort(
        (a, b) => (b.reviewedAt ?? 0) - (a.reviewedAt ?? 0)
      )[0]

      result.push({
        documentId: doc._id,
        fileName: doc.fileName,
        folder: doc.folder as string,
        status: doc.status as string,
        latestVersion: latest.version,
        latestContent: latest.content,
        lastEditedBy: latest.editedBy,
        lastEditedAt: latest.createdAt,
        reviewDecision: latestReview?.decision ?? null,
        reviewNotes: latestReview?.notes,
      })
    }

    return result.sort((a, b) => b.lastEditedAt - a.lastEditedAt)
  },
})

const versionMetaValidator = v.object({
  version: v.number(),
  editedBy: v.string(),
  changeNote: v.optional(v.string()),
  createdAt: v.number(),
})

export const listVersions = query({
  args: { opsToken: v.string(), documentId: v.id("documents") },
  returns: v.array(versionMetaValidator),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const rows = await ctx.db
      .query("documentVersions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect()
    return rows
      .sort((a, b) => b.version - a.version)
      .map((row) => ({
        version: row.version,
        editedBy: row.editedBy,
        changeNote: row.changeNote,
        createdAt: row.createdAt,
      }))
  },
})

/**
 * COUNSEL GATE — the human approval that unlocks delivery. This is the only
 * path that produces a client deliverable, and it always records a
 * counselReviews row first. Never remove this gate.
 */
export const approveAndDeliver = mutation({
  args: {
    opsToken: v.string(),
    caseId: v.id("cases"),
    documentId: v.id("documents"),
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) throw new Error("Case not found")
    const doc = await ctx.db.get("documents", args.documentId)
    if (!doc || doc.caseId !== args.caseId) throw new Error("Document not found")

    // Money before work: no delivery on unpaid cases.
    if (caseDoc.paidAt === undefined) {
      const payments = await ctx.db
        .query("payments")
        .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
        .collect()
      if (!payments.some((p) => p.status === "paid")) {
        throw new Error("Cannot deliver before payment is recorded")
      }
    }

    const versions = await ctx.db
      .query("documentVersions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect()
    const latest = versions.sort((a, b) => b.version - a.version)[0]
    if (!latest) throw new Error("No draft content to deliver")

    await ctx.db.insert("counselReviews", {
      caseId: args.caseId,
      documentId: args.documentId,
      reviewerId: "ops",
      decision: "approved",
      notes: args.notes?.trim() || undefined,
      reviewedAt: Date.now(),
    })
    await ctx.db.patch("documents", args.documentId, { status: "reviewed" })

    await postToCaseChat(ctx, {
      caseId: args.caseId,
      authorType: "staff",
      authorId: "ops",
      body: `✅ Human review complete — approved v${latest.version} of "${doc.fileName}" for delivery.${
        args.notes?.trim() ? `\n\nNotes: ${args.notes.trim()}` : ""
      }`,
    })

    await ctx.scheduler.runAfter(0, internal.deliveryActions.deliverApprovedDocument, {
      caseId: args.caseId,
      documentId: args.documentId,
    })

    return null
  },
})

/** Counsel gate: rejection sends the draft back to editing, never to the client. */
export const rejectDraft = mutation({
  args: {
    opsToken: v.string(),
    caseId: v.id("cases"),
    documentId: v.id("documents"),
    notes: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const doc = await ctx.db.get("documents", args.documentId)
    if (!doc || doc.caseId !== args.caseId) throw new Error("Document not found")
    const notes = args.notes.trim()
    if (!notes) throw new Error("Rejection notes are required")

    await ctx.db.insert("counselReviews", {
      caseId: args.caseId,
      documentId: args.documentId,
      reviewerId: "ops",
      decision: "needs_edit",
      notes,
      reviewedAt: Date.now(),
    })

    await postToCaseChat(ctx, {
      caseId: args.caseId,
      authorType: "staff",
      authorId: "ops",
      body: `❌ Draft "${doc.fileName}" needs edits before delivery.\n\n${notes}`,
    })

    return null
  },
})

/**
 * Delivery finalizer (called by deliveryActions after re-verifying the gate).
 * Writes the final_delivered document, flips status, emails the client.
 */
export const finalizeDelivery = internalMutation({
  args: {
    caseId: v.id("cases"),
    documentId: v.id("documents"),
    finalStorageId: v.string(),
    finalFileName: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) throw new Error("Case not found")

    // Defense in depth: the human approval row must exist.
    const reviews = await ctx.db
      .query("counselReviews")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect()
    if (!reviews.some((r) => r.decision === "approved")) {
      throw new Error("Delivery blocked: no human approval recorded")
    }

    const finals = await ctx.db
      .query("documents")
      .withIndex("by_case_and_folder", (q) =>
        q.eq("caseId", args.caseId).eq("folder", "final_delivered")
      )
      .collect()

    await ctx.db.insert("documents", {
      caseId: args.caseId,
      type: "final_delivered",
      folder: "final_delivered",
      fileName: args.finalFileName,
      storageId: args.finalStorageId,
      status: "delivered",
      version: finals.length + 1,
      createdAt: Date.now(),
    })

    await ctx.db.patch("documents", args.documentId, { status: "delivered" })
    await ctx.db.patch("cases", args.caseId, {
      status: "delivered",
      lastActivityAt: Date.now(),
      updatedAt: Date.now(),
    })

    await ctx.db.insert("agentRuns", {
      caseId: args.caseId,
      agentType: "counsel",
      inputRef: `counsel_gate:${args.documentId}`,
      outputRef: "delivered",
      status: "completed",
      reviewedBy: "ops",
      createdAt: Date.now(),
    })

    await postToCaseChat(ctx, {
      caseId: args.caseId,
      authorType: "staff",
      authorId: "system",
      body: `📬 Final document "${args.finalFileName}" copied to final_delivered and emailed to the client.`,
    })

    await ctx.scheduler.runAfter(0, internal.emailActions.sendDeliveryEmail, {
      caseId: args.caseId,
    })

    return null
  },
})
