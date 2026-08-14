import { US_STATES } from "@/lib/chat/us-states"

/** Canonical production URL — used for metadataBase, canonical links, sitemap, and JSON-LD. */
export const SITE_URL = "https://askailegal.com"

/** Meta / Facebook Page ID — canonical ad-eligible page ("Ask AI Legal"). */
export const META_FACEBOOK_PAGE_ID = "971753329348819"

/** Site-wide links — canonical ask-ai-legal-website app */
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/askailegal/",
  facebook: `https://www.facebook.com/profile.php?id=${META_FACEBOOK_PAGE_ID}`,
} as const

export const SUPPORT_EMAIL = "support@askailegal.com"
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}` as const

/** Google Business Profile NAP — phone line hidden in UI while empty. */
export const BUSINESS_PHONE: string = ""
export const BUSINESS_HOURS = "Open 24/7"

/** All 50 U.S. state names for service-area display (excludes DC). */
export const BUSINESS_US_STATES: readonly string[] = US_STATES.filter(
  (state) => state.code !== "DC"
).map((state) => state.label)

export const BUSINESS_SERVICE_AREAS =
  "Document preparation service — all 50 U.S. states"

/** Pay #1 — flat file review deposit (credited toward documents). Internal constant name kept for Stripe/code compat. */
export const CASE_FILE_REVIEW_PRICE_USD = 499
export const CASE_FILE_REVIEW_PRICE_DISPLAY = `$${CASE_FILE_REVIEW_PRICE_USD}`
export const CASE_FILE_REVIEW_PRICE_CENTS = CASE_FILE_REVIEW_PRICE_USD * 100

/** Client-facing product labels — avoid "case" in marketing copy. */
export const FILE_REVIEW_DEPOSIT_LABEL = "File review deposit"
export const FILE_REVIEW_LABEL = "File review"

/**
 * Optional document retrieval add-on (ops fulfills manually for now — no court API yet).
 * Placeholder flat fee — replace with counsel/ops-reviewed rates before advertising heavily.
 */
export const DOCUMENT_RETRIEVAL_FEE_USD = 99
export const DOCUMENT_RETRIEVAL_FEE_DISPLAY = `$${DOCUMENT_RETRIEVAL_FEE_USD}`
export const DOCUMENT_RETRIEVAL_FEE_CENTS = DOCUMENT_RETRIEVAL_FEE_USD * 100

/** Brand mark copy — header + hero lockup */
export const SITE_BRAND_NAME = "Ask AI Legal™"
export const SITE_TAGLINE = "Get the help that you deserve"

/** Registered legal entity — used in footer copyright and legal pages (not the marketing lockup). */
export const SITE_LEGAL_NAME = "Ask AI Legal LLC"

/** @deprecated Use SITE_TAGLINE under the brand lockup instead */
export const SITE_SLOGAN = SITE_TAGLINE

export const SITE_DISCLAIMER =
  "Ask AI Legal generates documents only. We are not a law firm and do not provide legal advice."

/** Primary SEO title — used in layout, Open Graph, and Twitter cards. */
export const SITE_SEO_TITLE = "Ask AI Legal — Full Document Preparation Service"

/** Primary SEO description — used in layout, JSON-LD, and social previews. */
export const SITE_SEO_DESCRIPTION = `Full document preparation service for any issue, any jurisdiction. ${CASE_FILE_REVIEW_PRICE_DISPLAY} ${FILE_REVIEW_DEPOSIT_LABEL.toLowerCase()} → written summary with your exact price → flat-fee document package. Not a law firm, no legal advice.`

/** Brand mark (circular scales) — header, hero, app icons. */
export const SITE_LOGO_MARK = "/brand/stripe-logo-512.png"

/** Full wordmark lockup — footer, emails, letterhead. */
export const SITE_LOGO_LOCKUP = "/brand/letterhead-logo.png"

/** @deprecated Use SITE_LOGO_MARK */
export const SITE_LOGO_PATH = SITE_LOGO_MARK
