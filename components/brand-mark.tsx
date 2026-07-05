import { Scale } from "lucide-react"

type BrandMarkProps = {
  className?: string
}

/** Scales of justice — hero brand accent. Decorative; parent lockup carries accessible name. */
export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <div className={`relative shrink-0 ${className}`} aria-hidden>
      <Scale
        className="brand-mark-scales h-12 w-12 sm:h-14 sm:w-14 md:h-[4.25rem] md:w-[4.25rem] lg:h-[4.75rem] lg:w-[4.75rem] text-gold"
        strokeWidth={1.5}
      />
    </div>
  )
}
