import { query } from "./_generated/server"
import { v } from "convex/values"

/** Schema smoke test — public ping for Convex connectivity. */
export const ping = query({
  args: {},
  returns: v.literal("ok"),
  handler: async (): Promise<"ok"> => {
    return "ok"
  },
})
