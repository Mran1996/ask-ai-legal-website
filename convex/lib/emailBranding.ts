/** Shared branding for outbound Resend client emails (UPL-safe). */

export const SUPPORT_EMAIL = "support@askailegal.com"

export function publicSiteUrl(): string {
  return (process.env.PUBLIC_SITE_URL ?? "https://askailegal.com").replace(/\/$/, "")
}

export function opsCaseUrl(caseId: string): string {
  return `${publicSiteUrl()}/ops/intakes/${caseId}`
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
    reviewLine,
    "Document preparation only — we are not a law firm and do not provide legal advice.",
  ].join("\n")
}
