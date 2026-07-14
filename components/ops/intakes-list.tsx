"use client"

import Link from "next/link"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { OpsSignOutButton } from "@/components/ops/ops-access-gate"

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

export function IntakesList({ opsToken }: Props) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.cases.listRecentIntakes,
    { opsToken },
    { initialNumItems: 20 }
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-navy">Intake submissions</h1>
          <p className="mt-1 text-sm text-gray-600">
            Email funnel: intake → personalized form → quote/contract/invoice → paid → work → deliver.
          </p>
        </div>
        <OpsSignOutButton />
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Reference</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Client</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Funnel stage</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {results?.map((row) => (
              <tr key={row.caseId} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/ops/intakes/${row.caseId}`}
                    className="font-mono font-semibold text-navy hover:underline"
                  >
                    {row.caseReference}
                  </Link>
                  {row.retrievalRequested && (
                    <span className="mt-1 block text-xs text-amber-700">Retrieval quoted later</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div>
                    {row.clientFirstName} {row.clientLastName}
                  </div>
                  <div className="text-xs text-gray-500">{row.clientEmail}</div>
                </td>
                <td className="px-4 py-3 text-gray-800">{stageLabel(row)}</td>
                <td className="px-4 py-3 capitalize">{row.status.replace(/_/g, " ")}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(row.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {results?.length === 0 && status !== "LoadingFirstPage" && (
          <p className="px-4 py-8 text-center text-gray-500">No intakes yet.</p>
        )}
      </div>

      {status === "CanLoadMore" && (
        <button
          type="button"
          onClick={() => loadMore(20)}
          className="mt-4 rounded-sm border border-gray-300 px-4 py-2 text-sm font-semibold text-navy hover:bg-gray-50"
        >
          Load more
        </button>
      )}
      {status === "LoadingMore" && (
        <p className="mt-4 text-sm text-gray-500">Loading…</p>
      )}
    </div>
  )
}
