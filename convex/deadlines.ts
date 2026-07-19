import { v } from "convex/values"
import { internalMutation, mutation, query } from "./_generated/server"
import type { MutationCtx } from "./_generated/server"
import type { Id } from "./_generated/dataModel"
import { assertOpsToken } from "./lib/opsAuth"
import { deadlineKindValidator } from "./lib/validators"
import { resolveCaseReference } from "./lib/caseLookup"
import { notifyOps } from "./notify"

const DAY_MS = 24 * 60 * 60 * 1000
const REMINDER_WINDOWS_DAYS = [7, 3, 1]

/** Keep cases.nextDeadlineAt in sync with the earliest open deadline. */
async function recomputeNextDeadline(
  ctx: MutationCtx,
  caseId: Id<"cases">
): Promise<void> {
  const rows = await ctx.db
    .query("deadlines")
    .withIndex("by_case", (q) => q.eq("caseId", caseId))
    .collect()
  const open = rows.filter((row) => row.completedAt === undefined)
  const next = open.length ? Math.min(...open.map((row) => row.dueAt)) : undefined
  await ctx.db.patch("cases", caseId, {
    nextDeadlineAt: next,
    lastActivityAt: Date.now(),
    updatedAt: Date.now(),
  })
}

export const addDeadline = mutation({
  args: {
    opsToken: v.string(),
    caseId: v.id("cases"),
    label: v.string(),
    dueAt: v.number(),
    kind: deadlineKindValidator,
    notes: v.optional(v.string()),
  },
  returns: v.id("deadlines"),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) throw new Error("Case not found")
    const label = args.label.trim()
    if (!label) throw new Error("Deadline label is required")

    const deadlineId = await ctx.db.insert("deadlines", {
      caseId: args.caseId,
      label,
      dueAt: args.dueAt,
      kind: args.kind,
      notes: args.notes?.trim() || undefined,
      createdAt: Date.now(),
    })
    await recomputeNextDeadline(ctx, args.caseId)
    return deadlineId
  },
})

export const completeDeadline = mutation({
  args: {
    opsToken: v.string(),
    deadlineId: v.id("deadlines"),
    completed: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const row = await ctx.db.get("deadlines", args.deadlineId)
    if (!row) throw new Error("Deadline not found")
    await ctx.db.patch("deadlines", args.deadlineId, {
      completedAt: args.completed ? Date.now() : undefined,
    })
    await recomputeNextDeadline(ctx, row.caseId)
    return null
  },
})

export const deleteDeadline = mutation({
  args: {
    opsToken: v.string(),
    deadlineId: v.id("deadlines"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const row = await ctx.db.get("deadlines", args.deadlineId)
    if (!row) throw new Error("Deadline not found")
    await ctx.db.delete("deadlines", args.deadlineId)
    await recomputeNextDeadline(ctx, row.caseId)
    return null
  },
})

const deadlineItemValidator = v.object({
  deadlineId: v.id("deadlines"),
  label: v.string(),
  dueAt: v.number(),
  kind: deadlineKindValidator,
  completedAt: v.optional(v.number()),
  notes: v.optional(v.string()),
})

export const listForCase = query({
  args: { opsToken: v.string(), caseId: v.id("cases") },
  returns: v.array(deadlineItemValidator),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const rows = await ctx.db
      .query("deadlines")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect()
    return rows
      .sort((a, b) => a.dueAt - b.dueAt)
      .map((row) => ({
        deadlineId: row._id,
        label: row.label,
        dueAt: row.dueAt,
        kind: row.kind,
        completedAt: row.completedAt,
        notes: row.notes,
      }))
  },
})

/**
 * Daily cron: remind the operator about open deadlines 7 / 3 / 1 days out
 * (and anything overdue, once). lastReminderDays prevents repeats per window.
 */
export const sendDueReminders = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const now = Date.now()
    const horizon = now + 7 * DAY_MS
    const candidates = await ctx.db
      .query("deadlines")
      .withIndex("by_dueAt", (q) => q.lte("dueAt", horizon))
      .collect()

    let sent = 0
    for (const row of candidates) {
      if (row.completedAt !== undefined) continue

      const daysLeft = Math.ceil((row.dueAt - now) / DAY_MS)
      const window =
        daysLeft <= 0 ? 0 : REMINDER_WINDOWS_DAYS.find((d) => daysLeft <= d)
      if (window === undefined) continue
      if (row.lastReminderDays !== undefined && row.lastReminderDays <= window) continue

      const caseDoc = await ctx.db.get("cases", row.caseId)
      if (!caseDoc || caseDoc.status === "closed") continue

      const due = new Date(row.dueAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      const urgency =
        window === 0
          ? "is OVERDUE"
          : window === 1
            ? "is due TOMORROW"
            : `is due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`

      await notifyOps(ctx, {
        caseId: row.caseId,
        type: "deadline_reminder",
        title: `Deadline ${window === 0 ? "overdue" : "approaching"} — ${resolveCaseReference(caseDoc)}`,
        body: `${row.kind.replace(/_/g, " ")} deadline "${row.label}" ${urgency} (${due}).`,
      })

      await ctx.db.patch("deadlines", row._id, { lastReminderDays: window })
      sent += 1
    }
    return sent
  },
})
