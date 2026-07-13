"use node"

import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalAction } from "./_generated/server"
import { buildBookPageUrl } from "./lib/bookingUrls"

const SUPPORT_EMAIL = "support@askailegal.com"
const RESEND_API_URL = "https://api.resend.com/emails"

type IntakeEstimate = {
  serviceLine: string
  finalQuoteCents: number
  attorneyCompareLowCents: number
  attorneyCompareHighCents: number
  isCustomQuote: boolean
}

function formatUsdFromCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

function formatQuoteLines(estimate: IntakeEstimate | null): string[] {
  if (!estimate) {
    return ["Quote shown to customer: (no estimate on file)"]
  }

  const attorneyRange = `${formatUsdFromCents(estimate.attorneyCompareLowCents)}–${formatUsdFromCents(estimate.attorneyCompareHighCents)}`

  if (estimate.isCustomQuote) {
    return [
      "Quote shown to customer:",
      `Service: ${estimate.serviceLine}`,
      `Typical attorney: ${attorneyRange}`,
      "Ask AI Legal: Custom flat quote — support team to follow up",
    ]
  }

  const fractionOfMid =
    estimate.attorneyCompareLowCents > 0 && estimate.attorneyCompareHighCents > 0
      ? Math.round(
          (estimate.finalQuoteCents /
            ((estimate.attorneyCompareLowCents + estimate.attorneyCompareHighCents) / 2)) *
            100
        )
      : 0

  return [
    "Quote shown to customer:",
    `Service: ${estimate.serviceLine}`,
    `Typical attorney: ${attorneyRange}`,
    `Ask AI Legal estimate: ${formatUsdFromCents(estimate.finalQuoteCents)} (midpoint of typical attorney range, ~${fractionOfMid}% of range midpoint)`,
  ]
}

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

    const bookUrl = buildBookPageUrl({
      callType: "intake",
      caseId: args.caseId,
      caseReference: args.caseReference,
      email: context.clientEmail,
      firstName: context.clientFirstName,
      lastName: context.clientLastName,
    })

    const clientSubject = `Thank you for reaching out — ${args.caseReference}`
    const clientBodyParts = [
      `Hello ${context.clientFirstName},`,
      "",
      "Thank you for reaching out to Ask AI Legal!",
      "",
      `We received your intake request. Your case reference is ${args.caseReference}.`,
      "",
      "Someone from Ask AI Legal support will be in touch with you soon.",
      "",
      "Book a 15–20 minute intake call (document preparation and pricing only — not legal advice):",
      bookUrl,
    ]

    if (context.estimate) {
      clientBodyParts.push("")
      if (context.estimate.isCustomQuote) {
        clientBodyParts.push(
          `Service: ${context.estimate.serviceLine}`,
          `Typical attorney cost: ${formatUsdFromCents(context.estimate.attorneyCompareLowCents)}–${formatUsdFromCents(context.estimate.attorneyCompareHighCents)}`,
          "We'll email you a custom flat quote for Ask AI Legal document preparation."
        )
      } else {
        clientBodyParts.push(
          `Service: ${context.estimate.serviceLine}`,
          `Typical attorney cost: ${formatUsdFromCents(context.estimate.attorneyCompareLowCents)}–${formatUsdFromCents(context.estimate.attorneyCompareHighCents)}`,
          `Ask AI Legal estimated average: ${formatUsdFromCents(context.estimate.finalQuoteCents)}`
        )
      }
    }

    clientBodyParts.push(
      "",
      "Important: This message is not legal advice. Ask AI Legal generates documents only; we are not a law firm. Nothing has been delivered yet.",
      "",
      "— Ask AI Legal"
    )

    const clientBody = clientBodyParts.join("\n")

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
      ...formatQuoteLines(context.estimate),
      "",
      `Intake call booking link (for client): ${bookUrl}`,
      "Call booking status: pending until client books via Cal.com",
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

export const sendAppointmentBookedEmail = internalAction({
  args: {
    caseId: v.id("cases"),
    appointmentId: v.id("appointments"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.appointments.getEmailContext, {
      caseId: args.caseId,
      appointmentId: args.appointmentId,
    })

    if (!context) {
      return null
    }

    const when = new Date(context.scheduledAt).toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: context.timezone ?? "America/Los_Angeles",
    })

    const supportBody = [
      "A client booked a call.",
      "",
      `Case reference: ${context.caseReference}`,
      `Case ID: ${args.caseId}`,
      `Call type: ${context.callTypeLabel}`,
      `When: ${when}${context.timezone ? ` (${context.timezone})` : ""}`,
      `Duration: ${context.durationMinutes} minutes`,
      `Attendee: ${context.attendeeName ?? "—"} <${context.attendeeEmail ?? "—"}>`,
      context.meetLink ? `Meeting link: ${context.meetLink}` : "",
      "",
      `View in ops: /ops/intakes/${args.caseId}`,
    ]
      .filter(Boolean)
      .join("\n")

    const supportResult = await sendResendEmail({
      to: SUPPORT_EMAIL,
      subject: `Call booked — ${context.caseReference}`,
      text: supportBody,
    })

    await ctx.runMutation(internal.notifications.recordNotification, {
      caseId: args.caseId,
      type: "appointment_booked_support",
      recipient: SUPPORT_EMAIL,
      status: supportResult.ok ? "sent" : "failed",
      provider: "resend",
      errorMessage: supportResult.ok ? undefined : supportResult.error,
    })

    return null
  },
})
