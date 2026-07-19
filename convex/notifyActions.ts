"use node"

import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalAction } from "./_generated/server"
import { opsCaseUrl, opsNotifyEmail, resendFromAddress } from "./lib/emailBranding"
import { notificationTypeValidator } from "./lib/validators"

async function sendOpsEmail(args: {
  subject: string
  text: string
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not configured in Convex env" }
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFromAddress(),
      to: opsNotifyEmail(),
      subject: args.subject,
      text: args.text,
    }),
  })
  if (!response.ok) {
    return { ok: false, error: `Resend ${response.status}: ${await response.text()}` }
  }
  return { ok: true }
}

/** Operator SMS via Twilio REST. Skips silently when Twilio env is not configured. */
async function sendOpsSms(body: string): Promise<{
  ok: boolean
  skipped?: boolean
  error?: string
}> {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim()
  const token = process.env.TWILIO_AUTH_TOKEN?.trim()
  const from = process.env.TWILIO_FROM_NUMBER?.trim()
  const to = process.env.OPS_NOTIFY_PHONE?.trim()
  if (!sid || !token || !from || !to) {
    return { ok: false, skipped: true }
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ From: from, To: to, Body: body.slice(0, 1500) }),
    }
  )
  if (!response.ok) {
    return { ok: false, error: `Twilio ${response.status}: ${await response.text()}` }
  }
  return { ok: true }
}

/**
 * Routes one operator alert to email + SMS (the in-app row is already written
 * by notifyOps). Each channel result is recorded for the audit trail.
 */
export const fanOutOpsAlert = internalAction({
  args: {
    caseId: v.id("cases"),
    type: notificationTypeValidator,
    title: v.string(),
    body: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const caseLink = opsCaseUrl(args.caseId)
    const text = `${args.body}\n\nOpen case: ${caseLink}`

    const email = await sendOpsEmail({
      subject: `[Ask AI Legal Ops] ${args.title}`,
      text,
    })
    await ctx.runMutation(internal.notify.recordChannelResult, {
      caseId: args.caseId,
      type: args.type,
      channel: "email",
      recipient: opsNotifyEmail(),
      ok: email.ok,
      provider: "resend",
      errorMessage: email.error,
    })

    const sms = await sendOpsSms(`Ask AI Legal: ${args.title} — ${args.body}`)
    if (!sms.skipped) {
      await ctx.runMutation(internal.notify.recordChannelResult, {
        caseId: args.caseId,
        type: args.type,
        channel: "sms",
        recipient: process.env.OPS_NOTIFY_PHONE ?? "",
        ok: sms.ok,
        provider: "twilio",
        errorMessage: sms.error,
      })
    }

    return null
  },
})
