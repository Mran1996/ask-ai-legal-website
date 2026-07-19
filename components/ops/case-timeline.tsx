"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

type Props = {
  opsToken: string
  caseId: Id<"cases">
}

const KIND_STYLES: Record<string, string> = {
  case: "bg-navy text-gold",
  agent: "bg-cream-dark text-navy",
  payment: "bg-emerald-100 text-emerald-800",
  notification: "bg-gray-100 text-gray-600",
  deadline: "bg-amber-100 text-amber-800",
  review: "bg-gold/30 text-navy",
  error: "bg-red-100 text-red-700",
}

const KIND_MARKS: Record<string, string> = {
  case: "§",
  agent: "AI",
  payment: "$",
  notification: "✉",
  deadline: "⏱",
  review: "⚖",
  error: "!",
}

export function CaseTimeline({ opsToken, caseId }: Props) {
  const events = useQuery(api.opsBoard.caseTimeline, { opsToken, caseId })

  return (
    <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-navy">Live timeline</h2>
      <p className="mt-1 text-xs text-gray-500">
        Every agent run, payment, notification, review, and deadline — newest first,
        updates in real time.
      </p>

      {events === undefined ? (
        <p className="mt-4 text-sm text-gray-500">Loading…</p>
      ) : events.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">No events recorded yet.</p>
      ) : (
        <ol className="mt-4 space-y-0">
          {events.map((event, i) => (
            <li key={`${event.at}-${i}`} className="relative flex gap-3 pb-4 last:pb-0">
              {i < events.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[13px] top-7 h-full w-px bg-gray-200"
                />
              )}
              <span
                aria-hidden="true"
                className={`z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold ${
                  KIND_STYLES[event.kind] ?? "bg-gray-100 text-gray-600"
                }`}
              >
                {KIND_MARKS[event.kind] ?? "•"}
              </span>
              <div className="min-w-0 pt-1">
                <p className="text-sm text-gray-900">{event.label}</p>
                {event.detail && (
                  <p className="mt-0.5 truncate text-xs text-gray-500">{event.detail}</p>
                )}
                <p className="mt-0.5 text-[11px] text-gray-400">
                  {new Date(event.at).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
