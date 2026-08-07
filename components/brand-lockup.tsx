"use client"

import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { SITE_TAGLINE } from "@/lib/site-config"

type BrandLockupProps = {
  taglineClassName?: string
  className?: string
  href?: string
  /** Hero = centered mark + slogan. Header = compact left-aligned nav mark. */
  variant?: "hero" | "header"
}

export function BrandLockup({
  taglineClassName,
  className = "",
  href,
  variant = "hero",
}: BrandLockupProps) {
  const isHeader = variant === "header"

  const tagline = (
    <p
      className={
        taglineClassName ??
        (isHeader
          ? "mt-0.5 text-[8px] font-medium uppercase leading-snug tracking-[0.2em] text-navy/65 sm:text-[9px]"
          : "mt-4 max-w-2xl text-sm font-medium uppercase leading-relaxed tracking-[0.22em] text-gold-light sm:mt-5 md:text-lg md:tracking-[0.26em]")
      }
    >
      {SITE_TAGLINE}
    </p>
  )

  const content = isHeader ? (
    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
      <BrandLogo size={44} className="rounded-xl" />
      <div className="min-w-0 text-left">{tagline}</div>
    </div>
  ) : (
    <div className="relative z-10 flex w-full flex-col items-center text-center">
      <BrandLogo size={160} className="rounded-3xl" priority />
      {tagline}
    </div>
  )

  const layoutClass = isHeader ? className : `w-full ${className}`

  if (href) {
    return (
      <Link href={href} className={`group block transition-opacity hover:opacity-80 ${layoutClass}`}>
        {content}
      </Link>
    )
  }

  return <div className={layoutClass}>{content}</div>
}
