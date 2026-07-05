/** Site-wide links — from Ask AI Legal cleanmain app */
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/askailegal",
  facebook: "https://www.facebook.com/askailegal",
  youtube: "https://www.youtube.com/watch?v=-W-vXHhkwNg",
} as const

export const SUPPORT_EMAIL = "support@askailegal.com"
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}` as const

/** Brand mark copy — header + hero lockup */
export const SITE_BRAND_NAME = "Ask AI Legal™"
export const SITE_TAGLINE = "Where Law Meets Intelligence."

/** @deprecated Use SITE_TAGLINE under the brand lockup instead */
export const SITE_SLOGAN = SITE_TAGLINE

export const SITE_DISCLAIMER =
  "Ask AI Legal generates legal documents only. We are not a law firm and do not provide legal advice."
