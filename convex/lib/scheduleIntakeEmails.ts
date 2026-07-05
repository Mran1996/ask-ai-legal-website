import type { Id } from "../_generated/dataModel"
import type { MutationCtx } from "../_generated/server"
import { internal } from "../_generated/api"
import { formatCaseReference } from "./intakeMapping"

export async function scheduleIntakeEmailsIfNeeded(
  ctx: MutationCtx,
  caseId: Id<"cases">
): Promise<void> {
  const existing = await ctx.db
    .query("notifications")
    .withIndex("by_case", (q) => q.eq("caseId", caseId))
    .first()

  if (existing) {
    return
  }

  await ctx.scheduler.runAfter(0, internal.notifications.enqueueIntakeEmails, {
    caseId,
    caseReference: formatCaseReference(caseId),
  })
}
