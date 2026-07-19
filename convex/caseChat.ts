import { v } from "convex/values"
import { internalMutation, mutation, query } from "./_generated/server"
import type { MutationCtx } from "./_generated/server"
import type { Id } from "./_generated/dataModel"
import { assertOpsToken } from "./lib/opsAuth"
import { agentTypeValidator, chatAuthorTypeValidator } from "./lib/validators"

const MAX_MESSAGE_LENGTH = 20_000

const attachmentValidator = v.object({
  documentId: v.id("documents"),
  fileName: v.string(),
})

/** Shared insert used by staff mutations and council agents. */
export async function postToCaseChat(
  ctx: MutationCtx,
  args: {
    caseId: Id<"cases">
    authorType: "staff" | "ai_agent" | "client"
    authorId: string
    body: string
    agentType?:
      | "intake"
      | "pricing"
      | "document_understanding"
      | "legal_research"
      | "strategy"
      | "drafting"
      | "review_critique"
      | "counsel"
    attachments?: Array<{ documentId: Id<"documents">; fileName: string }>
  }
): Promise<Id<"caseChatMessages">> {
  const messageId = await ctx.db.insert("caseChatMessages", {
    caseId: args.caseId,
    authorType: args.authorType,
    authorId: args.authorId,
    body: args.body.slice(0, MAX_MESSAGE_LENGTH),
    agentType: args.agentType,
    attachments: args.attachments,
    createdAt: Date.now(),
  })
  await ctx.db.patch("cases", args.caseId, {
    lastActivityAt: Date.now(),
    updatedAt: Date.now(),
  })
  return messageId
}

export const postStaffMessage = mutation({
  args: {
    opsToken: v.string(),
    caseId: v.id("cases"),
    body: v.string(),
    attachments: v.optional(v.array(attachmentValidator)),
  },
  returns: v.id("caseChatMessages"),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) throw new Error("Case not found")
    const body = args.body.trim()
    if (!body) throw new Error("Message body is required")

    return await postToCaseChat(ctx, {
      caseId: args.caseId,
      authorType: "staff",
      authorId: "ops",
      body,
      attachments: args.attachments,
    })
  },
})

export const postAgentMessage = internalMutation({
  args: {
    caseId: v.id("cases"),
    agentType: agentTypeValidator,
    body: v.string(),
    attachments: v.optional(v.array(attachmentValidator)),
  },
  returns: v.id("caseChatMessages"),
  handler: async (ctx, args) => {
    return await postToCaseChat(ctx, {
      caseId: args.caseId,
      authorType: "ai_agent",
      authorId: `agent:${args.agentType}`,
      body: args.body,
      agentType: args.agentType,
      attachments: args.attachments,
    })
  },
})

const chatMessageValidator = v.object({
  messageId: v.id("caseChatMessages"),
  authorType: chatAuthorTypeValidator,
  authorId: v.string(),
  agentType: v.optional(agentTypeValidator),
  body: v.string(),
  attachments: v.optional(v.array(attachmentValidator)),
  createdAt: v.number(),
})

export const listForCase = query({
  args: { opsToken: v.string(), caseId: v.id("cases") },
  returns: v.array(chatMessageValidator),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const rows = await ctx.db
      .query("caseChatMessages")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .order("desc")
      .take(200)

    return rows.reverse().map((row) => ({
      messageId: row._id,
      authorType: row.authorType,
      authorId: row.authorId,
      agentType: row.agentType,
      body: row.body,
      attachments: row.attachments,
      createdAt: row.createdAt,
    }))
  },
})
