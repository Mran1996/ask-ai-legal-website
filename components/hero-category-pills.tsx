"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HERO_CATEGORY_LINKS } from "@/lib/situations/guides"

const pillBase =
  "inline-block rounded-full border-2 px-3 py-1.5 text-xs font-medium transition-all duration-300 sm:text-sm"

const pillDefault =
  "border-gold/55 bg-white/[0.06] text-white shadow-[0_0_14px_rgba(251,176,52,0.18)] hover:border-gold/80 hover:bg-white/[0.08] hover:shadow-[0_0_22px_rgba(251,176,52,0.28)]"

const pillActive =
  "border-gold bg-gold/10 text-white shadow-[0_0_26px_rgba(251,176,52,0.4)] ring-1 ring-gold/30"

export function HeroCategoryPills() {
  const pathname = usePathname()

  return (
    <ul className="mt-8 flex flex-wrap items-center justify-center gap-2 animate-fade-up [animation-delay:300ms]">
      {HERO_CATEGORY_LINKS.map((item) => {
        const href = "href" in item ? item.href : `/situations/${item.slug}`
        const active = !("href" in item) && pathname === `/situations/${item.slug}`

        return (
          <li key={item.slug}>
            <Link
              href={href}
              className={`${pillBase} ${active ? pillActive : pillDefault}`}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
