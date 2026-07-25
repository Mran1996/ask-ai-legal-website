"use client"

import Link from "next/link"
import { OpsSignOutButton } from "@/components/ops/ops-access-gate"

export type OpsTab = "matters" | "insights"

type Props = {
  activeTab?: OpsTab
  /** Shown instead of tabs on matter detail pages. */
  breadcrumb?: React.ReactNode
  children: React.ReactNode
}

/**
 * Ops chrome: navy masthead, file-folder tabs, and the double rule (gold over
 * navy hairline) that separates the firm's chrome from the working paper below.
 */
export function OpsShell({ activeTab, breadcrumb, children }: Props) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-navy text-cream">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-4 pt-5 sm:px-6">
          <div className="pb-4">
            <Link href="/ops" className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
              <span className="font-display text-2xl font-semibold tracking-wide text-white">
                Ask AI Legal
              </span>
              <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                Operations
              </span>
            </Link>
          </div>
          <div className="flex items-end gap-6 pb-4 sm:pb-0">
            {breadcrumb ? (
              <div className="pb-0 text-sm text-cream/80 sm:pb-4">{breadcrumb}</div>
            ) : (
              <nav aria-label="Ops sections" className="flex gap-1">
                <FolderTab href="/ops" label="Matters" active={activeTab === "matters"} />
                <FolderTab
                  href="/ops?tab=insights"
                  label="Insights"
                  active={activeTab === "insights"}
                />
              </nav>
            )}
            <div className="pb-4 text-cream/70 sm:pb-3">
              <OpsSignOutButton />
            </div>
          </div>
        </div>
      </header>
      {/* Signature: ledger double rule — gold band over navy hairline */}
      <div aria-hidden className="h-[3px] bg-gold" />
      <div aria-hidden className="mt-[2px] h-px bg-navy/30" />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-gray-500 sm:px-6">
        Document preparation only — not a law firm. Drafts require human approval before any
        client send.
      </footer>
    </div>
  )
}

function FolderTab({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "rounded-t-md border border-b-0 border-gold/60 bg-cream px-5 py-2.5 text-sm font-semibold text-navy"
          : "rounded-t-md border border-b-0 border-transparent px-5 py-2.5 text-sm font-medium text-cream/75 hover:bg-navy-light hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      }
    >
      {label}
    </Link>
  )
}
