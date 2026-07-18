/** Build public /book URLs for intake and future call types. */

/** When false, intake emails omit Cal.com /book links. */
export const INTAKE_BOOKING_ENABLED = true

export type BookCallType = "intake" | "document_planning" | "follow_up_paid"

export function publicSiteUrl(): string {
  return process.env.PUBLIC_SITE_URL ?? "https://askailegal.com"
}

export function buildBookPageUrl(args: {
  callType: BookCallType
  caseId: string
  caseReference: string
  email: string
  firstName: string
  lastName: string
}): string {
  const params = new URLSearchParams({
    type: args.callType,
    caseId: args.caseId,
    ref: args.caseReference,
    email: args.email.trim(),
    name: `${args.firstName.trim()} ${args.lastName.trim()}`.trim(),
  })
  return `${publicSiteUrl()}/book?${params.toString()}`
}

export function calcomWebhookUrl(): string {
  const site = process.env.CONVEX_SITE_URL ?? process.env.NEXT_PUBLIC_CONVEX_SITE_URL
  if (!site) {
    return "https://<your-deployment>.convex.site/calcom-webhook"
  }
  return `${site.replace(/\/$/, "")}/calcom-webhook`
}
