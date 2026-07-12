import Link from "next/link"
import { BrandMark } from "@/components/brand-mark"
import { SITE_BRAND_NAME, SITE_TAGLINE } from "@/lib/site-config"

type BrandLockupProps = {
  taglineClassName?: string
  className?: string
  href?: string
  /** Hero = centered mark + tagline. Header = compact left-aligned nav mark. */
  variant?: "hero" | "header"
}

export function BrandLockup({
  taglineClassName,
  className = "",
  href,
  variant = "hero",
}: BrandLockupProps) {
  const isHeader = variant === "header"

  const title = isHeader ? (
    <span className="brand-title-gold font-sans text-[15px] font-semibold leading-tight tracking-tight sm:text-base">
      {SITE_BRAND_NAME}
    </span>
  ) : (
    <span
      className="brand-title-gold font-sans text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
      aria-label={SITE_BRAND_NAME}
    >
      {SITE_BRAND_NAME}
    </span>
  )

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
    <div className="min-w-0 text-left">
      {title}
      {tagline}
    </div>
  ) : (
    <div className="relative z-10 flex w-full flex-col items-center text-center">
      <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 md:gap-5">
        <BrandMark className="-mt-0.5 sm:-mt-1" />
        {title}
      </div>
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
