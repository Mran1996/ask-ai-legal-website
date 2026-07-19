import { v } from "convex/values"
import { internalMutation, mutation } from "./_generated/server"
import { notifyOps } from "./notify"
import { resolveCaseReference } from "./lib/caseLookup"

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

    const documentId = await ctx.db.insert("documents", {
      caseId: args.caseId,
      type: "uploaded_by_client",
      folder: "intake",
      fileName,
      storageId: args.storageId,
      status: "received",
      version,
      createdAt: Date.now(),
    })

    await ctx.db.patch("cases", args.caseId, {
      lastActivityAt: Date.now(),
      updatedAt: Date.now(),
    })

    await notifyOps(ctx, {
      caseId: args.caseId,
      type: "doc_uploaded",
      title: `Document uploaded — ${resolveCaseReference(caseDoc)}`,
      body: `Client uploaded "${fileName}".`,
    })

    return documentId
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
