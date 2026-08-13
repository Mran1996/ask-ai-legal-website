import Image from "next/image"
import { SITE_BRAND_NAME, SITE_LOGO_LOCKUP, SITE_LOGO_MARK, SITE_TAGLINE } from "@/lib/site-config"

type BrandLogoProps = {
  /** Square mark size in px (circular logo). */
  size?: number
  className?: string
  priority?: boolean
}

/** Circular gold scales mark — includes “Ask AI Legal™” in the artwork. */
export function BrandLogo({ size = 48, className = "", priority = false }: BrandLogoProps) {
  return (
    <Image
      src={SITE_LOGO_MARK}
      alt={SITE_BRAND_NAME}
      width={size}
      height={size}
      className={`shrink-0 rounded-2xl ${className}`}
      priority={priority}
    />
  )
}

type BrandLogoLockupProps = {
  className?: string
  /** Display width in px; height scales with asset aspect ratio. */
  width?: number
}

/** Horizontal letterhead lockup — brand name + slogan baked into the PNG. */
export function BrandLogoLockup({ className = "", width = 240 }: BrandLogoLockupProps) {
  const height = Math.round(width * 0.22)
  return (
    <Image
      src={SITE_LOGO_LOCKUP}
      alt={`${SITE_BRAND_NAME} — ${SITE_TAGLINE}`}
      width={width}
      height={height}
      className={`h-auto w-auto max-w-full ${className}`}
      style={{ width, height: "auto" }}
    />
  )
}
