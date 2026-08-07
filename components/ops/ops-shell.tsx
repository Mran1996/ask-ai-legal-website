"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, LayoutDashboard, LineChart } from "lucide-react"
import { OpsSignOutButton } from "@/components/ops/ops-access-gate"
import { SITE_BRAND_NAME } from "@/lib/site-config"

type OpsShellProps = {
  children: React.ReactNode
  /** Optional subtitle under the page title area */
  title?: string
  description?: string
}

const NAV = [
  {
    href: "/ops/intakes",
    label: "Matters",
    match: (path: string) => path.startsWith("/ops/intakes") || path === "/ops",
    icon: Briefcase,
  },
  {
    href: "/ops/insights",
    label: "Insights",
    match: (path: string) => path.startsWith("/ops/insights"),
    icon: LineChart,
  },
] as const

export function OpsShell({ children, title, description }: OpsShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-navy/10 bg-navy text-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-gold/40 bg-navy-light">
              <LayoutDashboard className="h-4 w-4 text-gold" aria-hidden />
            </span>
            <div>
              <p className="font-display text-lg leading-tight tracking-wide text-cream">
                {SITE_BRAND_NAME}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/90">
                Operations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-cream/60 underline-offset-2 hover:text-cream hover:underline"
            >
              Public site
            </Link>
            <OpsSignOutButton />
          </div>
        </div>

        <nav
          className="mx-auto flex max-w-6xl gap-1 px-4 sm:px-6"
          aria-label="Ops sections"
        >
          {NAV.map(({ href, label, match, icon: Icon }) => {
            const active = match(pathname)
            return (
              <Link
                key={href}
                href={href}
                className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? "text-gold"
                    : "text-cream/65 hover:text-cream"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
                {active && (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-gold" />
                )}
              </Link>
            )
          })}
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {(title || description) && (
          <div className="mb-8">
            {title && (
              <h1 className="font-display text-3xl text-navy sm:text-4xl">{title}</h1>
            )}
            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/65">
                {description}
              </p>
            )}
            <div className="mt-4 h-px w-16 bg-gold" />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
