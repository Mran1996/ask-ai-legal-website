import Link from "next/link"
import { BrandMark } from "@/components/brand-mark"
import { TypewriterText } from "@/components/typewriter-text"
import { SITE_BRAND_NAME, SITE_TAGLINE } from "@/lib/site-config"

type BrandLockupProps = {
  typewriterClassName?: string
  taglineClassName?: string
  className?: string
  typewriterSpeed?: number
  typewriterDelay?: number
  href?: string
  /** Hero = centered typewriter + tagline. Header = compact left-aligned nav mark. */
  variant?: "hero" | "header"
}

export function BrandLockup({
  typewriterClassName = "text-glow-accent-sm",
  taglineClassName,
  className = "",
  typewriterSpeed = 60,
  typewriterDelay = 200,
  href,
  variant = "hero",
}: BrandLockupProps) {
  const isHeader = variant === "header"

  const title = isHeader ? (
    <span className="font-sans text-[15px] font-semibold leading-tight tracking-tight text-gold sm:text-base">
      {SITE_BRAND_NAME}
    </span>
  ) : (
    <span
      className="font-sans text-4xl font-bold leading-[1.05] tracking-tight text-gold sm:text-5xl md:text-6xl lg:text-7xl"
      aria-label={SITE_BRAND_NAME}
    >
      <TypewriterText
        text={SITE_BRAND_NAME}
        className={typewriterClassName}
        speed={typewriterSpeed}
        startDelay={typewriterDelay}
      />
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
    <div className="flex w-full flex-col items-center text-center">
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
