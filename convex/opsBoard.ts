import { v } from "convex/values"
import { query } from "./_generated/server"
import { assertOpsToken } from "./lib/opsAuth"
import { casePriorityValidator, caseStatusValidator } from "./lib/validators"
import { resolveCaseReference } from "./lib/caseLookup"

const boardCardValidator = v.object({
  caseId: v.id("cases"),
  caseReference: v.string(),
  status: caseStatusValidator,
  clientName: v.string(),
  clientEmail: v.string(),
  issueSummary: v.optional(v.string()),
  priority: v.optional(casePriorityValidator),
  nextDeadlineAt: v.optional(v.number()),
  paidAt: v.optional(v.number()),
  lastActivityAt: v.optional(v.number()),
  createdAt: v.number(),
})

/**
 * Pillar 8: click a name → everything, live. Reactive query feeding the
 * pipeline board; search matches name, email, or case reference.
 */
export const pipelineBoard = query({
  args: {
    opsToken: v.string(),
    search: v.optional(v.string()),
  },
  returns: v.array(boardCardValidator),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)

    const cases = await ctx.db
      .query("cases")
      .withIndex("by_createdAt")
      .order("desc")
      .take(300)

    const needle = args.search?.trim().toLowerCase()
    const cards = []
    for (const caseDoc of cases) {
      const client = await ctx.db.get("clients", caseDoc.clientId)
      if (!client) continue

      const clientName = `${client.firstName} ${client.lastName}`.trim()
      const reference = resolveCaseReference(caseDoc)
      if (needle) {
        const haystack =
          `${clientName} ${client.email} ${reference}`.toLowerCase()
        if (!haystack.includes(needle)) continue
      }

      cards.push({
        caseId: caseDoc._id,
        caseReference: reference,
        status: caseDoc.status,
        clientName,
        clientEmail: client.email,
        issueSummary: caseDoc.intakeStructured.issueSummary,
        priority: caseDoc.priority,
        nextDeadlineAt: caseDoc.nextDeadlineAt,
        paidAt: caseDoc.paidAt,
        lastActivityAt: caseDoc.lastActivityAt,
        createdAt: caseDoc.createdAt,
      })
    }
    return cards
  },
})

const timelineEventValidator = v.object({
  at: v.number(),
  kind: v.string(),
  label: v.string(),
  detail: v.optional(v.string()),
})

/** Live case timeline: agent runs + notifications + payments + deadlines. */
export const caseTimeline = query({
  args: { opsToken: v.string(), caseId: v.id("cases") },
  returns: v.array(timelineEventValidator),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (!caseDoc) return []

    const events: Array<{ at: number; kind: string; label: string; detail?: string }> = [
      { at: caseDoc.createdAt, kind: "case", label: "Case created (intake received)" },
    ]

    const agentRuns = await ctx.db
      .query("agentRuns")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect()
    for (const run of agentRuns) {
      events.push({
        at: run.createdAt,
        kind: "agent",
        label: `Agent: ${run.agentType.replace(/_/g, " ")} (${run.status})`,
        detail: run.summary?.slice(0, 160) ?? run.outputRef.slice(0, 160),
      })
    }

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect()
    for (const n of notifications) {
      if (n.channel === "in_app") continue // bell items duplicate the source events
      events.push({
        at: n.createdAt,
        kind: n.status === "failed" ? "error" : "notification",
        label: `${n.channel ?? "email"} → ${n.recipient}: ${n.type.replace(/_/g, " ")} (${n.status})`,
        detail: n.errorMessage,
      })
    }

    const payments = await ctx.db
      .query("payments")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect()
    for (const p of payments) {
      events.push({
        at: p.createdAt,
        kind: "payment",
        label: `Payment ${p.status}: $${(p.amountCents / 100).toFixed(2)} (${p.type.replace(/_/g, " ")})`,
      })
    }

    const deadlines = await ctx.db
      .query("deadlines")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect()
    for (const d of deadlines) {
      events.push({
        at: d.createdAt,
        kind: "deadline",
        label: `Deadline added: ${d.label} (due ${new Date(d.dueAt).toLocaleDateString()})`,
        detail: d.completedAt ? "completed" : undefined,
      })
    }

    const reviews = await ctx.db
      .query("counselReviews")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect()
    for (const r of reviews) {
      events.push({
        at: r.reviewedAt ?? 0,
        kind: "review",
        label: `Human review: ${r.decision.replace(/_/g, " ")} by ${r.reviewerId}`,
        detail: r.notes?.slice(0, 160),
      })
    }

    return events.sort((a, b) => b.at - a.at).slice(0, 100)
  },
})
