/** Shared branding for outbound Resend client emails (UPL-safe). */

export const SUPPORT_EMAIL = "support@askailegal.com"
export const INSTAGRAM_URL = "https://www.instagram.com/askailegal"
export const FACEBOOK_URL = "https://www.facebook.com/askailegal"

export function publicSiteUrl(): string {
  return (process.env.PUBLIC_SITE_URL ?? "https://askailegal.com").replace(/\/$/, "")
}

export function opsCaseUrl(caseId: string): string {
  return `${publicSiteUrl()}/ops/intakes/${caseId}`
}

export function documentPreparationAgreementUrl(): string {
  return `${publicSiteUrl()}/document-preparation-agreement`
}

export function opsNotifyEmail(): string {
  return process.env.OPS_NOTIFY_EMAIL?.trim() || SUPPORT_EMAIL
}

export function contactPageUrl(): string {
  return `${publicSiteUrl()}/#contact`
}

/** Prefer Ask AI Legal <support@…>; override with RESEND_FROM_EMAIL if set. */
export function resendFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    `Ask AI Legal <${SUPPORT_EMAIL}>`
  )
}

export function googleReviewUrl(): string | undefined {
  const url = process.env.GOOGLE_REVIEW_URL?.trim()
  return url && url.startsWith("https://") ? url : undefined
}

/** Footer for every client-facing email. */
export function clientEmailFooter(): string {
  const review = googleReviewUrl()
  const reviewLine = review
    ? `Leave a review (Google): ${review}`
    : "Leave a review: reply to this email and we'll send you our Google Business Profile review link."

  return [
    "—",
    "Ask AI Legal",
    `Website: ${publicSiteUrl()}`,
    `Contact: ${contactPageUrl()}`,
    `Email: ${SUPPORT_EMAIL}`,
    `Instagram: ${INSTAGRAM_URL}`,
    `Facebook: ${FACEBOOK_URL}`,
    reviewLine,
    "Document preparation only — we are not a law firm and do not provide legal advice.",
  ].join("\n")
}

export function clientEmailFooterHtml(): string {
  const review = googleReviewUrl()
  const reviewHtml = review
    ? `<a href="${review}" style="color:#C5A059;">Leave a Google review</a>`
    : "Leave a review: reply to this email and we'll send you our Google Business Profile review link."

  return `
<div style="margin-top:28px;padding-top:16px;border-top:1px solid #E5E7EB;font-family:Georgia,serif;font-size:13px;line-height:1.5;color:#4B5563;">
  <p style="margin:0 0 8px;font-weight:700;color:#0A1628;">Ask AI Legal</p>
  <p style="margin:0 0 4px;"><a href="${publicSiteUrl()}" style="color:#C5A059;">${publicSiteUrl()}</a> · <a href="${contactPageUrl()}" style="color:#C5A059;">Contact</a></p>
  <p style="margin:0 0 4px;"><a href="mailto:${SUPPORT_EMAIL}" style="color:#C5A059;">${SUPPORT_EMAIL}</a></p>
  <p style="margin:0 0 4px;"><a href="${INSTAGRAM_URL}" style="color:#C5A059;">Instagram</a> · <a href="${FACEBOOK_URL}" style="color:#C5A059;">Facebook</a></p>
  <p style="margin:8px 0 0;">${reviewHtml}</p>
  <p style="margin:12px 0 0;font-size:12px;color:#6B7280;">Document preparation only — we are not a law firm and do not provide legal advice.</p>
</div>`
}
