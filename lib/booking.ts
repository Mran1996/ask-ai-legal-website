/** Client-side booking URL helpers (mirrors convex/lib/bookingUrls.ts). */

export type BookCallType = "intake" | "document_planning" | "follow_up_paid"

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://askailegal.com"
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
  return `${siteUrl()}/book?${params.toString()}`
}

export function calcomIntakeSlug(): string | null {
  const slug = process.env.NEXT_PUBLIC_CALCOM_INTAKE_EVENT_SLUG?.trim()
  return slug || null
}

function calcomEventBaseUrl(): string | null {
  const slug = calcomIntakeSlug()
  if (!slug) return null
  return slug.startsWith("http") ? slug.replace(/\?.*$/, "") : `https://cal.com/${slug.replace(/^\//, "")}`
}

export function buildCalcomPublicUrl(args: {
  email: string
  name: string
  caseReference: string
  caseId: string
}): string | null {
  const base = calcomEventBaseUrl()
  if (!base) return null

  const params = new URLSearchParams({
    email: args.email,
    name: args.name,
    "case-reference": args.caseReference,
    caseReference: args.caseReference,
    caseId: args.caseId,
  })

  const separator = base.includes("?") ? "&" : "?"
  return `${base}${separator}${params.toString()}`
}

export function buildCalcomEmbedSrc(args: {
  email: string
  name: string
  caseReference: string
  caseId: string
  callType?: BookCallType
}): string | null {
  const slug = calcomIntakeSlug()
  if (!slug) return null

  const params = new URLSearchParams({
    embed: "true",
    theme: "dark",
    layout: "month_view",
    email: args.email,
    name: args.name,
    "case-reference": args.caseReference,
    caseReference: args.caseReference,
    caseId: args.caseId,
    callType: args.callType ?? "intake",
  })

  const base = calcomEventBaseUrl()
  if (!base) return null
  const separator = base.includes("?") ? "&" : "?"
  return `${base}${separator}${params.toString()}`
}

export const BOOKING_DISCLAIMER =
  "Ask AI Legal is not a law firm. This call is for document preparation and pricing only — not legal advice."

export const INTAKE_CALL_DESCRIPTION =
  "Discuss your situation and what documents we can prepare — plus flat-fee pricing."
