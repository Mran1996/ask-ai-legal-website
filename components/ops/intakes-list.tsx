"use client"

import Link from "next/link"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

type Props = {
  opsToken: string
}

function stageLabel(row: {
  personalizedFormSentAt?: number
  formReturnedAt?: number
  contractInvoiceSentAt?: number
  paidAt?: number
  status: string
}): string {
  if (row.status === "delivered") return "Delivered"
  if (row.status === "in_drafting" || row.status === "awaiting_docs") return "Work"
  if (row.paidAt !== undefined) return "Paid"
  if (row.contractInvoiceSentAt !== undefined) return "Invoice emailed"
  if (row.formReturnedAt !== undefined) return "Form returned"
  if (row.personalizedFormSentAt !== undefined) return "Form sent"
  return "Intake"
}

function stageTone(label: string): string {
  switch (label) {
    case "Paid":
    case "Delivered":
      return "bg-brand/10 text-brand-dark"
    case "Work":
      return "bg-gold/15 text-gold-dark"
    case "Form returned":
    case "Invoice emailed":
      return "bg-navy/5 text-navy"
    default:
      return "bg-cream-dark text-navy/70"
  }
}

export function IntakesList({ opsToken }: Props) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.cases.listRecentIntakes,
    { opsToken },
    { initialNumItems: 20 }
  )

  return (
    <div>
      <div className="overflow-hidden border border-navy/10 bg-white shadow-[0_1px_0_rgba(12,25,41,0.04)]">
        <table className="min-w-full divide-y divide-navy/8 text-sm">
          <thead className="bg-navy/[0.03]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/50">
                Reference
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/50">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/50">
                Funnel stage
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/50">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy/50">
                Submitted
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/6">
            {results?.map((row) => {
              const stage = stageLabel(row)
              return (
                <tr key={row.caseId} className="transition-colors hover:bg-cream/80">
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/ops/intakes/${row.caseId}`}
                      className="font-mono text-sm font-semibold text-navy hover:text-gold-dark hover:underline"
                    >
                      {row.caseReference}
                    </Link>
                    {row.retrievalRequested && (
                      <span className="mt-1 block text-xs text-amber-800">
                        Retrieval quoted later
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-navy">
                      {row.clientFirstName} {row.clientLastName}
                    </div>
                    <div className="text-xs text-navy/50">{row.clientEmail}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold ${stageTone(stage)}`}
                    >
                      {stage}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 capitalize text-navy/80">
                    {row.status.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3.5 text-navy/55">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {status === "LoadingFirstPage" && (
          <p className="px-4 py-10 text-center text-navy/45">Loading matters…</p>
        )}

        {results?.length === 0 && status !== "LoadingFirstPage" && (
          <p className="px-4 py-10 text-center text-navy/45">No matters yet.</p>
        )}
      </div>

      {status === "CanLoadMore" && (
        <button
          type="button"
          onClick={() => loadMore(20)}
          className="mt-4 border border-navy/15 bg-white px-4 py-2 text-sm font-semibold text-navy hover:border-gold hover:bg-cream"
        >
          Load more
        </button>
      )}
      {status === "LoadingMore" && (
        <p className="mt-4 text-sm text-navy/45">Loading…</p>
      )}
    </div>
  )
}
