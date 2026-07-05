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

/** Phase 1.7: replace allowlist with staffMembers table lookup. */
export async function requireCounselUser(ctx: QueryCtx | MutationCtx): Promise<AuthUser> {
  const user = await getCurrentUser(ctx)
  // Stub: authenticated users pass until Clerk + staff roles ship in Phase 1.7.
  return user
}
