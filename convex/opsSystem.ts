import { v } from "convex/values"
import { query } from "./_generated/server"
import { assertOpsToken } from "./lib/opsAuth"

const serviceStatusValidator = v.object({
  id: v.string(),
  label: v.string(),
  ok: v.boolean(),
  detail: v.string(),
})

/**
 * Ops-facing readiness of automation integrations.
 * Reports presence of env vars only — never returns secret values.
 */
export const getOpsSystemStatus = query({
  args: { opsToken: v.string() },
  returns: v.object({
    services: v.array(serviceStatusValidator),
    allCriticalOk: v.boolean(),
  }),
  handler: async (_ctx, args) => {
    assertOpsToken(args.opsToken)

    const has = (name: string) => Boolean(process.env[name]?.trim())

    const resendOk = has("RESEND_API_KEY")
    const stripeOk = has("STRIPE_SECRET_KEY")
    const outlookOk =
      has("MICROSOFT_GRAPH_TENANT_ID") &&
      has("MICROSOFT_GRAPH_CLIENT_ID") &&
      has("MICROSOFT_GRAPH_CLIENT_SECRET") &&
      has("MICROSOFT_GRAPH_MAILBOX")
    const llmOk = has("OPENAI_API_KEY")
    const notifyOk = has("OPS_NOTIFY_EMAIL")
    const inboundOk = has("RESEND_INBOUND_WEBHOOK_SECRET")

    const services = [
      {
        id: "email",
        label: "Email (Resend)",
        ok: resendOk,
        detail: resendOk
          ? has("RESEND_FROM_EMAIL")
            ? "API key + from address set — outbound emails can send"
            : "API key set; set RESEND_FROM_EMAIL for branding"
          : "Missing RESEND_API_KEY — no customer emails will send",
      },
      {
        id: "inbound",
        label: "Inbound email",
        ok: inboundOk,
        detail: inboundOk
          ? "Webhook secret set — Resend inbound can mark form returns"
          : "Missing RESEND_INBOUND_WEBHOOK_SECRET — use ops “Form returned + ack” until wired",
      },
      {
        id: "notify",
        label: "Ops notify",
        ok: notifyOk,
        detail: notifyOk
          ? "OPS_NOTIFY_EMAIL set — LLM drafts / alerts go to ops inbox"
          : "Missing OPS_NOTIFY_EMAIL — drafts may only hit support default",
      },
      {
        id: "stripe",
        label: "Stripe",
        ok: stripeOk,
        detail: stripeOk
          ? has("STRIPE_WEBHOOK_SECRET")
            ? "Secret + webhook set — pay links + auto mark-paid"
            : "Secret set; add STRIPE_WEBHOOK_SECRET for auto mark-paid"
          : "Missing STRIPE_SECRET_KEY — cannot generate pay links",
      },
      {
        id: "outlook",
        label: "Outlook (Graph)",
        ok: outlookOk,
        detail: outlookOk
          ? "Graph credentials set — paid folders create in mailbox"
          : "Graph not configured — paid creates stub path only (see OUTLOOK_CLIENT_FILING.md)",
      },
      {
        id: "llm",
        label: "LLM draft",
        ok: llmOk,
        detail: llmOk
          ? `OpenAI set (${process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini"})`
          : "Missing OPENAI_API_KEY — issues draft uses template fallback",
      },
    ]

    const criticalIds = new Set(["email", "stripe"])
    const allCriticalOk = services
      .filter((s) => criticalIds.has(s.id))
      .every((s) => s.ok)

    return { services, allCriticalOk }
  },
})
