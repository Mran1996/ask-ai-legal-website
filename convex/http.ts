import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { internal } from "./_generated/api"
import { secureCompare } from "./lib/secureCompare"

const http = httpRouter()

function bearerMatchesSecret(authHeader: string | null, secret: string): boolean {
  if (!authHeader?.startsWith("Bearer ")) return false
  return secureCompare(authHeader.slice("Bearer ".length), secret)
}

function webhookAuthorized(request: Request): boolean {
  const secret = process.env.CALCOM_WEBHOOK_SECRET
  if (!secret) {
    console.error("CALCOM_WEBHOOK_SECRET not set — rejecting webhook")
    return false
  }

  const auth = request.headers.get("authorization")
  if (bearerMatchesSecret(auth, secret)) return true

  const headerSecret = request.headers.get("x-cal-webhook-secret")
  if (headerSecret && secureCompare(headerSecret, secret)) return true

  return false
}

http.route({
  path: "/calcom-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!webhookAuthorized(request)) {
      return new Response("Unauthorized", { status: 401 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return new Response("Invalid JSON", { status: 400 })
    }

    await ctx.runMutation(internal.appointments.handleCalcomWebhook, { body })

    return new Response(null, { status: 200 })
  }),
})

http.route({
  path: "/stripe-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("stripe-signature")
    if (!signature) {
      return new Response("Missing stripe-signature", { status: 400 })
    }

    const rawBody = await request.text()

    try {
      await ctx.runAction(internal.stripeActions.handleStripeWebhook, {
        rawBody,
        signature,
      })
    } catch (error) {
      console.error("Stripe webhook error", error)
      return new Response("Webhook error", { status: 400 })
    }

    return new Response(null, { status: 200 })
  }),
})

/**
 * Resend inbound / email receiving webhook.
 * Configure in Resend: Receiving → webhook URL =
 *   https://robust-wombat-16.convex.site/resend-inbound
 * Required: set RESEND_INBOUND_WEBHOOK_SECRET and send as Bearer or x-resend-inbound-secret.
 */
http.route({
  path: "/resend-inbound",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = process.env.RESEND_INBOUND_WEBHOOK_SECRET
    if (!secret) {
      console.error("RESEND_INBOUND_WEBHOOK_SECRET not set — rejecting inbound email")
      return new Response("Unauthorized", { status: 401 })
    }

    const auth = request.headers.get("authorization")
    const headerSecret = request.headers.get("x-resend-inbound-secret")
    const authorized =
      bearerMatchesSecret(auth, secret) ||
      (headerSecret !== null && secureCompare(headerSecret, secret))
    if (!authorized) {
      return new Response("Unauthorized", { status: 401 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return new Response("Invalid JSON", { status: 400 })
    }

    const payload = body as {
      type?: string
      data?: Record<string, unknown>
      from?: string | { address?: string }
      subject?: string
      text?: string
      html?: string
      attachments?: unknown[]
      email?: {
        from?: string
        subject?: string
        text?: string
        attachments?: unknown[]
      }
    }

    const data = payload.data ?? payload.email ?? payload
    const fromRaw = data.from ?? payload.from
    const fromEmail =
      typeof fromRaw === "string"
        ? fromRaw.replace(/.*<([^>]+)>.*/, "$1").trim().toLowerCase()
        : typeof fromRaw === "object" && fromRaw && "address" in fromRaw
          ? String((fromRaw as { address?: string }).address ?? "")
              .trim()
              .toLowerCase()
          : ""

    const subject = String(data.subject ?? payload.subject ?? "")
    const textPreview = String(data.text ?? payload.text ?? "").slice(0, 2000)
    const attachments = (data.attachments ?? payload.attachments ?? []) as unknown[]
    const hasAttachments = Array.isArray(attachments) && attachments.length > 0

    if (!fromEmail && !subject) {
      return new Response(JSON.stringify({ ok: false, reason: "empty" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Ignore our own outbound noise
    if (fromEmail.includes("askailegal.com") || fromEmail.includes("resend.dev")) {
      return new Response(JSON.stringify({ ok: true, ignored: "self" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    const result = await ctx.runMutation(internal.payments.processInboundClientEmail, {
      fromEmail: fromEmail || "unknown@inbound.local",
      subject: subject || "(no subject)",
      textPreview,
      hasAttachments,
    })

    return new Response(JSON.stringify({ ok: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }),
})

export default http
