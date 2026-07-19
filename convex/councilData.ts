import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalMutation, internalQuery, mutation } from "./_generated/server"
import { assertOpsToken } from "./lib/opsAuth"
import {
  agentRunStatusValidator,
  agentTypeValidator,
  citationTypeValidator,
} from "./lib/validators"
import { resolveCaseReference } from "./lib/caseLookup"
import { postToCaseChat } from "./caseChat"
import { notifyOps } from "./notify"

/** Everything the council agents need about a case, in one read. */
export const getCouncilContext = internalQuery({
  args: { caseId: v.id("cases") },
  returns: v.union(
    v.object({
      caseReference: v.string(),
      clientName: v.string(),
      matterType: v.string(),
      state: v.string(),
      county: v.optional(v.string()),
      caseTypeLabel: v.optional(v.string()),
      issueSummary: v.optional(v.string()),
      role: v.optional(v.string()),
      opposingParty: v.optional(v.string()),
      deadline: v.optional(v.string()),
      knownDates: v.optional(v.string()),
      caseNumber: v.optional(v.string()),
      serviceNeeded: v.optional(v.string()),
      intakeRaw: v.string(),
      uploadedDocs: v.array(v.object({ fileName: v.string(), folder: v.string() })),
      verifiedCitations: v.array(
        v.object({
          citationId: v.id("citations"),
          type: citationTypeValidator,
          reference: v.string(),
          title: v.optional(v.string()),
          sourceUrl: v.string(),
          snippet: v.optional(v.string()),
        })
      ),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) return null
    const client = await ctx.db.get("clients", caseDoc.clientId)
    if (!client) return null

    const docs = await ctx.db
      .query("documents")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect()

    const citationRows = await ctx.db
      .query("citations")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect()

    const s = caseDoc.intakeStructured
    return {
      caseReference: resolveCaseReference(caseDoc),
      clientName: `${client.firstName} ${client.lastName}`.trim(),
      matterType: caseDoc.matterType,
      state: caseDoc.jurisdiction.state || s.clientStateInput || "unknown",
      county: caseDoc.jurisdiction.county ?? s.county,
      caseTypeLabel: s.caseTypeLabel,
      issueSummary: s.issueSummary,
      role: s.role,
      opposingParty: s.opposingParty,
      deadline: s.deadline,
      knownDates: s.knownDates,
      caseNumber: s.caseNumber,
      serviceNeeded: s.serviceNeeded,
      intakeRaw: caseDoc.intakeRaw,
      uploadedDocs: docs
        .filter((d) => d.folder === "intake" || d.folder === "uploaded_by_client")
        .map((d) => ({ fileName: d.fileName, folder: d.folder as string })),
      // Hard rule: agents only ever see citations already marked verified.
      verifiedCitations: citationRows
        .filter((row) => row.verified)
        .map((row) => ({
          citationId: row._id,
          type: row.type,
          reference: row.reference,
          title: row.title,
          sourceUrl: row.sourceUrl,
          snippet: row.snippet,
        })),
    }
  },
})

export const getLatestVersionForDelivery = internalQuery({
  args: { documentId: v.id("documents") },
  returns: v.union(
    v.object({ content: v.string(), fileName: v.string() }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const doc = await ctx.db.get("documents", args.documentId)
    if (!doc) return null
    const versions = await ctx.db
      .query("documentVersions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect()
    const latest = versions.sort((a, b) => b.version - a.version)[0]
    if (!latest) return null
    return { content: latest.content, fileName: doc.fileName }
  },
})

export const startAgentRun = internalMutation({
  args: {
    caseId: v.id("cases"),
    agentType: agentTypeValidator,
    inputRef: v.string(),
  },
  returns: v.id("agentRuns"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("agentRuns", {
      caseId: args.caseId,
      agentType: args.agentType,
      inputRef: args.inputRef,
      outputRef: "",
      status: "running",
      createdAt: Date.now(),
    })
  },
})

export const finishAgentRun = internalMutation({
  args: {
    agentRunId: v.id("agentRuns"),
    status: agentRunStatusValidator,
    outputRef: v.string(),
    summary: v.optional(v.string()),
    confidence: v.optional(v.number()),
    citationIds: v.optional(v.array(v.id("citations"))),
    errorMessage: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch("agentRuns", args.agentRunId, {
      status: args.status,
      outputRef: args.outputRef,
      summary: args.summary,
      confidence: args.confidence,
      citationIds: args.citationIds,
      errorMessage: args.errorMessage,
    })
    return null
  },
})

export const insertCitation = internalMutation({
  args: {
    caseId: v.id("cases"),
    agentRunId: v.id("agentRuns"),
    type: citationTypeValidator,
    reference: v.string(),
    title: v.optional(v.string()),
    sourceUrl: v.string(),
    verified: v.boolean(),
    snippet: v.optional(v.string()),
  },
  returns: v.id("citations"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("citations", {
      caseId: args.caseId,
      agentRunId: args.agentRunId,
      type: args.type,
      reference: args.reference,
      title: args.title,
      sourceUrl: args.sourceUrl,
      verified: args.verified,
      snippet: args.snippet,
      retrievedAt: Date.now(),
    })
  },
})

/** Council finished → case waits at the human review gate. */
export const markCouncilComplete = internalMutation({
  args: { caseId: v.id("cases"), draftFileName: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) return null
    if (caseDoc.status === "in_drafting") {
      await ctx.db.patch("cases", args.caseId, {
        status: "in_counsel_review",
        lastActivityAt: Date.now(),
        updatedAt: Date.now(),
      })
    }
    await notifyOps(ctx, {
      caseId: args.caseId,
      type: "review_needed",
      title: `Review needed — ${resolveCaseReference(caseDoc)}`,
      body: `The AI council finished drafting "${args.draftFileName}". Open the workspace to review, edit, and approve before anything reaches the client.`,
    })
    return null
  },
})

/** Ops button: run the AI council on a paid case. */
export const startCouncilForCase = mutation({
  args: { opsToken: v.string(), caseId: v.id("cases") },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) throw new Error("Case not found")

    // Money before work.
    if (caseDoc.paidAt === undefined) {
      const payments = await ctx.db
        .query("payments")
        .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
        .collect()
      if (!payments.some((p) => p.status === "paid")) {
        throw new Error("Council runs only on paid cases")
      }
    }

    if (caseDoc.status !== "in_drafting") {
      await ctx.db.patch("cases", args.caseId, {
        status: "in_drafting",
        lastActivityAt: Date.now(),
        updatedAt: Date.now(),
      })
    }

    await postToCaseChat(ctx, {
      caseId: args.caseId,
      authorType: "staff",
      authorId: "ops",
      body: "🏛️ AI council convened — intake review → document understanding → legal research → strategy → drafting → self-critique. Human review gate stays on.",
    })

    await ctx.scheduler.runAfter(0, internal.councilActions.runCouncil, {
      caseId: args.caseId,
    })

    return null
  },
})
