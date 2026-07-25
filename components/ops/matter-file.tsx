"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAction, useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import {
  Section,
  StageChip,
  formatStamp,
  formatUsd,
  stageForCase,
} from "@/components/ops/ops-ui"

type Props = {
  opsToken: string
  caseId: Id<"cases">
}

type TabId = "overview" | "documents" | "money" | "communications" | "drafts"

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "documents", label: "Documents" },
  { id: "money", label: "Money" },
  { id: "communications", label: "Communications" },
  { id: "drafts", label: "Drafts" },
]

const NOTIFICATION_LABELS: Record<string, string> = {
  intake_client: "Intake confirmation → client",
  intake_support: "Intake alert → support",
  appointment_booked_support: "Call booked → support",
  delivery_client: "Delivery email → client",
  personalized_form_client: "Part 1 intake form → client",
  quote_contract_invoice_client: "Quote / contract / invoice → client",
  form_received_ack_client: "Form receipt ack → client",
  form_received_support: "Form returned alert → support",
  issues_invoice_client: "Issues + invoice → client",
  draft_package_ops: "Draft ready → ops",
  package_approved_client: "Approved package → client",
  gap_questions_client: "Gap questions → client",
}

export function MatterFile({ opsToken, caseId }: Props) {
  const detail = useQuery(api.cases.getCaseForOps, { opsToken, caseId })
  const markPersonalizedFormSent = useMutation(api.payments.markPersonalizedFormSent)
  const markFormReturned = useMutation(api.payments.markFormReturned)
  const sendFormReceivedAcknowledgment = useMutation(api.payments.sendFormReceivedAcknowledgment)
  const markPaidManual = useMutation(api.payments.markPaidManual)
  const markWorkStarted = useMutation(api.payments.markWorkStarted)
  const markDelivered = useMutation(api.payments.markDelivered)
  const saveDraftPackage = useMutation(api.payments.saveDraftPackage)
  const regenerateDraftPackage = useMutation(api.payments.regenerateDraftPackage)
  const approveAndSendPackage = useMutation(api.payments.approveAndSendPackage)
  const retryCreateOutlookFolder = useMutation(api.payments.retryCreateOutlookFolder)
  const sendGapQuestions = useMutation(api.payments.sendGapQuestions)
  const markGapQuestionsAnswered = useMutation(api.payments.markGapQuestionsAnswered)
  const createStartPaymentLink = useAction(api.stripeActions.createStartPaymentLink)

  const [tab, setTab] = useState<TabId>("overview")
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState("")
  const [paymentLinkUrl, setPaymentLinkUrl] = useState("")
  const [quotedAmountDollars, setQuotedAmountDollars] = useState("499.99")
  const [scopeSummary, setScopeSummary] = useState("")
  const [issuesSummary, setIssuesSummary] = useState("")
  const [timeframe, setTimeframe] = useState("")
  const [gapQuestions, setGapQuestions] = useState("")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (!detail || hydrated) return
    const f = detail.fulfillment
    if (f.draftIssuesSummary) setIssuesSummary(f.draftIssuesSummary)
    if (f.paymentLinkUrl) setPaymentLinkUrl(f.paymentLinkUrl)
    if (f.gapQuestions) setGapQuestions(f.gapQuestions)
    if (f.quotedStartAmountCents !== undefined) {
      setQuotedAmountDollars((f.quotedStartAmountCents / 100).toFixed(2))
    }
    setHydrated(true)
  }, [detail, hydrated])

  useEffect(() => {
    if (!detail?.fulfillment.draftIssuesSummary || !hydrated) return
    if (detail.fulfillment.draftPackageStatus === "awaiting_ops_approval") {
      setIssuesSummary(detail.fulfillment.draftIssuesSummary)
    }
  }, [detail?.fulfillment.draftPackageGeneratedAt, detail?.fulfillment.draftIssuesSummary, detail?.fulfillment.draftPackageStatus, hydrated])

  if (detail === undefined) {
    return <p className="py-16 text-center text-sm text-gray-500">Opening matter file…</p>
  }

  if (detail === null) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <p className="text-gray-600">Matter not found or access denied.</p>
        <Link href="/ops" className="mt-4 inline-block text-navy underline">
          Back to matters
        </Link>
      </div>
    )
  }

  const f = detail.fulfillment
  const paid = f.paidAt !== undefined || detail.payment?.status === "paid"
  const stage = stageForCase({ ...f, status: detail.status })

  const parseQuotedCents = (): number | undefined => {
    const dollars = Number.parseFloat(quotedAmountDollars)
    return Number.isFinite(dollars) ? Math.round(dollars * 100) : undefined
  }

  const runAction = async (fn: () => Promise<unknown>) => {
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

  const timeline: Array<{ label: string; at: number | undefined }> = [
    { label: "Intake", at: detail.createdAt },
    { label: "Part 1 sent", at: f.personalizedFormSentAt },
    { label: "Form returned", at: f.formReturnedAt },
    { label: "Issues drafted", at: f.draftPackageGeneratedAt },
    { label: "Invoice sent", at: f.contractInvoiceSentAt },
    { label: "Paid", at: f.paidAt },
    { label: "Delivered", at: detail.status === "delivered" ? detail.updatedAt : undefined },
  ]

  return (
    <div className="space-y-6">
      {/* Matter header */}
      <header className="border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
          <div>
            <p className="font-mono text-xs font-semibold tracking-wide text-gold-dark">
              {detail.caseReference}
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-navy">
              {detail.client.firstName} {detail.client.lastName}
            </h1>
            <p className="mt-1 text-sm capitalize text-gray-600">
              {detail.matterType.replace(/_/g, " ")} · opened{" "}
              {new Date(detail.createdAt).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StageChip stage={stage} />
            <div className="text-right text-sm">
              <a href={`mailto:${detail.client.email}`} className="block text-navy underline underline-offset-2">
                {detail.client.email}
              </a>
              <span className="block text-gray-500">{detail.client.phone ?? "No phone"}</span>
            </div>
          </div>
        </div>

        {/* Timeline strip */}
        <ol className="flex flex-wrap gap-x-6 gap-y-1 border-t border-gray-100 px-5 py-3">
          {timeline.map((step) => (
            <li key={step.label} className="flex items-center gap-1.5 text-xs">
              <span
                aria-hidden
                className={`inline-block h-2 w-2 rounded-full ${
                  step.at !== undefined ? "bg-gold" : "border border-gray-300 bg-white"
                }`}
              />
              <span className={step.at !== undefined ? "text-navy" : "text-gray-400"}>
                {step.label}
              </span>
              {step.at !== undefined && (
                <span className="font-mono tabular-nums text-gray-400">{formatStamp(step.at)}</span>
              )}
            </li>
          ))}
        </ol>

        {/* Tabs */}
        <nav aria-label="Matter sections" className="flex overflow-x-auto border-t border-gray-200 bg-cream/60">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              className={
                tab === t.id
                  ? "border-b-2 border-gold bg-white px-4 py-2.5 text-sm font-semibold text-navy"
                  : "border-b-2 border-transparent px-4 py-2.5 text-sm text-gray-600 hover:text-navy"
              }
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {actionError && (
        <p role="alert" className="border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {actionError}
        </p>
      )}

      {tab === "overview" && (
        <div className="space-y-6">
          <Section title="Case facts">
            <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
              <FactRow label="Status" value={detail.status.replace(/_/g, " ")} />
              <FactRow label="Case / docket #" value={f.caseNumber ?? "—"} />
              <FactRow
                label="Retrieval requested"
                value={f.retrievalRequested ? "Yes — quote before pulling" : "No"}
              />
              <FactRow label="Outlook folder" value={f.outlookFolderPath ?? "—"} />
              <FactRow
                label="Gap questions"
                value={
                  f.gapQuestionsSentAt === undefined
                    ? "None sent"
                    : f.gapQuestionsAnsweredAt !== undefined
                      ? `Answered ${formatStamp(f.gapQuestionsAnsweredAt)}`
                      : `Sent ${formatStamp(f.gapQuestionsSentAt)} — awaiting reply`
                }
              />
              <FactRow
                label="Included planning calls used"
                value={String(detail.includedPlanningCallsUsed ?? 0)}
              />
            </dl>
          </Section>

          <Section title="Structured intake">
            <pre className="overflow-x-auto bg-cream/80 p-4 font-mono text-xs text-gray-700">
              {JSON.stringify(detail.intakeStructured, null, 2)}
            </pre>
          </Section>

          <Section title="Raw intake">
            <pre className="overflow-x-auto whitespace-pre-wrap bg-cream/80 p-4 font-mono text-xs text-gray-700">
              {detail.intakeRaw}
            </pre>
          </Section>

          <Section title="Scheduled calls">
            {detail.appointments.length === 0 ? (
              <p className="text-sm text-gray-500">No calls booked yet.</p>
            ) : (
              <ul className="space-y-2">
                {detail.appointments.map((appt) => (
                  <li key={appt.appointmentId} className="border border-gray-100 bg-cream/60 px-4 py-2.5 text-sm">
                    <span className="font-medium capitalize text-navy">
                      {appt.callType.replace(/_/g, " ")} · {appt.status}
                    </span>
                    <span className="ml-2 text-gray-600">
                      {new Date(appt.scheduledAt).toLocaleString()}
                      {appt.timezone ? ` (${appt.timezone})` : ""} · {appt.durationMinutes} min
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      )}

      {tab === "documents" && (
        <Section title="Documents on file">
          {detail.documents.length === 0 ? (
            <p className="text-sm text-gray-500">
              No uploads yet. Client uploads from the chat widget land here; drafts appear once
              work starts.
            </p>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 pr-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">File</th>
                  <th className="py-2 pr-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Folder</th>
                  <th className="py-2 pr-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Type</th>
                  <th className="py-2 pr-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {detail.documents.map((doc) => (
                  <tr key={doc.documentId}>
                    <td className="py-2.5 pr-4">
                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-navy underline underline-offset-2"
                        >
                          {doc.fileName}
                        </a>
                      ) : (
                        doc.fileName
                      )}
                    </td>
                    <td className="py-2.5 pr-4 capitalize text-gray-600">{doc.folder.replace(/_/g, " ")}</td>
                    <td className="py-2.5 pr-4 capitalize text-gray-600">{doc.type.replace(/_/g, " ")}</td>
                    <td className="py-2.5 pr-4 capitalize text-gray-600">{doc.status}</td>
                    <td className="whitespace-nowrap py-2.5 font-mono text-xs tabular-nums text-gray-500">
                      {formatStamp(doc.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>
      )}

      {tab === "money" && (
        <div className="space-y-6">
          <Section title="Payment">
            <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
              <FactRow
                label="Start fee quoted"
                value={
                  f.quotedStartAmountCents !== undefined
                    ? formatUsd(f.quotedStartAmountCents)
                    : "$499.99 (default)"
                }
              />
              <FactRow label="Paid" value={f.paidAt !== undefined ? formatStamp(f.paidAt) : "Not yet"} />
              <FactRow
                label="Payment record"
                value={
                  detail.payment
                    ? `${formatUsd(detail.payment.amountCents)} · ${detail.payment.status}`
                    : "No payment row yet"
                }
              />
              <div className="sm:col-span-2">
                <dt className="text-xs text-gray-500">Payment link on file</dt>
                <dd className="break-all font-mono text-xs text-gray-700">{f.paymentLinkUrl ?? "—"}</dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap items-end gap-2 border-t border-gray-100 pt-4">
              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Start amount (USD)
                </span>
                <input
                  value={quotedAmountDollars}
                  onChange={(e) => setQuotedAmountDollars(e.target.value)}
                  inputMode="decimal"
                  className="w-32 rounded-sm border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  void runAction(async () => {
                    const amountCents = parseQuotedCents() ?? 49999
                    const created = await createStartPaymentLink({ opsToken, caseId, amountCents })
                    setPaymentLinkUrl(created.url)
                    setQuotedAmountDollars((created.amountCents / 100).toFixed(2))
                  })
                }
                className="rounded-sm border border-navy px-3 py-2 text-sm font-semibold text-navy disabled:opacity-40"
              >
                Generate Stripe pay link
              </button>
              <button
                type="button"
                disabled={busy || paid}
                onClick={() =>
                  void runAction(() =>
                    markPaidManual({ opsToken, caseId, amountCents: parseQuotedCents() })
                  )
                }
                className="rounded-sm bg-navy px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                Mark paid (manual)
              </button>
              <button
                type="button"
                disabled={busy || !paid}
                onClick={() =>
                  void runAction(() =>
                    retryCreateOutlookFolder({ opsToken, caseId, amountCents: parseQuotedCents() })
                  )
                }
                className="rounded-sm border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:opacity-40"
              >
                Retry Outlook folder
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Contract: paying the invoice accepts the{" "}
              <a
                href="/document-preparation-agreement"
                target="_blank"
                className="text-navy underline underline-offset-2"
              >
                Document Preparation Agreement
              </a>{" "}
              (no refunds). Money before work: start/deliver stays locked until paid.
            </p>
          </Section>

          {detail.estimate && (
            <Section title="Planning estimate">
              <p className="text-sm text-gray-800">{detail.estimate.serviceLine}</p>
              <p className="mt-1.5 text-sm text-gray-600">
                Attorneys typically {formatUsd(detail.estimate.attorneyCompareLowCents)}–
                {formatUsd(detail.estimate.attorneyCompareHighCents)}
                {!detail.estimate.isCustomQuote && (
                  <> · Ask AI Legal {formatUsd(detail.estimate.finalQuoteCents)}</>
                )}
                {detail.estimate.retrievalCostCents > 0 && (
                  <> · Retrieval line {formatUsd(detail.estimate.retrievalCostCents)}</>
                )}
              </p>
            </Section>
          )}
        </div>
      )}

      {tab === "communications" && (
        <div className="space-y-6">
          <Section title="Intake form">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => void runAction(() => markPersonalizedFormSent({ opsToken, caseId }))}
                className="rounded-sm border border-navy px-3 py-2 text-sm font-semibold text-navy disabled:opacity-40"
              >
                Email / resend Part 1 Word form
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  void runAction(() => markFormReturned({ opsToken, caseId, sendAcknowledgment: true }))
                }
                className="rounded-sm border border-navy px-3 py-2 text-sm font-semibold text-navy disabled:opacity-40"
              >
                Mark form returned + send ack
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void runAction(() => sendFormReceivedAcknowledgment({ opsToken, caseId }))}
                className="rounded-sm border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:opacity-40"
              >
                Send receipt acknowledgment
              </button>
            </div>
          </Section>

          <Section
            title="Ask for missing information"
            aside={
              f.gapQuestionsSentAt !== undefined && (
                <span className="text-xs text-gray-500">
                  Last sent {formatStamp(f.gapQuestionsSentAt)}
                  {f.gapQuestionsAnsweredAt !== undefined
                    ? ` · answered ${formatStamp(f.gapQuestionsAnsweredAt)}`
                    : " · awaiting reply"}
                </span>
              )
            }
          >
            <p className="text-xs text-gray-500">
              One question per line. The client gets a branded email asking them to reply with
              answers and any related court papers.
            </p>
            <textarea
              value={gapQuestions}
              onChange={(e) => setGapQuestions(e.target.value)}
              placeholder={"What date were you served?\nDo you have a hearing date?\nAttach the notice you received."}
              rows={5}
              className="mt-2 w-full rounded-sm border border-gray-300 px-3 py-2 text-sm"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy || gapQuestions.trim().length === 0}
                onClick={() =>
                  void runAction(() => sendGapQuestions({ opsToken, caseId, questions: gapQuestions }))
                }
                className="rounded-sm bg-navy px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                Send questions to client
              </button>
              {f.gapQuestionsSentAt !== undefined && f.gapQuestionsAnsweredAt === undefined && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void runAction(() => markGapQuestionsAnswered({ opsToken, caseId }))}
                  className="rounded-sm border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:opacity-40"
                >
                  Mark answered
                </button>
              )}
            </div>
          </Section>

          <Section title="Email log">
            {detail.notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No emails recorded for this matter yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {detail.notifications.map((n) => (
                  <li key={n.notificationId} className="flex items-start justify-between gap-4 py-2 text-sm">
                    <div>
                      <span className="text-gray-800">{NOTIFICATION_LABELS[n.type] ?? n.type}</span>
                      <span className="ml-2 text-xs text-gray-500">{n.recipient}</span>
                      {n.status === "failed" && (
                        <span className="mt-0.5 block text-xs text-red-600">
                          Failed{n.errorMessage ? `: ${n.errorMessage}` : ""}
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 font-mono text-xs tabular-nums text-gray-500">
                      {formatStamp(n.createdAt)}
                      <span
                        className={`ml-2 inline-block h-2 w-2 rounded-full ${
                          n.status === "sent"
                            ? "bg-brand"
                            : n.status === "failed"
                              ? "bg-red-500"
                              : "bg-gray-300"
                        }`}
                        aria-label={n.status}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      )}

      {tab === "drafts" && (
        <div className="space-y-6">
          <Section
            title="Issues draft — human approve before client sees"
            aside={
              f.draftPackageStatus && (
                <span className="text-xs capitalize text-gray-500">
                  {f.draftPackageStatus.replace(/_/g, " ")}
                  {f.draftPackageGeneratedAt ? ` · ${formatStamp(f.draftPackageGeneratedAt)}` : ""}
                </span>
              )
            }
          >
            <p className="text-xs text-gray-500">
              The LLM drafts &ldquo;documents we can prepare&rdquo; after the form returns. Edit
              below, then Approve &amp; send — the client never sees this until you approve.
            </p>
            <textarea
              value={issuesSummary}
              onChange={(e) => setIssuesSummary(e.target.value)}
              placeholder="Documents Ask AI Legal can prepare (edit LLM draft)"
              rows={10}
              className="mt-2 w-full rounded-sm border border-gray-300 px-3 py-2 font-mono text-xs"
            />
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input
                value={paymentLinkUrl}
                onChange={(e) => setPaymentLinkUrl(e.target.value)}
                placeholder="Stripe Checkout / Payment Link URL"
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                placeholder="Timeframe (optional)"
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <textarea
              value={scopeSummary}
              onChange={(e) => setScopeSummary(e.target.value)}
              placeholder="Scope summary (optional)"
              rows={2}
              className="mt-2 w-full rounded-sm border border-gray-300 px-3 py-2 text-sm"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  void runAction(() =>
                    saveDraftPackage({
                      opsToken,
                      caseId,
                      draftIssuesSummary: issuesSummary,
                      quotedStartAmountCents: parseQuotedCents(),
                      paymentLinkUrl: paymentLinkUrl.trim() || undefined,
                    })
                  )
                }
                className="rounded-sm border border-navy px-3 py-2 text-sm font-semibold text-navy disabled:opacity-40"
              >
                Save draft
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void runAction(() => regenerateDraftPackage({ opsToken, caseId }))}
                className="rounded-sm border border-navy px-3 py-2 text-sm font-semibold text-navy disabled:opacity-40"
              >
                Regenerate LLM draft
              </button>
              <button
                type="button"
                disabled={busy || !issuesSummary.trim()}
                onClick={() =>
                  void runAction(() =>
                    approveAndSendPackage({
                      opsToken,
                      caseId,
                      issuesSummary: issuesSummary.trim(),
                      paymentLinkUrl: paymentLinkUrl.trim() || undefined,
                      quotedAmountCents: parseQuotedCents(),
                      scopeSummary: scopeSummary.trim() || undefined,
                      timeframe: timeframe.trim() || undefined,
                    })
                  )
                }
                className="rounded-sm border border-gold bg-gold/20 px-3 py-2 text-sm font-semibold text-navy disabled:opacity-40"
              >
                Approve &amp; send to client
              </button>
            </div>
          </Section>

          <Section title="Document drafting">
            <p className="text-sm text-gray-600">
              Counsel pipeline (research → verify citations → draft) runs after intake, uploads,
              signed contract, and payment. Target ~3 days, then the draft goes to the client for a
              corrections round. Drafted files appear on the Documents tab under{" "}
              <span className="font-mono text-xs">drafts</span>.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy || !paid || detail.status === "delivered"}
                onClick={() => void runAction(() => markWorkStarted({ opsToken, caseId }))}
                className="rounded-sm border border-navy px-3 py-2 text-sm font-semibold text-navy disabled:opacity-40"
              >
                Start drafting now
              </button>
              <button
                type="button"
                disabled={busy || !paid || detail.status === "delivered"}
                onClick={() => void runAction(() => markDelivered({ opsToken, caseId }))}
                className="rounded-sm border border-gold bg-gold/20 px-3 py-2 text-sm font-semibold text-navy disabled:opacity-40"
              >
                Mark delivered (email client)
              </button>
            </div>
            {!paid && (
              <p className="mt-2 text-xs text-gray-500">
                Locked until paid — money before work.
              </p>
            )}
          </Section>
        </div>
      )}
    </div>
  )
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="capitalize text-gray-800">{value}</dd>
    </div>
  )
}
