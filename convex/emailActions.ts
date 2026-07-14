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
      "Next steps:",
      "1. We will email you a personalized intake form for your situation (letterhead).",
      "2. Please upload any court papers you have — or tell us if you need us to retrieve documents (additional fee, quoted before we pull records).",
      "3. After we review your form and documents, we will email a written cost estimate, a document-preparation service agreement, and an invoice / payment link.",
      "4. We start research and drafting only after payment is received.",
      "",
      "Optional — book a 15–20 minute intake call (document preparation and pricing only — not legal advice):",
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

export const sendDeliveryEmail = internalAction({
  args: { caseId: v.id("cases") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.cases.getIntakeEmailContext, {
      caseId: args.caseId,
    })

    if (!context) {
      await ctx.runMutation(internal.notifications.recordNotification, {
        caseId: args.caseId,
        type: "delivery_client",
        recipient: SUPPORT_EMAIL,
        status: "failed",
        provider: "resend",
        errorMessage: "Case or client not found for delivery email",
      })
      return null
    }

    const body = [
      `Hello ${context.clientFirstName},`,
      "",
      "Your document package is ready.",
      "",
      `Case reference: ${context.caseReference}`,
      "",
      "Ask AI Legal generates legal documents only. We are not a law firm and do not provide legal advice.",
      "Please review the documents carefully before you file or use them. Reply to this email if you need a revision within the scope you paid for.",
      "",
      "— Ask AI Legal",
    ].join("\n")

    const result = await sendResendEmail({
      to: context.clientEmail,
      subject: `Documents ready — ${context.caseReference}`,
      text: body,
    })

    await ctx.runMutation(internal.notifications.recordNotification, {
      caseId: args.caseId,
      type: "delivery_client",
      recipient: context.clientEmail,
      status: result.ok ? "sent" : "failed",
      provider: "resend",
      errorMessage: result.ok ? undefined : result.error,
    })

    return null
  },
})

export const sendPersonalizedFormEmail = internalAction({
  args: { caseId: v.id("cases") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.cases.getIntakeEmailContext, {
      caseId: args.caseId,
    })
    if (!context) return null

    const body = [
      `Hello ${context.clientFirstName},`,
      "",
      `Re: ${context.caseReference} — personalized intake form`,
      "",
      "Ask AI Legal prepares legal documents only. We are not a law firm and do not provide legal advice. You review and file any documents yourself.",
      "",
      "Attached to this email (or linked by our team) is a personalized intake form tailored to your matter. Please complete it and reply to this email with:",
      "• the filled form",
      "• any court notices, filings, letters, or orders you already have",
      "",
      "If you do not have documents and need us to retrieve public filings, reply and say so — retrieval is an additional fee that we will quote in writing before we pull anything.",
      "",
      "After we receive your form (and documents, or your retrieval request), we will email:",
      "1. written cost to research and draft your documents",
      "2. a written document-preparation service agreement",
      "3. an invoice / payment link",
      "",
      "We do not begin paid work until payment is received.",
      "",
      "File this email in Outlook under Clients using your case reference in the subject.",
      "",
      "— Ask AI Legal",
      SUPPORT_EMAIL,
    ].join("\n")

    const result = await sendResendEmail({
      to: context.clientEmail,
      subject: `${context.caseReference} — Personalized intake form | Ask AI Legal`,
      text: body,
    })

    await ctx.runMutation(internal.notifications.recordNotification, {
      caseId: args.caseId,
      type: "personalized_form_client",
      recipient: context.clientEmail,
      status: result.ok ? "sent" : "failed",
      provider: "resend",
      errorMessage: result.ok ? undefined : result.error,
    })

    return null
  },
})

export const sendQuoteContractInvoiceEmail = internalAction({
  args: {
    caseId: v.id("cases"),
    paymentLinkUrl: v.string(),
    quotedAmountCents: v.optional(v.number()),
    scopeSummary: v.optional(v.string()),
    timeframe: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.cases.getIntakeEmailContext, {
      caseId: args.caseId,
    })
    if (!context) return null

    const amountLine =
      args.quotedAmountCents !== undefined && args.quotedAmountCents > 0
        ? `Quoted amount: ${formatUsdFromCents(args.quotedAmountCents)}`
        : "Quoted amount: see the attached / linked invoice (ops will confirm the final figure)."

    const scope =
      args.scopeSummary?.trim() ||
      (context.estimate
        ? `Document preparation related to: ${context.estimate.serviceLine}.`
        : "Document preparation as described in your personalized intake responses.")

    const timeframe =
      args.timeframe?.trim() ||
      "Typical drafting window: 3–7 business days after payment clears and we have a complete file (or paid retrieval is finished)."

    const payUrl =
      args.paymentLinkUrl.trim() ||
      "(Payment link will be added by our team — reply if you do not see an invoice link.)"

    const body = [
      `Hello ${context.clientFirstName},`,
      "",
      `Re: ${context.caseReference} — quote, agreement, and invoice`,
      "",
      "Ask AI Legal generates legal documents only. We are not a law firm, we do not provide legal advice, and we do not appear in court or file on your behalf.",
      "",
      "SCOPE (document preparation)",
      scope,
      "",
      amountLine,
      "",
      "TIMEFRAME",
      timeframe,
      "",
      "WHAT IS COVERED",
      "• Research and drafting of the documents described in your scope",
      "• Plain-English packaging of deliverables for your review",
      "• Reasonable revisions within the paid scope",
      "",
      "WHAT IS NOT COVERED",
      "• Legal advice or attorney-client representation",
      "• Court appearance, filing, or serving papers for you",
      "• Document retrieval until separately quoted and paid",
      "",
      "SERVICE AGREEMENT",
      "By paying the invoice you agree this is a document-preparation engagement only. A written agreement is included with this package (or will be attached by our team). Keep a copy for your records.",
      "",
      "PAYMENT (off-site invoice / Payment Link — not charged on our contact page)",
      payUrl,
      "",
      "We begin research and drafting only after payment is received.",
      "",
      `Please keep ${context.caseReference} in all email subject lines so we can file your matter correctly in Outlook.`,
      "",
      "— Ask AI Legal",
      SUPPORT_EMAIL,
    ].join("\n")

    const result = await sendResendEmail({
      to: context.clientEmail,
      subject: `${context.caseReference} — Quote, contract & invoice | Ask AI Legal`,
      text: body,
    })

    await ctx.runMutation(internal.notifications.recordNotification, {
      caseId: args.caseId,
      type: "quote_contract_invoice_client",
      recipient: context.clientEmail,
      status: result.ok ? "sent" : "failed",
      provider: "resend",
      errorMessage: result.ok ? undefined : result.error,
    })

    return null
  },
})
