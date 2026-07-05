import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalMutation } from "./_generated/server"
import { notificationStatusValidator, notificationTypeValidator } from "./lib/validators"

/** Defer email action so intake mutations return before Resend runs (helps local 1s limit). */
export const enqueueIntakeEmails = internalMutation({
  args: {
    caseId: v.id("cases"),
    caseReference: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.scheduler.runAfter(500, internal.emailActions.sendIntakeEmails, {
      caseId: args.caseId,
      caseReference: args.caseReference,
    })
    return null
  },
})

export const recordNotification = internalMutation({
  args: {
    caseId: v.id("cases"),
    type: notificationTypeValidator,
    recipient: v.string(),
    status: notificationStatusValidator,
    provider: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  returns: v.id("notifications"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      caseId: args.caseId,
      type: args.type,
      recipient: args.recipient,
      status: args.status,
      provider: args.provider,
      errorMessage: args.errorMessage,
      createdAt: Date.now(),
    })
  },
})
