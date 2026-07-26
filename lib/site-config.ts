/** Canonical production URL — used for metadataBase, canonical links, sitemap, and JSON-LD. */
export const SITE_URL = "https://askailegal.com"

/** Site-wide links — from Ask AI Legal cleanmain app */
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/askailegal/",
  facebook: "https://www.facebook.com/profile.php?id=61585772484354",
} as const

export const SUPPORT_EMAIL = "support@askailegal.com"
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}` as const

/** Pay #1 — flat case file review / start price when package is custom-quote (credited toward documents). */
export const CASE_FILE_REVIEW_PRICE_USD = 499
export const CASE_FILE_REVIEW_PRICE_DISPLAY = `$${CASE_FILE_REVIEW_PRICE_USD}`
export const CASE_FILE_REVIEW_PRICE_CENTS = CASE_FILE_REVIEW_PRICE_USD * 100

/**
 * Optional document retrieval add-on (ops fulfills manually for now — no court API yet).
 * Placeholder flat fee — replace with counsel/ops-reviewed rates before advertising heavily.
 */
export const DOCUMENT_RETRIEVAL_FEE_USD = 99
export const DOCUMENT_RETRIEVAL_FEE_DISPLAY = `$${DOCUMENT_RETRIEVAL_FEE_USD}`
export const DOCUMENT_RETRIEVAL_FEE_CENTS = DOCUMENT_RETRIEVAL_FEE_USD * 100

/** Brand mark copy — header + hero lockup */
export const SITE_BRAND_NAME = "Ask AI Legal™"
export const SITE_TAGLINE = "Know your case. Own your case."

/** Registered legal entity — used in footer copyright and legal pages (not the marketing lockup). */
export const SITE_LEGAL_NAME = "Ask AI Legal LLC"

/** @deprecated Use SITE_TAGLINE under the brand lockup instead */
export const SITE_SLOGAN = SITE_TAGLINE

export const SITE_DISCLAIMER =
  "Ask AI Legal generates documents only. We are not a law firm and do not provide legal advice."

/** Primary SEO title — used in layout, Open Graph, and Twitter cards. */
export const SITE_SEO_TITLE = "Ask AI Legal — Full Document Preparation Service"

/** Primary SEO description — used in layout, JSON-LD, and social previews. */
export const SITE_SEO_DESCRIPTION = `Full document preparation service for divorce paperwork, custody documents, and civil disputes. ${CASE_FILE_REVIEW_PRICE_DISPLAY} case file review → written summary with your exact price → flat-fee document package. Not a law firm, no legal advice.`
