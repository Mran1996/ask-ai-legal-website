import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalMutation, mutation, query } from "./_generated/server"
import type { MutationCtx } from "./_generated/server"
import type { Id } from "./_generated/dataModel"
import { assertOpsToken } from "./lib/opsAuth"
import { notificationTypeValidator } from "./lib/validators"
import { resolveCaseReference } from "./lib/caseLookup"

type OpsAlertType =
  | "payment_received"
  | "new_intake"
  | "deadline_reminder"
  | "draft_ready"
  | "doc_uploaded"
  | "review_needed"

/**
 * Central operator alert: writes the in-app bell row immediately and fans out
 * to email/SMS via notifyActions. Call from any mutation.
 */
export async function notifyOps(
  ctx: MutationCtx,
  args: {
    caseId: Id<"cases">
    type: OpsAlertType
    title: string
    body: string
  }
): Promise<void> {
  await ctx.db.insert("notifications", {
    caseId: args.caseId,
    type: args.type,
    recipient: "ops",
    status: "sent",
    channel: "in_app",
    title: args.title,
    body: args.body,
    createdAt: Date.now(),
  })

  await ctx.scheduler.runAfter(0, internal.notifyActions.fanOutOpsAlert, {
    caseId: args.caseId,
    type: args.type,
    title: args.title,
    body: args.body,
  })
}

export const createOpsAlert = internalMutation({
  args: {
    caseId: v.id("cases"),
    type: notificationTypeValidator,
    title: v.string(),
    body: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await notifyOps(ctx, {
      caseId: args.caseId,
      type: args.type as OpsAlertType,
      title: args.title,
      body: args.body,
    })
    return null
  },
})

/** Channel delivery audit rows written by the fan-out action. */
export const recordChannelResult = internalMutation({
  args: {
    caseId: v.id("cases"),
    type: notificationTypeValidator,
    channel: v.union(v.literal("email"), v.literal("sms")),
    recipient: v.string(),
    ok: v.boolean(),
    provider: v.string(),
    errorMessage: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      caseId: args.caseId,
      type: args.type,
      recipient: args.recipient,
      status: args.ok ? "sent" : "failed",
      provider: args.provider,
      errorMessage: args.errorMessage,
      channel: args.channel,
      createdAt: Date.now(),
    })
    return null
  },
})

const opsFeedItemValidator = v.object({
  notificationId: v.id("notifications"),
  caseId: v.id("cases"),
  caseReference: v.string(),
  type: notificationTypeValidator,
  title: v.string(),
  body: v.string(),
  readAt: v.optional(v.number()),
  createdAt: v.number(),
})

export const listOpsFeed = query({
  args: { opsToken: v.string() },
  returns: v.array(opsFeedItemValidator),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const rows = await ctx.db
      .query("notifications")
      .withIndex("by_channel", (q) => q.eq("channel", "in_app"))
      .order("desc")
      .take(40)

    const items = []
    for (const row of rows) {
      const caseDoc = await ctx.db.get("cases", row.caseId)
      items.push({
        notificationId: row._id,
        caseId: row.caseId,
        caseReference: caseDoc ? resolveCaseReference(caseDoc) : "(deleted case)",
        type: row.type,
        title: row.title ?? row.type.replace(/_/g, " "),
        body: row.body ?? "",
        readAt: row.readAt,
        createdAt: row.createdAt,
      })
    }
    return items
  },
})

export const unreadOpsCount = query({
  args: { opsToken: v.string() },
  returns: v.number(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const rows = await ctx.db
      .query("notifications")
      .withIndex("by_channel", (q) => q.eq("channel", "in_app"))
      .order("desc")
      .take(100)
    return rows.filter((row) => row.readAt === undefined).length
  },
})

export const markAllOpsRead = mutation({
  args: { opsToken: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const rows = await ctx.db
      .query("notifications")
      .withIndex("by_channel", (q) => q.eq("channel", "in_app"))
      .order("desc")
      .take(100)
    const now = Date.now()
    for (const row of rows) {
      if (row.readAt === undefined) {
        await ctx.db.patch("notifications", row._id, { readAt: now })
      }
    }
    return null
  },
})
