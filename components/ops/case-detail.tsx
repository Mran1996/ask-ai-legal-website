"use client"

import { useState } from "react"
import Link from "next/link"
import { useMutation, useQuery } from "convex/react"
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
  const markWorkStarted = useMutation(api.payments.markWorkStarted)
  const markDelivered = useMutation(api.payments.markDelivered)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState("")

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

  const retrievalRequested = detail.intakeStructured.retrievalRequested === true
  const paid = detail.payment?.status === "paid"

  const runAction = async (fn: () => Promise<null>) => {
    setActionError("")
    setBusy(true)
    try {
      await fn()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Action failed")
    } finally {
      setBusy(false)
    }
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
        <h2 className="font-semibold text-navy">Fulfillment (pay → work → deliver)</h2>
        <p className="mt-2 text-sm text-gray-600">
          Document generation only — no counsel gate. Do not start work until payment is paid.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy || !paid || detail.status === "delivered"}
            onClick={() =>
              void runAction(() => markWorkStarted({ opsToken, caseId }))
            }
            className="rounded border border-navy bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Mark work started
          </button>
          <button
            type="button"
            disabled={busy || !paid || detail.status === "delivered"}
            onClick={() =>
              void runAction(() => markDelivered({ opsToken, caseId }))
            }
            className="rounded border border-gold bg-gold/20 px-4 py-2 text-sm font-semibold text-navy disabled:opacity-40"
          >
            Mark delivered (email client)
          </button>
        </div>
        {actionError && <p className="mt-2 text-sm text-red-600">{actionError}</p>}
      </section>

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-navy">Client contact</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">Name</dt>
            <dd>
              {detail.client.firstName} {detail.client.lastName}
            </dd>
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
          <div>
            <dt className="text-gray-500">Case / docket #</dt>
            <dd>{detail.intakeStructured.caseNumber ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Retrieval requested</dt>
            <dd>{retrievalRequested ? "Yes (paid add-on)" : "No"}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-lg border border-gold/40 bg-gold/5 p-6">
        <h2 className="font-semibold text-navy">Payment</h2>
        {detail.payment ? (
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-500">Status</dt>
              <dd className="capitalize">{detail.payment.status}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Amount</dt>
              <dd>{formatUsdFromCents(detail.payment.amountCents)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Type</dt>
              <dd>{detail.payment.type}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-2 text-sm text-gray-600">No payment recorded yet.</p>
        )}
        {detail.estimate && (
          <p className="mt-3 text-sm text-gray-700">
            Prep quote:{" "}
            {detail.estimate.isCustomQuote
              ? "custom / case file review start"
              : formatUsdFromCents(detail.estimate.finalQuoteCents)}
            {detail.estimate.retrievalCostCents > 0
              ? ` · Retrieval: ${formatUsdFromCents(detail.estimate.retrievalCostCents)}`
              : ""}
          </p>
        )}
      </section>

      {detail.estimate && (
        <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-navy">Estimate</h2>
          <p className="mt-2 text-sm">{detail.estimate.serviceLine}</p>
          <p className="mt-2 text-sm">
            {detail.estimate.isCustomQuote ? (
              <>
                Attorneys in this area often charge{" "}
                {formatUsdFromCents(detail.estimate.attorneyCompareLowCents)}–
                {formatUsdFromCents(detail.estimate.attorneyCompareHighCents)}. Start price uses
                case file review until package is confirmed.
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
        <h2 className="font-semibold text-navy">Documents attached</h2>
        {detail.documents.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No uploads yet.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {detail.documents.map((doc) => (
              <li key={doc.documentId} className="rounded border border-gray-100 bg-gray-50 px-3 py-2">
                {doc.fileName}{" "}
                <span className="text-gray-500">
                  ({doc.folder} · {doc.status})
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-navy">Call credits</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">Case file review paid</dt>
            <dd>{detail.callCredits.caseFileReviewPaid ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Planning calls left</dt>
            <dd>
              {detail.callCredits.caseFileReviewPaid
                ? detail.callCredits.includedPlanningCallsRemaining
                : "— (after paid start)"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-navy">Scheduled calls</h2>
        {detail.appointments.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No calls booked yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {detail.appointments.map((appt) => (
              <li
                key={appt.appointmentId}
                className="rounded border border-gray-100 bg-gray-50 px-4 py-3 text-sm"
              >
                <p className="font-medium capitalize text-navy">
                  {appt.callType.replace(/_/g, " ")} · {appt.status}
                </p>
                <p className="mt-1 text-gray-600">
                  {new Date(appt.scheduledAt).toLocaleString()}
                  {appt.timezone ? ` (${appt.timezone})` : ""} · {appt.durationMinutes} min
                </p>
                {appt.meetLink && (
                  <a href={appt.meetLink} className="mt-1 inline-block text-navy underline">
                    Meeting link
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

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
