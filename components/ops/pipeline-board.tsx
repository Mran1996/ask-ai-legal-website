"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { NotificationBell } from "@/components/ops/notification-bell"
import { OpsSignOutButton } from "@/components/ops/ops-access-gate"

type Props = {
  opsToken: string
}

const STAGES = [
  { key: "intake", label: "Intake" },
  { key: "estimate_sent", label: "Estimate sent" },
  { key: "awaiting_payment", label: "Awaiting payment" },
  { key: "awaiting_docs", label: "Awaiting docs" },
  { key: "in_drafting", label: "Drafting" },
  { key: "in_counsel_review", label: "Human review" },
  { key: "delivered", label: "Delivered" },
  { key: "closed", label: "Closed" },
] as const

const DAY_MS = 24 * 60 * 60 * 1000

function deadlineChip(nextDeadlineAt?: number) {
  if (nextDeadlineAt === undefined) return null
  const daysLeft = Math.ceil((nextDeadlineAt - Date.now()) / DAY_MS)
  const label =
    daysLeft < 0
      ? `${Math.abs(daysLeft)}d overdue`
      : daysLeft === 0
        ? "due today"
        : `due in ${daysLeft}d`
  const tone =
    daysLeft <= 1
      ? "bg-red-50 text-red-700 border-red-200"
      : daysLeft <= 3
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-gray-50 text-gray-600 border-gray-200"
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tone}`}>
      ⏱ {label}
    </span>
  )
}

export function PipelineBoard({ opsToken }: Props) {
  const [search, setSearch] = useState("")
  const cards = useQuery(api.opsBoard.pipelineBoard, {
    opsToken,
    search: search.trim() || undefined,
  })

  return (
    <div className="mx-auto max-w-[110rem] px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-navy">Case pipeline</h1>
          <p className="mt-1 text-sm text-gray-600">
            Every client, live — intake to delivery. Click any card for the full file.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="relative block">
            <span className="sr-only">Search clients and cases</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, or AAL ref…"
              className="w-64 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
            />
          </label>
          <NotificationBell opsToken={opsToken} />
          <Link
            href="/ops/intakes"
            className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:border-gold"
          >
            Intake list
          </Link>
          <OpsSignOutButton />
        </div>
      </header>

      {cards === undefined ? (
        <p className="py-20 text-center text-gray-500">Loading pipeline…</p>
      ) : (
        <div className="mt-8 flex gap-4 overflow-x-auto pb-6">
          {STAGES.map((stage) => {
            const stageCards = cards.filter((c) => c.status === stage.key)
            const needsAction =
              stage.key === "in_counsel_review" || stage.key === "intake"
            return (
              <section
                key={stage.key}
                aria-label={`${stage.label} (${stageCards.length})`}
                className="w-72 shrink-0"
              >
                <div
                  className={`flex items-baseline justify-between border-b-2 px-1 pb-2 ${
                    needsAction && stageCards.length > 0
                      ? "border-gold"
                      : "border-gray-200"
                  }`}
                >
                  <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-navy">
                    {stage.label}
                  </h2>
                  <span className="font-mono text-xs text-gray-500">{stageCards.length}</span>
                </div>
                <ul className="mt-3 space-y-2">
                  {stageCards.length === 0 && (
                    <li className="rounded-lg border border-dashed border-gray-200 px-3 py-4 text-center text-xs text-gray-400">
                      Empty
                    </li>
                  )}
                  {stageCards.map((card) => (
                    <li key={card.caseId}>
                      <Link
                        href={`/ops/intakes/${card.caseId}`}
                        className="block rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-gold motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-navy">
                            {card.caseReference}
                          </span>
                          {card.paidAt !== undefined && (
                            <span
                              title="Paid"
                              className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
                            >
                              paid
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 truncate text-sm font-semibold text-gray-900">
                          {card.clientName}
                        </p>
                        {card.issueSummary && (
                          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-gray-600">
                            {card.issueSummary}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between gap-2">
                          {deadlineChip(card.nextDeadlineAt) ?? <span />}
                          <span className="text-[11px] text-gray-400">
                            {new Date(card.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
