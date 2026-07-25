import { v } from "convex/values"
import { query } from "./_generated/server"
import { assertOpsToken } from "./lib/opsAuth"

const DAY_MS = 24 * 60 * 60 * 1000

const countRowValidator = v.object({ label: v.string(), count: v.number() })

function topCounts(map: Map<string, number>, limit: number) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

function bump(map: Map<string, number>, key: string | undefined) {
  if (!key) return
  map.set(key, (map.get(key) ?? 0) + 1)
}

/**
 * Site + business intelligence for the ops Insights panel. Aggregate counts and
 * topics only — no client document text ever leaves the matter file.
 */
export const summary = query({
  args: {
    opsToken: v.string(),
    days: v.optional(v.number()),
  },
  returns: v.object({
    windowDays: v.number(),
    traffic: v.object({
      pageViews: v.number(),
      uniqueSessions: v.number(),
      viewsByDay: v.array(v.object({ day: v.string(), count: v.number() })),
      topPaths: v.array(countRowValidator),
      topReferrers: v.array(countRowValidator),
      devices: v.array(countRowValidator),
    }),
    clicks: v.array(countRowValidator),
    research: v.object({
      caseTypes: v.array(countRowValidator),
      languages: v.array(countRowValidator),
      chatOpens: v.number(),
      chatMessages: v.number(),
    }),
    funnel: v.array(v.object({ stage: v.string(), count: v.number() })),
    money: v.object({
      paidLast7DaysCents: v.number(),
      paidWindowCents: v.number(),
      paidWindowCount: v.number(),
      unpaidContracts: v.number(),
      avgTimeToPayHours: v.union(v.number(), v.null()),
    }),
    opsHealth: v.object({
      casesByStatus: v.array(countRowValidator),
      draftsAwaitingApproval: v.number(),
      gapQuestionsUnanswered: v.number(),
      formsOutstanding: v.number(),
      deliveredWindow: v.number(),
    }),
  }),
  handler: async (ctx, args) => {
    assertOpsToken(args.opsToken)

    const windowDays = Math.min(Math.max(args.days ?? 14, 1), 90)
    const now = Date.now()
    const cutoff = now - windowDays * DAY_MS

    const events = await ctx.db
      .query("events")
      .withIndex("by_createdAt", (q) => q.gte("createdAt", cutoff))
      .collect()

    const paths = new Map<string, number>()
    const referrers = new Map<string, number>()
    const devices = new Map<string, number>()
    const ctas = new Map<string, number>()
    const sessions = new Set<string>()
    const viewsPerDay = new Map<string, number>()
    let pageViews = 0
    let chatOpens = 0
    let chatMessages = 0

    for (const event of events) {
      if (event.sessionId) sessions.add(event.sessionId)
      if (event.name === "page_view") {
        pageViews += 1
        bump(paths, event.path)
        bump(referrers, event.referrer)
        bump(devices, event.device)
        const day = new Date(event.createdAt).toISOString().slice(0, 10)
        viewsPerDay.set(day, (viewsPerDay.get(day) ?? 0) + 1)
      } else if (event.name === "cta_click") {
        bump(ctas, event.meta)
      } else if (event.name === "chat_open") {
        chatOpens += 1
      } else if (event.name === "chat_message") {
        chatMessages += 1
      }
    }

    const viewsByDay: Array<{ day: string; count: number }> = []
    for (let i = windowDays - 1; i >= 0; i -= 1) {
      const day = new Date(now - i * DAY_MS).toISOString().slice(0, 10)
      viewsByDay.push({ day, count: viewsPerDay.get(day) ?? 0 })
    }

    const cases = await ctx.db.query("cases").collect()

    const caseTypes = new Map<string, number>()
    const languages = new Map<string, number>()
    const statusCounts = new Map<string, number>()
    let intakesWindow = 0
    let formsReturnedWindow = 0
    let paidWindowCount = 0
    let paidWindowCents = 0
    let paidLast7DaysCents = 0
    let deliveredWindow = 0
    let unpaidContracts = 0
    let draftsAwaitingApproval = 0
    let gapQuestionsUnanswered = 0
    let formsOutstanding = 0
    const timesToPayMs: number[] = []

    for (const caseDoc of cases) {
      bump(statusCounts, caseDoc.status.replace(/_/g, " "))
      bump(caseTypes, caseDoc.intakeStructured.caseTypeLabel ?? caseDoc.matterType)
      bump(languages, caseDoc.intakeStructured.preferredLanguage)

      if (caseDoc.createdAt >= cutoff) intakesWindow += 1
      if (caseDoc.formReturnedAt !== undefined && caseDoc.formReturnedAt >= cutoff) {
        formsReturnedWindow += 1
      }
      if (
        caseDoc.personalizedFormSentAt !== undefined &&
        caseDoc.formReturnedAt === undefined
      ) {
        formsOutstanding += 1
      }
      if (caseDoc.draftPackageStatus === "awaiting_ops_approval") {
        draftsAwaitingApproval += 1
      }
      if (
        caseDoc.gapQuestionsSentAt !== undefined &&
        caseDoc.gapQuestionsAnsweredAt === undefined
      ) {
        gapQuestionsUnanswered += 1
      }
      if (
        caseDoc.contractInvoiceSentAt !== undefined &&
        caseDoc.paidAt === undefined
      ) {
        unpaidContracts += 1
      }
      if (caseDoc.paidAt !== undefined) {
        const amount = caseDoc.quotedStartAmountCents ?? 49999
        if (caseDoc.paidAt >= cutoff) {
          paidWindowCount += 1
          paidWindowCents += amount
        }
        if (caseDoc.paidAt >= now - 7 * DAY_MS) {
          paidLast7DaysCents += amount
        }
        if (caseDoc.contractInvoiceSentAt !== undefined) {
          timesToPayMs.push(caseDoc.paidAt - caseDoc.contractInvoiceSentAt)
        }
      }
      if (caseDoc.status === "delivered" && caseDoc.updatedAt >= cutoff) {
        deliveredWindow += 1
      }
    }

    const avgTimeToPayHours =
      timesToPayMs.length > 0
        ? Math.round(
            (timesToPayMs.reduce((sum, ms) => sum + ms, 0) /
              timesToPayMs.length /
              (60 * 60 * 1000)) *
              10
          ) / 10
        : null

    const funnel = [
      { stage: "Site visits", count: sessions.size },
      { stage: "Chat opened", count: chatOpens },
      { stage: "Intake submitted", count: intakesWindow },
      { stage: "Form returned", count: formsReturnedWindow },
      { stage: "Paid", count: paidWindowCount },
      { stage: "Delivered", count: deliveredWindow },
    ]

    return {
      windowDays,
      traffic: {
        pageViews,
        uniqueSessions: sessions.size,
        viewsByDay,
        topPaths: topCounts(paths, 8),
        topReferrers: topCounts(referrers, 6),
        devices: topCounts(devices, 4),
      },
      clicks: topCounts(ctas, 10),
      research: {
        caseTypes: topCounts(caseTypes, 8),
        languages: topCounts(languages, 6),
        chatOpens,
        chatMessages,
      },
      funnel,
      money: {
        paidLast7DaysCents,
        paidWindowCents,
        paidWindowCount,
        unpaidContracts,
        avgTimeToPayHours,
      },
      opsHealth: {
        casesByStatus: topCounts(statusCounts, 10),
        draftsAwaitingApproval,
        gapQuestionsUnanswered,
        formsOutstanding,
        deliveredWindow,
      },
    }
  },
})
