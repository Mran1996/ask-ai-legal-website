"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { REFERRAL_HREF } from "@/lib/site-config"

/** Star that opens the referral page. On the home page it sits at the top, just under the header. Elsewhere it is pinned above the cookie banner. */
export function ReferralStar() {
  const pathname = usePathname() ?? ""
  if (pathname === REFERRAL_HREF || pathname.startsWith("/ops") || pathname.startsWith("/pay")) return null

  return (
    <Link
      href={REFERRAL_HREF}
      aria-label="Referral program. Get up to $100. Click to see how it works."
      className={`z-[60] block transition-transform hover:scale-105 ${
        pathname === "/"
          ? "absolute left-2 top-[4.75rem] w-[88px] sm:left-6 sm:top-24 sm:w-[150px]"
          : "fixed bottom-24 left-2 w-[104px] sm:bottom-20 sm:left-4 sm:w-[136px]"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/referral-star.png" alt="" width={136} height={133} className="h-auto w-full drop-shadow-lg" />
      <span className="absolute -bottom-[3%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#b30000] px-2 py-0.5 text-[10px] font-bold leading-tight text-white shadow sm:text-xs">
        Click me
      </span>
    </Link>
  )
}
