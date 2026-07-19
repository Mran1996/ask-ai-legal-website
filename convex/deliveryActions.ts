import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalAction } from "./_generated/server"
import { AI_DISCLAIMER } from "./documentVersions"

/**
 * Runs only after approveAndDeliver has recorded a human counsel approval.
 * Snapshots the approved version's content into storage as the immutable
 * final deliverable, then hands off to finalizeDelivery (which re-checks the
 * approval row before writing anything client-facing).
 */
export const deliverApprovedDocument = internalAction({
  args: {
    caseId: v.id("cases"),
    documentId: v.id("documents"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const snapshot = await ctx.runQuery(internal.councilData.getLatestVersionForDelivery, {
      documentId: args.documentId,
    })
    if (!snapshot) {
      console.error("deliverApprovedDocument: no version content", args.documentId)
      return null
    }

    const finalText = `${snapshot.content.trimEnd()}\n\n---\n${AI_DISCLAIMER}\n`
    const blob = new Blob([finalText], { type: "text/markdown" })
    const finalStorageId = await ctx.storage.store(blob)

    const baseName = snapshot.fileName.replace(/\.(md|txt|markdown)$/i, "")
    await ctx.runMutation(internal.documentVersions.finalizeDelivery, {
      caseId: args.caseId,
      documentId: args.documentId,
      finalStorageId,
      finalFileName: `${baseName} (final).md`,
    })

    return null
  },
})
