import { v } from "convex/values"
import { mutation } from "./_generated/server"

/** Event names the site is allowed to record — counts/topics only, never document text. */
const ALLOWED_EVENT_NAMES = new Set([
  "page_view",
  "cta_click",
  "chat_open",
  "chat_message",
  "quote_requested",
  "faq_open",
  "case_type_selected",
  "language_selected",
])

const MAX_FIELD_LENGTH = 200

function clip(value: string | undefined): string | undefined {
  if (value === undefined) return undefined
  const trimmed = value.trim()
  if (trimmed.length === 0) return undefined
  return trimmed.slice(0, MAX_FIELD_LENGTH)
}

/**
 * Public analytics event. Insights aggregates these into counts — keep `meta`
 * to short labels (CTA id, topic, language); reject anything else client-side.
 */
export const track = mutation({
  args: {
    name: v.string(),
    path: v.optional(v.string()),
    referrer: v.optional(v.string()),
    device: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    meta: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (!ALLOWED_EVENT_NAMES.has(args.name)) return null

    await ctx.db.insert("events", {
      name: args.name,
      path: clip(args.path),
      referrer: clip(args.referrer),
      device: clip(args.device),
      sessionId: clip(args.sessionId),
      meta: clip(args.meta),
      createdAt: Date.now(),
    })
    return null
  },
})
