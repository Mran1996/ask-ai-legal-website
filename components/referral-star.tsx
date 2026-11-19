"use client"

import Link from "next/link"
import { REFERRAL_HREF } from "@/lib/site-config"

/** Star sticker that opens the referral page. Used inside the home hero. */
export function ReferralStarSticker({ className = "" }: { className?: string }) {
  return (
    <Link
      href={REFERRAL_HREF}
      aria-label="Referral program. Get up to $100. Click to see how it works."
      className={`z-20 block transition-transform hover:scale-105 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/referral-star.png" alt="" width={136} height={133} className="h-auto w-full drop-shadow-lg" />
      <span className="absolute -bottom-[3%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#b30000] px-2 py-0.5 text-[10px] font-bold leading-tight text-white shadow sm:text-xs">
        Click me
      </span>
    </Link>
  )
}

/** Floating star is retired: every page now uses the Nov 2026 design, which leaves it out.
 *  The footer and the home page still link the referral program. Kept so the layout import still works. */
export function ReferralStar() {
  return null
}
