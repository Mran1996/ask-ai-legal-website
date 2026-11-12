/** Canonical production URL — used for metadataBase, canonical links, sitemap, and JSON-LD. */
export const SITE_URL = "https://askailegal.com"

/** Meta / Facebook Page ID — canonical ad-eligible page ("Ask AI Legal"). */
export const META_FACEBOOK_PAGE_ID = "61585772484354"

/** Site-wide links — canonical ask-ai-legal-website app */
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/askailegal/",
  facebook: `https://www.facebook.com/profile.php?id=${META_FACEBOOK_PAGE_ID}`,
  /** Opens the Page straight to its Reviews tab. */
  facebookReviews: `https://www.facebook.com/profile.php?id=${META_FACEBOOK_PAGE_ID}&sk=reviews`,
  youtube: "https://www.youtube.com/@AskAILegal",
} as const

export const GUARANTEE_HREF = "/guarantee"
export const GUARANTEE_TITLE = "100% money-back guarantee."
export const GUARANTEE_TEXT =
  "If Ask AI Legal won’t install or run on your computer and we can’t fix it, you get every dollar back. No hassle."

/** Referral program: the referrer and the new customer each get this amount. */
export const REFERRAL_HREF = "/referrals"
export const REFERRAL_STARTER_REWARD_USD = 50
export const REFERRAL_COMPLETE_REWARD_USD = 100
export const REFERRAL_PAY_AFTER_DAYS = 30
export const REFERRAL_NAME_WITHIN_DAYS = 7
export const REFERRAL_TEXT =
  "Know someone who could use Ask AI Legal? When they buy and tell us you sent them, you each get a reward."

/** Retell voice agent ("Ask AI Legal Assistant"). The id is not secret; the API key stays on the server. */
export const RETELL_AGENT_ID = "agent_9ea0ca84ba73e22e80348888f2"
export const VOICE_PHONE_DISPLAY = "(833) 711-1237"
export const VOICE_PHONE_TEL = "+18337111237"

export const SUPPORT_EMAIL = "support@askailegal.com"
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}` as const

/** Google Business Profile NAP — phone line and hours hidden in UI while empty. */
export const BUSINESS_PHONE: string = ""
export const BUSINESS_HOURS: string = ""
/** Where we serve customers — not a claim that every jurisdiction's documents and rules are supported. */
export const BUSINESS_SERVICE_AREAS = "Serving customers in all 50 states"

/** Approved public pricing (Oct 2026): one-time purchase + optional monthly maintenance. */
export const PURCHASE_PRICE_USD = 2997
export const STARTER_PRICE_USD = 1497
export const PURCHASE_PRICE_CENTS = 299700
export const PURCHASE_PRICE_DISPLAY = "$2,997"
export const MAINTENANCE_PRICE_USD = 125
export const MAINTENANCE_PRICE_CENTS = 12500
export const MAINTENANCE_PRICE_DISPLAY = "$125"

/** What the one-time purchase includes — homepage and pricing read this list. */
export const PURCHASE_INCLUSIONS = [
  "Your download and license code",
  "Step-by-step walkthrough video",
  "Install in minutes on your own computer",
  "Second Brain memory that learns your case",
  "Reach us 24/7 with questions",
  "Support covers the first 30 days",
] as const

export const SUPPORT_PERIOD_NOTE =
  "Support begins when you install and covers setup problems and questions about using the installed features. You can reach us 24/7. Optional ongoing maintenance is available separately."

export const THIRD_PARTY_COSTS_NOTE =
  "Third-party AI usage and paid services are billed separately."

/**
 * Research platforms we can connect for a customer (owner-confirmed, Oct 2026).
 * Connected with the customer's own account or API key; details are covered in the consultation.
 * Text names only — no endorsement or partnership implied.
 */
export const RESEARCH_SOURCES = [
  "Westlaw",
  "LexisNexis",
  "Bloomberg Law",
  "Fastcase / vLex",
  "CourtListener",
  "UniCourt",
  "Docket Alarm",
  "GovInfo",
  "eCFR",
  "Open States",
  "Caselaw Access Project",
  "OpenLaws",
  "Vaquill AI",
  "judyrecords",
] as const

export const RESEARCH_DESCRIPTION =
  "Connect your workspace to supported legal research platforms for case law, statutes, regulations, and court records. We configure the connections selected for your installation."

export const RESEARCH_ACCESS_NOTE =
  "Provider subscriptions and usage fees are separate."

export const PRICING_NOTICE =
  "Ask AI Legal provides software, setup help, and technical assistance. It does not provide legal representation or guarantee court acceptance or outcomes. Review generated work and verify sources before relying on it."

/**
 * Consultation CTA. /book only schedules calls for an existing intake file
 * (it needs caseId + ref), so new visitors start on /contact.
 */
export const CONSULT_CTA_LABEL = "See plans and buy"
export const CONSULT_HREF = "/plans"

/** Stripe payment links for the two plans (each redirects to /pay/success?item=starter|complete). */
export const STRIPE_STARTER_URL = "https://buy.stripe.com/eVq14n4gm71f98ef1t0co0b"
export const STRIPE_COMPLETE_URL = "https://buy.stripe.com/8x214n5kq2KZfwCg5x0co0c"
/** The step-by-step install walkthrough on YouTube. */
export const WALKTHROUGH_VIDEO_URL = "https://www.youtube.com/watch?v=fZWmqU2a330"
export const WALKTHROUGH_VIDEO_ID = "fZWmqU2a330"

/** Pay #1 — internal ops/Stripe amount for the retired custom-quote flow (not advertised). */
export const CASE_FILE_REVIEW_PRICE_USD = 499
export const CASE_FILE_REVIEW_PRICE_CENTS = CASE_FILE_REVIEW_PRICE_USD * 100
/** @deprecated Retired custom-quote label — kept for ops screens only. */
export const CASE_FILE_REVIEW_PRICE_DISPLAY = "Custom quote"

/** Client-facing product labels */
export const CASE_REVIEW_LABEL = "Ask AI Legal purchase"
export const CASE_REVIEW_ASSESSMENT_LABEL = "Ask AI Legal purchase"

/** Primary CTAs */
export const PRIMARY_CTA_LABEL = CONSULT_CTA_LABEL
export const CASE_REVIEW_CTA_LABEL = CONSULT_CTA_LABEL

/**
 * Optional document retrieval add-on (ops fulfills manually for now — no court API yet).
 * Placeholder flat fee — replace with counsel/ops-reviewed rates before advertising heavily.
 */
export const DOCUMENT_RETRIEVAL_FEE_USD = 99
export const DOCUMENT_RETRIEVAL_FEE_DISPLAY = `$${DOCUMENT_RETRIEVAL_FEE_USD}`
export const DOCUMENT_RETRIEVAL_FEE_CENTS = DOCUMENT_RETRIEVAL_FEE_USD * 100

/** Brand mark copy — header + hero lockup */
export const SITE_BRAND_NAME = "Ask AI Legal™"
export const SITE_TAGLINE = "Your installed legal workspace"

/** Registered legal entity — used in footer copyright and legal pages (not the marketing lockup). */
export const SITE_LEGAL_NAME = "Ask AI Legal LLC"

/** @deprecated Use SITE_TAGLINE under the brand lockup instead */
export const SITE_SLOGAN = SITE_TAGLINE

export const SITE_DISCLAIMER =
  "Ask AI Legal is not a law firm. We provide software, installation, training, and technical assistance — not legal advice or legal representation."

/** Home page scrolling story. Set to true to bring back all six scenes. */
export const SHOW_SCROLL_STORY: boolean = false

/** Homepage SEO title — also the default title for pages without their own. */
export const SITE_SEO_TITLE = "Ask AI Legal | Private AI Legal Assistant for Self-Represented People"

/** Homepage SEO description — used in layout, JSON-LD, and social previews. */
export const SITE_SEO_DESCRIPTION =
  "A private AI legal assistant on your own computer. See sample court documents, then draft yours at home. All 50 states, from $1,497, paid once."

/** Brand mark (circular scales) — header, hero, app icons. */
export const SITE_LOGO_MARK = "/brand/stripe-logo-512.png"

/** Full wordmark lockup — footer, emails, letterhead. */
export const SITE_LOGO_LOCKUP = "/brand/letterhead-logo.png"

/** @deprecated Use SITE_LOGO_MARK */
export const SITE_LOGO_PATH = SITE_LOGO_MARK
