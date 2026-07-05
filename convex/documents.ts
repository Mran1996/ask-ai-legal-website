import { v } from "convex/values"
import { mutation } from "./_generated/server"

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
