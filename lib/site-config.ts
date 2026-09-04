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
export const BUSINESS_SERVICE_AREAS = "All 50 states"

/** Pay #1 — internal ops/Stripe amount (not advertised on the marketing site). */
export const CASE_FILE_REVIEW_PRICE_USD = 499
export const CASE_FILE_REVIEW_PRICE_CENTS = CASE_FILE_REVIEW_PRICE_USD * 100
/** Public-facing start price label — custom quote; $499 is no longer advertised. */
export const CASE_FILE_REVIEW_PRICE_DISPLAY = "Custom quote"

/** Client-facing product labels */
export const CASE_REVIEW_LABEL = "Setup install"
export const CASE_REVIEW_ASSESSMENT_LABEL = "Setup install"
export const FILE_REVIEW_DEPOSIT_LABEL = CASE_REVIEW_ASSESSMENT_LABEL
export const FILE_REVIEW_LABEL = CASE_REVIEW_LABEL

/** Primary CTAs */
export const PRIMARY_CTA_LABEL = "Tell us what you're facing"
export const CASE_REVIEW_CTA_LABEL = "Start your setup"

/**
 * Optional document retrieval add-on (ops fulfills manually for now — no court API yet).
 * Placeholder flat fee — replace with counsel/ops-reviewed rates before advertising heavily.
 */
export const DOCUMENT_RETRIEVAL_FEE_USD = 99
export const DOCUMENT_RETRIEVAL_FEE_DISPLAY = `$${DOCUMENT_RETRIEVAL_FEE_USD}`
export const DOCUMENT_RETRIEVAL_FEE_CENTS = DOCUMENT_RETRIEVAL_FEE_USD * 100

/** Brand mark copy — header + hero lockup */
export const SITE_BRAND_NAME = "Ask AI Legal™"
export const SITE_TAGLINE = "From the comfort of your home"

/** Registered legal entity — used in footer copyright and legal pages (not the marketing lockup). */
export const SITE_LEGAL_NAME = "Ask AI Legal LLC"

/** @deprecated Use SITE_TAGLINE under the brand lockup instead */
export const SITE_SLOGAN = SITE_TAGLINE

export const SITE_DISCLAIMER =
  "Ask AI Legal installs and configures the tools you use from home. We are not a law firm and do not provide legal advice."

/** Primary SEO title — used in layout, Open Graph, and Twitter cards. */
export const SITE_SEO_TITLE = "Ask AI Legal — We Install. You Work From Home."

/** Primary SEO description — used in layout, JSON-LD, and social previews. */
export const SITE_SEO_DESCRIPTION =
  "We do the install so you can do everything you need from the comfort of your home with Ask AI Legal. Custom quote to get started. Not a law firm, no legal advice."

/** Brand mark (circular scales) — header, hero, app icons. */
export const SITE_LOGO_MARK = "/brand/stripe-logo-512.png"

/** Full wordmark lockup — footer, emails, letterhead. */
export const SITE_LOGO_LOCKUP = "/brand/letterhead-logo.png"

/** @deprecated Use SITE_LOGO_MARK */
export const SITE_LOGO_PATH = SITE_LOGO_MARK
