import Image from "next/image"

export const BOOKING_BANNER_PATH = "/brand/ask-ai-legal-booking-banner.png"
import { SITE_TAGLINE } from "@/lib/site-config"

export const BOOKING_BANNER_ALT = `Ask AI Legal — ${SITE_TAGLINE}`

type Props = {
  /** Smaller banner for chat widget success state */
  compact?: boolean
  className?: string
}

export function BookingBanner({ compact = false, className = "" }: Props) {
  return (
    <div
      className={`mx-auto w-full ${compact ? "max-w-[11rem]" : "max-w-md"} ${className}`.trim()}
    >
      <Image
        src={BOOKING_BANNER_PATH}
        alt={BOOKING_BANNER_ALT}
        width={1024}
        height={1024}
        sizes={compact ? "176px" : "(max-width: 768px) 90vw, 448px"}
        className="h-auto w-full rounded-sm border border-gold/20"
        priority={!compact}
      />
    </div>
  )
}
