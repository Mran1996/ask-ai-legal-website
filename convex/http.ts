import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { internal } from "./_generated/api"

const http = httpRouter()

function webhookAuthorized(request: Request): boolean {
  const secret = process.env.CALCOM_WEBHOOK_SECRET
  if (!secret) {
    console.warn("CALCOM_WEBHOOK_SECRET not set — accepting webhook (configure for production)")
    return true
  }

  const auth = request.headers.get("authorization")
  if (auth === `Bearer ${secret}`) return true

  const headerSecret = request.headers.get("x-cal-webhook-secret")
  if (headerSecret === secret) return true

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

export default http
