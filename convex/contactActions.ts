import { v } from "convex/values"
import { action } from "./_generated/server"
import {
  SUPPORT_EMAIL,
  opsNotifyEmail,
  publicSiteUrl,
  resendFromAddress,
} from "./lib/emailBranding"

const RESEND_API_URL = "https://api.resend.com/emails"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Public contact form submission. Emails the support/ops inbox with the
 * visitor's message and sets reply-to to the visitor so support can respond
 * directly. UPL-safe: this is a general contact channel, not legal advice.
 */
export const sendContactMessage = action({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.optional(v.string()),
    message: v.string(),
    // Honeypot — real users leave this empty; bots tend to fill it.
    company: v.optional(v.string()),
  },
  returns: v.object({
    ok: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (_ctx, args) => {
    // Silently accept honeypot hits so bots don't learn anything.
    if (args.company && args.company.trim().length > 0) {
      return { ok: true }
    }

    const name = args.name.trim()
    const email = args.email.trim()
    const phone = args.phone?.trim() ?? ""
    const subject = args.subject?.trim() ?? ""
    const message = args.message.trim()

    if (name.length === 0 || name.length > 120) {
      return { ok: false, error: "Please enter your name." }
    }
    if (!EMAIL_RE.test(email) || email.length > 200) {
      return { ok: false, error: "Please enter a valid email address." }
    }
    if (message.length === 0) {
      return { ok: false, error: "Please enter a message." }
    }
    if (message.length > 5000) {
      return { ok: false, error: "Message is too long (5000 characters max)." }
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return { ok: false, error: "Messaging is temporarily unavailable. Please email us directly." }
    }

    const heading = subject
      ? `New contact message: ${subject}`
      : "New contact message"

    const textLines = [
      heading,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      subject ? `Subject: ${subject}` : null,
      "",
      "Message:",
      message,
      "",
      "—",
      `Submitted via ${publicSiteUrl()}/contact`,
    ].filter((line): line is string => line !== null)

    const html = `
<div style="font-family:Georgia,serif;font-size:14px;line-height:1.6;color:#0A1628;">
  <p style="margin:0 0 12px;font-weight:700;">${escapeHtml(heading)}</p>
  <p style="margin:0 0 4px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
  <p style="margin:0 0 4px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
  ${phone ? `<p style="margin:0 0 4px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
  ${subject ? `<p style="margin:0 0 4px;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : ""}
  <p style="margin:16px 0 4px;"><strong>Message:</strong></p>
  <p style="margin:0;white-space:pre-wrap;">${escapeHtml(message)}</p>
  <p style="margin:20px 0 0;font-size:12px;color:#6B7280;">Submitted via ${escapeHtml(publicSiteUrl())}/contact</p>
</div>`

    const payload: Record<string, unknown> = {
      from: resendFromAddress(),
      to: [opsNotifyEmail()],
      reply_to: email,
      subject: `[Contact] ${subject || name}`,
      text: textLines.join("\n"),
      html,
    }

    try {
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
        console.error("Contact form Resend error:", response.status, body)
        return {
          ok: false,
          error: `Could not send your message. Please email ${SUPPORT_EMAIL} directly.`,
        }
      }

      return { ok: true }
    } catch (error) {
      console.error("Contact form send failed:", error)
      return {
        ok: false,
        error: `Could not send your message. Please email ${SUPPORT_EMAIL} directly.`,
      }
    }
  },
})
