import type { Doc, Id } from "../_generated/dataModel"
import type { QueryCtx, MutationCtx } from "../_generated/server"
import { formatCaseReference } from "./intakeMapping"

type DbCtx = QueryCtx | MutationCtx

export function resolveCaseReference(caseDoc: Doc<"cases">): string {
  return caseDoc.caseReference ?? formatCaseReference(caseDoc._id)
}

export async function findCaseByReference(
  ctx: DbCtx,
  caseReference: string
): Promise<Doc<"cases"> | null> {
  const normalized = caseReference.trim().toUpperCase()
  if (!normalized) return null

  const byIndex = await ctx.db
    .query("cases")
    .withIndex("by_caseReference", (q) => q.eq("caseReference", normalized))
    .unique()

  if (byIndex) return byIndex

  const recent = await ctx.db.query("cases").withIndex("by_createdAt").order("desc").take(500)

  for (const caseDoc of recent) {
    if (resolveCaseReference(caseDoc) === normalized) {
      return caseDoc
    }
  }

  return null
}

export async function findCaseByIdOrReference(
  ctx: DbCtx,
  args: { caseId?: Id<"cases">; caseReference?: string }
): Promise<Doc<"cases"> | null> {
  if (args.caseId) {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    if (caseDoc) return caseDoc
  }

  if (args.caseReference) {
    return await findCaseByReference(ctx, args.caseReference)
  }

  return null
}
