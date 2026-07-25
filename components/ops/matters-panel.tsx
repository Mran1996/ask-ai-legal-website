"use client"

import Link from "next/link"
import { usePaginatedQuery, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import {
  CountBarList,
  Section,
  StageChip,
  StatTile,
  formatUsd,
  stageForCase,
} from "@/components/ops/ops-ui"

type Props = {
  opsToken: string
}

export function MattersPanel({ opsToken }: Props) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.cases.listRecentIntakes,
    { opsToken },
    { initialNumItems: 25 }
  )
  const insights = useQuery(api.insights.summary, { opsToken })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Paid, last 7 days"
          value={insights ? formatUsd(insights.money.paidLast7DaysCents) : "…"}
          detail={insights ? `${insights.money.paidWindowCount} paid in ${insights.windowDays}d` : undefined}
        />
        <StatTile
          label="Drafts awaiting approval"
          value={insights ? String(insights.opsHealth.draftsAwaitingApproval) : "…"}
          detail="LLM issues drafts you must approve"
        />
        <StatTile
          label="Unpaid contracts"
          value={insights ? String(insights.money.unpaidContracts) : "…"}
          detail="Invoice emailed, not yet paid"
        />
        <StatTile
          label="Gap questions unanswered"
          value={insights ? String(insights.opsHealth.gapQuestionsUnanswered) : "…"}
          detail="Clients still owe us facts"
        />
      </div>

      <Section title="Matters" aside={<span className="text-xs text-gray-500">Newest first</span>}>
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-2 pr-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Reference
                </th>
                <th className="py-2 pr-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Client
                </th>
                <th className="hidden py-2 pr-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500 md:table-cell">
                  Issue
                </th>
                <th className="py-2 pr-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Stage
                </th>
                <th className="py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Received
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results?.map((row) => (
                <tr key={row.caseId} className="hover:bg-cream-dark/40">
                  <td className="py-2.5 pr-4">
                    <Link
                      href={`/ops/intakes/${row.caseId}`}
                      className="font-mono text-[13px] font-semibold text-navy underline-offset-2 hover:underline"
                    >
                      {row.caseReference}
                    </Link>
                    {row.retrievalRequested && (
                      <span className="mt-0.5 block text-[11px] text-amber-700">
                        Retrieval quoted later
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="block text-gray-900">
                      {row.clientFirstName} {row.clientLastName}
                    </span>
                    <span className="block text-xs text-gray-500">{row.clientEmail}</span>
                  </td>
                  <td className="hidden max-w-[16rem] py-2.5 pr-4 md:table-cell">
                    <span className="block truncate text-gray-600" title={row.issueSummary}>
                      {row.issueSummary ?? "—"}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <StageChip stage={stageForCase(row)} />
                  </td>
                  <td className="whitespace-nowrap py-2.5 font-mono text-xs tabular-nums text-gray-600">
                    {new Date(row.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {results?.length === 0 && status !== "LoadingFirstPage" && (
          <p className="py-8 text-center text-sm text-gray-500">
            No matters yet. New intakes from the site chat land here automatically.
          </p>
        )}
        {status === "LoadingFirstPage" && (
          <p className="py-8 text-center text-sm text-gray-500">Loading matters…</p>
        )}
        {status === "CanLoadMore" && (
          <button
            type="button"
            onClick={() => loadMore(25)}
            className="mt-4 rounded-sm border border-navy px-4 py-2 text-sm font-semibold text-navy hover:bg-cream-dark"
          >
            Load more
          </button>
        )}
        {status === "LoadingMore" && <p className="mt-4 text-sm text-gray-500">Loading…</p>}
      </Section>

      {insights && (
        <Section title="Cases by status">
          <CountBarList rows={insights.opsHealth.casesByStatus} emptyLabel="No cases yet." />
        </Section>
      )}
    </div>
  )
}
