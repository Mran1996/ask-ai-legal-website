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
