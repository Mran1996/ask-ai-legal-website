"use node"

import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalAction } from "./_generated/server"
import { buildBookPageUrl, INTAKE_BOOKING_ENABLED } from "./lib/bookingUrls"
import {
  SUPPORT_EMAIL,
  clientEmailFooter,
  clientEmailFooterHtml,
  documentPreparationAgreementUrl,
  opsCaseUrl,
  opsNotifyEmail,
  publicSiteUrl,
  resendFromAddress,
} from "./lib/emailBranding"
import {
  buildPersonalizedIntakeDocx,
  intakeDocxFileName,
  resolveIntakeDocxMatterHint,
  loadLetterheadLogoBytes,
} from "./lib/buildIntakeDocx"

const RESEND_API_URL = "https://api.resend.com/emails"

type IntakeEstimate = {
  serviceLine: string
  finalQuoteCents: number
  attorneyCompareLowCents: number
  attorneyCompareHighCents: number
  isCustomQuote: boolean
}

function formatUsdFromCents(cents: number): string {
  const hasCents = cents % 100 !== 0
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
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
  html?: string
  attachments?: Array<{
    filename: string
    content: string
    content_type?: string
  }>
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not configured in Convex env" }
  }

  const from = resendFromAddress()
  const replyTo = SUPPORT_EMAIL

  const payload: Record<string, unknown> = {
    from,
    to: [args.to],
    reply_to: replyTo,
    subject: args.subject,
    text: args.text,
  }
  if (args.html) payload.html = args.html
  if (args.attachments && args.attachments.length > 0) {
    payload.attachments = args.attachments
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.text()
    return { ok: false, error: `Resend error ${response.status}: ${body}` }
  }

  return { ok: true }
}

function withClientFooter(body: string): string {
  return `${body.trimEnd()}\n\n${clientEmailFooter()}`
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

    const bookUrl = INTAKE_BOOKING_ENABLED
      ? buildBookPageUrl({
          callType: "intake",
          caseId: args.caseId,
          caseReference: args.caseReference,
          email: context.clientEmail,
          firstName: context.clientFirstName,
          lastName: context.clientLastName,
        })
      : null

    const clientSubject = `${args.caseReference} — We received your intake | Ask AI Legal`
    const clientBodyParts = [
      `Hello ${context.clientFirstName},`,
      "",
      "Thank you for reaching out to Ask AI Legal.",
      "",
      `We received your intake. Your case reference is ${args.caseReference} — please keep it in email subjects.`,
      "",
      "What happens next (document preparation only — not a law firm, not legal advice):",
      "1. We email you a personalized intake form for your situation.",
      "2. You return the form and any court papers you have (or request paid document retrieval — quoted before we pull records).",
      "3. We email a written cost to research & draft, a document-preparation service agreement, and an invoice / payment link.",
      "4. After payment clears, we prepare your documents and deliver them by email.",
    ]

    if (bookUrl) {
      clientBodyParts.push(
        "",
        "Optional — book a short intake call (document prep and pricing only — not legal advice):",
        bookUrl
      )
    }

    if (context.estimate) {
      clientBodyParts.push("")
      if (context.estimate.isCustomQuote) {
        clientBodyParts.push(
          `Planning estimate — Service: ${context.estimate.serviceLine}`,
          `Typical attorney cost: ${formatUsdFromCents(context.estimate.attorneyCompareLowCents)}–${formatUsdFromCents(context.estimate.attorneyCompareHighCents)}`,
          "Ask AI Legal: custom flat quote will be in your emailed package after we review your form."
        )
      } else {
        clientBodyParts.push(
          `Planning estimate — Service: ${context.estimate.serviceLine}`,
          `Typical attorney cost: ${formatUsdFromCents(context.estimate.attorneyCompareLowCents)}–${formatUsdFromCents(context.estimate.attorneyCompareHighCents)}`,
          `Ask AI Legal estimated average: ${formatUsdFromCents(context.estimate.finalQuoteCents)} (final package price confirmed in your emailed quote)`
        )
      }
    }

    clientBodyParts.push(
      "",
      "Nothing has been delivered yet. We do not file documents or appear in court for you."
    )

    const clientResult = await sendResendEmail({
      to: context.clientEmail,
      subject: clientSubject,
      text: withClientFooter(clientBodyParts.join("\n")),
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
      ...(bookUrl
        ? [
            `Intake call booking link (for client): ${bookUrl}`,
            "Call booking status: pending until client books via Cal.com",
            "",
          ]
        : ["Intake call booking: disabled", ""]),
      `View in ops: ${opsCaseUrl(args.caseId)}`,
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

    // Auto-send Word intake form shortly after thank-you (idempotent if already sent)
    await ctx.scheduler.runAfter(2500, internal.emailActions.sendPersonalizedFormEmail, {
      caseId: args.caseId,
      force: false,
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
      `View in ops: ${opsCaseUrl(args.caseId)}`,
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

    const body = withClientFooter(
      [
        `Hello ${context.clientFirstName},`,
        "",
        "Your document package is ready.",
        "",
        `Case reference: ${context.caseReference}`,
        "",
        "Ask AI Legal generates legal documents only. We are not a law firm and do not provide legal advice.",
        "Please review the documents carefully before you file or use them. Reply to this email if you need a revision within the scope you paid for.",
      ].join("\n")
    )

    const result = await sendResendEmail({
      to: context.clientEmail,
      subject: `${context.caseReference} — Documents ready | Ask AI Legal`,
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
  args: {
    caseId: v.id("cases"),
    force: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.cases.getIntakeEmailContext, {
      caseId: args.caseId,
    })
    if (!context) return null

    if (!args.force && context.personalizedFormSentAt !== undefined) {
      return null
    }

    const logoBytes = await loadLetterheadLogoBytes()
    const docxContext = {
      caseReference: context.caseReference,
      clientFirstName: context.clientFirstName,
      clientLastName: context.clientLastName,
      clientEmail: context.clientEmail,
      clientPhone: context.clientPhone,
      issueSummary: context.issueSummary,
      state: context.state,
      county: context.county,
      court: context.court,
      matterType: context.matterType,
      caseTypeLabel: context.caseTypeLabel,
      role: context.role,
      serviceNeeded: context.serviceNeeded,
      deadline: context.deadline,
      knownDates: context.knownDates,
      opposingParty: context.opposingParty,
      hasDocuments: context.hasDocuments,
      preferredContact: context.preferredContact,
      caseNumber: context.caseNumber,
      retrievalRequested: context.retrievalRequested,
      logoBytes,
    }
    const docBytes = await buildPersonalizedIntakeDocx(docxContext)

    const fileName = intakeDocxFileName({
      lastName: context.clientLastName,
      caseReference: context.caseReference,
      matterHint: resolveIntakeDocxMatterHint(docxContext),
    })

    const storageId = await ctx.storage.store(
      new Blob([Buffer.from(docBytes)], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
    )

    const textBody = withClientFooter(
      [
        `Hello ${context.clientFirstName},`,
        "",
        `Re: ${context.caseReference} — personalized intake form (Word attachment)`,
        "",
        "Ask AI Legal prepares legal documents only. We are not a law firm and do not provide legal advice. You review and file any documents yourself.",
        "",
        "Attached is your Case Intake Questionnaire – Part 1 (Microsoft Word .docx) with our letterhead.",
        "Please complete Part 1, then reply to this email with:",
        "• the completed Word file",
        "• any court notices, filings, letters, or orders you already have",
        "",
        "If you need us to retrieve public filings, say so — retrieval is quoted in writing before we pull anything (never free unpaid work).",
        "",
        "After we receive your completed Part 1 and documents, we will email:",
        "1. the issues we see and the document work we can start with",
        "2. a written start cost / invoice / payment link",
        "",
        "We do not begin paid work until payment is received.",
      ].join("\n")
    )

    const site = publicSiteUrl()
    const logoUrl = `${site}/brand/letterhead-logo.png`
    const htmlBody = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F3F4F6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #E5E7EB;">
        <tr>
          <td style="background:#0A1628;padding:20px 24px;text-align:center;">
            <img src="${logoUrl}" alt="Ask AI Legal" width="240" style="max-width:240px;height:auto;border:0;" />
            <p style="margin:10px 0 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.12em;color:#FFFFFF;">KNOW YOUR CASE. OWN YOUR CASE.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 28px 8px;font-family:Georgia,serif;color:#111827;font-size:15px;line-height:1.55;">
            <p style="margin:0 0 16px;">Hello ${escapeHtml(context.clientFirstName)},</p>
            <p style="margin:0 0 16px;"><strong>Case reference:</strong> ${escapeHtml(context.caseReference)}</p>
            <p style="margin:0 0 16px;">Attached is your <strong>Case Intake Questionnaire – Part 1</strong> (Microsoft Word). Please complete it, then <strong>reply to this email</strong> with the completed Word file and any court papers you have.</p>
            <p style="margin:0 0 8px;font-weight:700;color:#0A1628;">What happens next</p>
            <ol style="margin:0 0 16px;padding-left:20px;">
              <li>You return completed Part 1 (+ documents)</li>
              <li>We acknowledge receipt and review your matter</li>
              <li>We email the issues we can start with + invoice / payment link</li>
              <li>After payment, we prepare and deliver your documents</li>
            </ol>
            <p style="margin:0 0 16px;">Ask AI Legal generates documents only. We are not a law firm, we do not provide legal advice, and we do not file or appear in court for you.</p>
            <p style="margin:0 0 8px;">Questions? Reply to this email or write <a href="mailto:${SUPPORT_EMAIL}" style="color:#C5A059;">${SUPPORT_EMAIL}</a>.</p>
            ${clientEmailFooterHtml()}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    const result = await sendResendEmail({
      to: context.clientEmail,
      subject: `${context.caseReference} — Intake Part 1 questionnaire | Ask AI Legal`,
      text: textBody,
      html: htmlBody,
      attachments: [
        {
          filename: fileName,
          content: Buffer.from(docBytes).toString("base64"),
          content_type:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
      ],
    })

    if (result.ok) {
      await ctx.runMutation(internal.documents.recordPersonalizedFormDelivery, {
        caseId: args.caseId,
        storageId,
        fileName,
      })
    }

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export const sendFormReceivedAcknowledgmentEmail = internalAction({
  args: {
    caseId: v.id("cases"),
    force: v.optional(v.boolean()),
    hasAttachments: v.optional(v.boolean()),
    inboundPreview: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.cases.getIntakeEmailContext, {
      caseId: args.caseId,
    })
    if (!context) return null

    const caseMeta = await ctx.runQuery(internal.cases.getFormReturnMeta, {
      caseId: args.caseId,
    })
    if (!args.force && caseMeta?.formReceivedAckSentAt !== undefined) {
      return null
    }

    const docsNote = args.hasAttachments
      ? "We also see that you included attachments — thank you."
      : "If you have court papers not yet attached, please reply with those documents so we can complete our review."

    const textBody = withClientFooter(
      [
        `Hello ${context.clientFirstName},`,
        "",
        `Re: ${context.caseReference} — we received your Part 1 / documents`,
        "",
        "Thank you. We received your completed intake materials.",
        docsNote,
        "",
        "Our team will review what you sent and be in touch soon with:",
        "• the issues we see and the document work we can start with",
        "• a written start cost / invoice / payment link",
        "",
        "We may request additional documents if something important is missing.",
        "",
        "Ask AI Legal prepares legal documents only. We are not a law firm and do not provide legal advice. Nothing has been filed by us.",
      ].join("\n")
    )

    const htmlBody = `<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:#F3F4F6;font-family:Georgia,serif;color:#111827;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #E5E7EB;padding:28px;">
    <div style="background:#0A1628;color:#C5A059;padding:16px;text-align:center;font-family:Arial,sans-serif;font-weight:700;">Ask AI Legal</div>
    <p>Hello ${escapeHtml(context.clientFirstName)},</p>
    <p><strong>Case reference:</strong> ${escapeHtml(context.caseReference)}</p>
    <p>Thank you — we <strong>received your completed Part 1 intake</strong>${args.hasAttachments ? " and attachments" : ""}.</p>
    <p>${escapeHtml(docsNote)}</p>
    <p><strong>Next:</strong> we will review and email the issues we can start with plus an invoice / payment link. We may request additional documents if needed.</p>
    <p style="font-size:13px;color:#4B5563;">Document preparation only — not a law firm — not legal advice.</p>
    ${clientEmailFooterHtml()}
  </div>
</body></html>`

    const result = await sendResendEmail({
      to: context.clientEmail,
      subject: `${context.caseReference} — We received your Part 1 | Ask AI Legal`,
      text: textBody,
      html: htmlBody,
    })

    if (result.ok) {
      await ctx.runMutation(internal.payments.markFormReceivedAckSent, {
        caseId: args.caseId,
      })
    }

    await ctx.runMutation(internal.notifications.recordNotification, {
      caseId: args.caseId,
      type: "form_received_ack_client",
      recipient: context.clientEmail,
      status: result.ok ? "sent" : "failed",
      provider: "resend",
      errorMessage: result.ok ? undefined : result.error,
    })

    const supportBody = [
      "Client returned Part 1 / emailed support (auto-ack path).",
      "",
      `Case: ${context.caseReference}`,
      `Client: ${context.clientFirstName} ${context.clientLastName} <${context.clientEmail}>`,
      `Attachments noted: ${args.hasAttachments ? "yes" : "unknown/no"}`,
      args.inboundPreview ? `Preview:\n${args.inboundPreview.slice(0, 800)}` : "",
      "",
      `Ops: ${opsCaseUrl(args.caseId)}`,
      "Next: review → email issues + invoice package.",
    ]
      .filter(Boolean)
      .join("\n")

    const supportResult = await sendResendEmail({
      to: SUPPORT_EMAIL,
      subject: `${context.caseReference} — Form returned (needs review) | Ask AI Legal`,
      text: supportBody,
    })

    await ctx.runMutation(internal.notifications.recordNotification, {
      caseId: args.caseId,
      type: "form_received_support",
      recipient: SUPPORT_EMAIL,
      status: supportResult.ok ? "sent" : "failed",
      provider: "resend",
      errorMessage: supportResult.ok ? undefined : supportResult.error,
    })

    return null
  },
})

export const sendOpsDraftPackageReadyEmail = internalAction({
  args: {
    caseId: v.id("cases"),
    draftPreview: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.cases.getIntakeEmailContext, {
      caseId: args.caseId,
    })
    if (!context) return null

    const to = opsNotifyEmail()
    const body = [
      `${context.caseReference} — LLM draft ready for your approval`,
      "",
      `Client: ${context.clientFirstName} ${context.clientLastName} <${context.clientEmail}>`,
      "",
      "Review, edit, then Approve & send in ops. Do not auto-forward this draft to the client.",
      "",
      `Ops: ${opsCaseUrl(args.caseId)}`,
      "",
      "— DRAFT PREVIEW —",
      args.draftPreview,
      "",
      "UPL: Document preparation only — not a law firm.",
    ].join("\n")

    const result = await sendResendEmail({
      to,
      subject: `${context.caseReference} — Approve issues + invoice package | Ask AI Legal`,
      text: body,
    })

    await ctx.runMutation(internal.notifications.recordNotification, {
      caseId: args.caseId,
      type: "draft_package_ops",
      recipient: to,
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
    issuesSummary: v.optional(v.string()),
    includeAgreement: v.optional(v.boolean()),
    askPriorityIssue: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.cases.getIntakeEmailContext, {
      caseId: args.caseId,
    })
    if (!context) return null

    const amountLine =
      args.quotedAmountCents !== undefined && args.quotedAmountCents > 0
        ? `Quoted amount to start: ${formatUsdFromCents(args.quotedAmountCents)}`
        : "Quoted amount to start: see the linked invoice (ops will confirm the final figure)."

    const issues =
      args.issuesSummary?.trim() ||
      "We reviewed your Part 1 responses and will confirm the document set we can prepare in the scope below."

    const scope =
      args.scopeSummary?.trim() ||
      (context.estimate
        ? `Document preparation related to: ${context.estimate.serviceLine}.`
        : "Document preparation based on your Part 1 responses.")

    const timeframe =
      args.timeframe?.trim() ||
      "Typical drafting window: 3–7 business days after payment clears and we have a complete file (or paid retrieval is finished)."

    const payUrl =
      args.paymentLinkUrl.trim() ||
      "(Payment link will be added by our team — reply if you do not see an invoice link.)"

    const agreementUrl = documentPreparationAgreementUrl()
    const agreementBlock =
      args.includeAgreement !== false
        ? [
            "SERVICE AGREEMENT (document preparation only)",
            `Please read: ${agreementUrl}`,
            "By paying the invoice / Payment Link you accept this Document Preparation Service Agreement.",
            "",
          ]
        : [
            "SERVICE AGREEMENT",
            "By paying the invoice you agree this is a document-preparation engagement only.",
            "",
          ]

    const priorityBlock =
      args.askPriorityIssue !== false
        ? [
            "PLEASE REPLY WITH",
            "1. Are these the issues, or did we miss anything?",
            "2. Which ONE issue should we prepare documents for first?",
            "3. Which remaining issues can wait for a later phase?",
            "",
          ]
        : []

    const body = withClientFooter(
      [
        `Hello ${context.clientFirstName},`,
        "",
        `Re: ${context.caseReference} — issues we can start with + invoice`,
        "",
        "Ask AI Legal generates legal documents only. We are not a law firm, we do not provide legal advice, and we do not appear in court or file on your behalf.",
        "",
        "DOCUMENTS / ISSUES WE CAN START WITH (document preparation)",
        issues,
        "",
        ...priorityBlock,
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
        ...agreementBlock,
        "PAYMENT (off-site invoice / Payment Link)",
        payUrl,
        "",
        "We begin research and drafting only after payment is received.",
        "",
        `Please keep ${context.caseReference} in all email subject lines.`,
      ].join("\n")
    )

    const result = await sendResendEmail({
      to: context.clientEmail,
      subject: `${context.caseReference} — Issues we can start with & invoice | Ask AI Legal`,
      text: body,
    })

    await ctx.runMutation(internal.notifications.recordNotification, {
      caseId: args.caseId,
      type: args.includeAgreement ? "package_approved_client" : "issues_invoice_client",
      recipient: context.clientEmail,
      status: result.ok ? "sent" : "failed",
      provider: "resend",
      errorMessage: result.ok ? undefined : result.error,
    })

    return null
  },
})
