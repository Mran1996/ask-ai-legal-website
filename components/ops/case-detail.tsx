"use client"

import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { formatUsdFromCents } from "@/lib/pricing/ca-eviction"
import { OpsSignOutButton } from "@/components/ops/ops-access-gate"

type Props = {
  opsToken: string
  caseId: Id<"cases">
}

export function CaseDetailView({ opsToken, caseId }: Props) {
  const detail = useQuery(api.cases.getCaseForOps, { opsToken, caseId })

  if (detail === undefined) {
    return <p className="px-4 py-16 text-center text-gray-500">Loading case…</p>
  }

  if (detail === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-gray-600">Case not found or access denied.</p>
        <Link href="/ops/intakes" className="mt-4 inline-block text-navy underline">
          Back to intakes
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/ops/intakes" className="text-sm text-gray-500 hover:text-navy">
            ← All intakes
          </Link>
          <h1 className="mt-2 font-display text-3xl text-navy">{detail.caseReference}</h1>
          <p className="mt-1 text-sm capitalize text-gray-600">
            Status: {detail.status.replace(/_/g, " ")}
          </p>
        </div>
        <OpsSignOutButton />
      </div>

      <section className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-navy">Client contact</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">Name</dt>
            <dd>{detail.client.firstName} {detail.client.lastName}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd>
              <a href={`mailto:${detail.client.email}`} className="text-navy underline">
                {detail.client.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Phone</dt>
            <dd>{detail.client.phone ?? "—"}</dd>
          </div>
        </dl>
      </section>

      {detail.estimate && (
        <section className="mt-6 rounded-lg border border-gold/40 bg-gold/5 p-6">
          <h2 className="font-semibold text-navy">Estimate sent</h2>
          <p className="mt-2 text-sm">{detail.estimate.serviceLine}</p>
          <p className="mt-2 text-sm">
            {detail.estimate.isCustomQuote ? (
              <>
                Attorneys in this area often charge{" "}
                {formatUsdFromCents(detail.estimate.attorneyCompareLowCents)}–
                {formatUsdFromCents(detail.estimate.attorneyCompareHighCents)}. Custom quote
                pending team review.
              </>
            ) : (
              <>
                Attorneys typically {formatUsdFromCents(detail.estimate.attorneyCompareLowCents)}–
                {formatUsdFromCents(detail.estimate.attorneyCompareHighCents)} · Ask AI Legal{" "}
                {formatUsdFromCents(detail.estimate.finalQuoteCents)}
              </>
            )}
          </p>
        </section>
      )}

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-navy">Structured intake</h2>
        <pre className="mt-3 overflow-x-auto rounded bg-gray-50 p-4 text-xs text-gray-700">
          {JSON.stringify(detail.intakeStructured, null, 2)}
        </pre>
      </section>

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-navy">Raw intake</h2>
        <pre className="mt-3 overflow-x-auto rounded bg-gray-50 p-4 text-xs text-gray-700 whitespace-pre-wrap">
          {detail.intakeRaw}
        </pre>
      </section>
    </div>
  )
}
