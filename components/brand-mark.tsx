type BrandMarkProps = {
  className?: string
}

/** Ask AI Legal "A" mark — same artwork as the installed app. Decorative; parent lockup carries accessible name. */
export function BrandMark({ className = "h-12 w-12 sm:h-14 sm:w-14 md:h-[4.25rem] md:w-[4.25rem] lg:h-[4.75rem] lg:w-[4.75rem]" }: BrandMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/mark.svg" alt="" aria-hidden className={`shrink-0 ${className}`} draggable={false} />
  )
}
