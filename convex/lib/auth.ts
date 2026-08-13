import type { MutationCtx, QueryCtx } from "../_generated/server"

export type AuthUser = {
  tokenIdentifier: string
  subject: string
  email: string | undefined
}

export async function getCurrentUser(ctx: QueryCtx | MutationCtx): Promise<AuthUser> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    throw new Error("Not authenticated")
  }

  return {
    tokenIdentifier: identity.tokenIdentifier,
    subject: identity.subject,
    email: identity.email,
  }
}

function counselEmailAllowlist(): Set<string> {
  const raw = process.env.COUNSEL_EMAILS ?? ""
  return new Set(
    raw
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean)
  )
}

/** Phase 1.7: replace allowlist with staffMembers table lookup. */
export async function requireCounselUser(ctx: QueryCtx | MutationCtx): Promise<AuthUser> {
  const user = await getCurrentUser(ctx)
  const allowlist = counselEmailAllowlist()

  if (allowlist.size === 0) {
    throw new Error(
      "Counsel access is not configured (set COUNSEL_EMAILS in Convex env)"
    )
  }

  const email = user.email?.trim().toLowerCase()
  if (!email || !allowlist.has(email)) {
    throw new Error("Unauthorized: counsel access required")
  }

  return user
}
