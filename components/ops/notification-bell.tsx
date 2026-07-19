"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

type Props = {
  opsToken: string
}

function timeAgo(ms: number): string {
  const s = Math.floor((Date.now() - ms) / 1000)
  if (s < 60) return "just now"
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

const TYPE_ICONS: Record<string, string> = {
  payment_received: "$",
  new_intake: "＋",
  deadline_reminder: "!",
  draft_ready: "¶",
  doc_uploaded: "⇪",
  review_needed: "✓",
}

export function NotificationBell({ opsToken }: Props) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const feed = useQuery(api.notify.listOpsFeed, { opsToken })
  const unread = useQuery(api.notify.unreadOpsCount, { opsToken })
  const markAllRead = useMutation(api.notify.markAllOpsRead)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v)
          if (!open && (unread ?? 0) > 0) {
            void markAllRead({ opsToken })
          }
        }}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-navy transition-colors hover:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
        {(unread ?? 0) > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-navy">
            {unread! > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-elevated sm:w-96">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="font-display text-sm text-navy">Notifications</p>
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {feed === undefined && (
              <li className="px-4 py-6 text-center text-sm text-gray-500">Loading…</li>
            )}
            {feed?.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-gray-500">
                Nothing yet. Payments, intakes, drafts, and deadlines will land here.
              </li>
            )}
            {feed?.map((item) => (
              <li key={item.notificationId} className="border-b border-gray-50 last:border-0">
                <Link
                  href={`/ops/intakes/${item.caseId}`}
                  onClick={() => setOpen(false)}
                  className={`flex gap-3 px-4 py-3 transition-colors hover:bg-cream ${
                    item.readAt === undefined ? "bg-gold/5" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy font-mono text-xs text-gold"
                  >
                    {TYPE_ICONS[item.type] ?? "•"}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-navy">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-gray-600">
                      {item.body.slice(0, 140)}
                    </span>
                    <span className="mt-1 block text-[11px] uppercase tracking-wide text-gray-400">
                      {item.caseReference} · {timeAgo(item.createdAt)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
