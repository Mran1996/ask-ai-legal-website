import { customMutation, customQuery } from "convex-helpers/server/customFunctions"
import { mutation, query } from "../_generated/server"
import { getCurrentUser, requireCounselUser, type AuthUser } from "./auth"

export const authedQuery = customQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    return { ctx: { ...ctx, user }, args }
  },
})

export const authedMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    return { ctx: { ...ctx, user }, args }
  },
})

export const counselQuery = customQuery(authedQuery, {
  args: {},
  input: async (ctx, args) => {
    const counsel = await requireCounselUser(ctx)
    return {
      ctx: { ...ctx, user: counsel satisfies AuthUser },
      args,
    }
  },
})

export const counselMutation = customMutation(authedMutation, {
  args: {},
  input: async (ctx, args) => {
    const counsel = await requireCounselUser(ctx)
    return {
      ctx: { ...ctx, user: counsel satisfies AuthUser },
      args,
    }
  },
})
