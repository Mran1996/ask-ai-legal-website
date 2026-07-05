"use node"

import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalAction } from "./_generated/server"

const SUPPORT_EMAIL = "support@askailegal.com"
const RESEND_API_URL = "https://api.resend.com/emails"

async function sendResendEmail(args: {
  to: string
  subject: string
  text: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not configured in Convex env" }
  }

  const from =
    process.env.RESEND_FROM_EMAIL ?? "Ask AI Legal <onboarding@resend.dev>"

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [args.to],
      subject: args.subject,
      text: args.text,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    return { ok: false, error: `Resend error ${response.status}: ${body}` }
  }

  return { ok: true }
}

export const sendIntakeEmails = internalAction({
  args: {
    caseId: v.id("cases"),
    caseReference: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.cases.getIntakeEmailContext, {
      caseId: args.caseId,
    })

    if (!context) {
      await ctx.runMutation(internal.notifications.recordNotification, {
        caseId: args.caseId,
        type: "intake_support",
        recipient: SUPPORT_EMAIL,
        status: "failed",
        provider: "resend",
        errorMessage: "Case or client not found for intake email",
      })
      return null
    }

    const clientSubject = `We received your intake — ${args.caseReference}`
    const clientBody = [
      `Hello ${context.clientFirstName},`,
      "",
      `We received your intake request. Your case reference is ${args.caseReference}.`,
      "",
      "Our team will follow up by email with next steps.",
      "",
      "Important: This message is not legal advice. Ask AI Legal generates documents only; we are not a law firm. Nothing has been delivered yet — a licensed attorney will review before any documents are sent.",
      "",
      "— Ask AI Legal",
    ].join("\n")

    const clientResult = await sendResendEmail({
      to: context.clientEmail,
      subject: clientSubject,
      text: clientBody,
    })

    await ctx.runMutation(internal.notifications.recordNotification, {
      caseId: args.caseId,
      type: "intake_client",
      recipient: context.clientEmail,
      status: clientResult.ok ? "sent" : "failed",
      provider: "resend",
      errorMessage: clientResult.ok ? undefined : clientResult.error,
    })

    const supportSubject = `New intake — ${args.caseReference}`
    const supportBody = [
      "New web chat intake submitted.",
      "",
      `Case reference: ${args.caseReference}`,
      `Case ID: ${args.caseId}`,
      "",
      `Client: ${context.clientFirstName} ${context.clientLastName}`,
      `Email: ${context.clientEmail}`,
      `Phone: ${context.clientPhone ?? "Not provided"}`,
      "",
      "Issue summary:",
      context.issueSummary ?? "(none)",
      "",
      "View in ops: /ops/intakes/" + args.caseId,
    ].join("\n")

    const supportResult = await sendResendEmail({
      to: SUPPORT_EMAIL,
      subject: supportSubject,
      text: supportBody,
    })

    await ctx.runMutation(internal.notifications.recordNotification, {
      caseId: args.caseId,
      type: "intake_support",
      recipient: SUPPORT_EMAIL,
      status: supportResult.ok ? "sent" : "failed",
      provider: "resend",
      errorMessage: supportResult.ok ? undefined : supportResult.error,
    })

    return null
  },
})
