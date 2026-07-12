/** Canonical production URL — used for metadataBase, canonical links, sitemap, and JSON-LD. */
export const SITE_URL = "https://askailegal.com"

/** Site-wide links — from Ask AI Legal cleanmain app */
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/askailegal",
  facebook: "https://www.facebook.com/askailegal",
} as const

export const SUPPORT_EMAIL = "support@askailegal.com"
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}` as const

/** Pay #1 — flat case file review (credited toward document package). */
export const CASE_FILE_REVIEW_PRICE_USD = 499
export const CASE_FILE_REVIEW_PRICE_DISPLAY = `$${CASE_FILE_REVIEW_PRICE_USD}`

/** Brand mark copy — header + hero lockup */
export const SITE_BRAND_NAME = "Ask AI Legal™"
export const SITE_TAGLINE = "Know your case. Own your case."

/** @deprecated Use SITE_TAGLINE under the brand lockup instead */
export const SITE_SLOGAN = SITE_TAGLINE

export const SITE_DISCLAIMER =
  "Ask AI Legal generates legal documents only. We are not a law firm and do not provide legal advice."
