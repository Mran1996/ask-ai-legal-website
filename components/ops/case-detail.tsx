"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Calendar,
  FileText,
  Mail,
  PenLine,
  Scale,
  Wallet,
} from "lucide-react"
import { useAction, useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { formatUsdFromCents } from "@/lib/pricing/ca-eviction"
import { MatterTimeline } from "@/components/ops/matter-timeline"

type Props = {
  opsToken: string
  caseId: Id<"cases">
}

type MatterTab = "overview" | "documents" | "money" | "communications" | "drafts"

const TABS: Array<{ id: MatterTab; label: string; icon: typeof FileText }> = [
  { id: "overview", label: "Overview", icon: Scale },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "money", label: "Money", icon: Wallet },
  { id: "communications", label: "Communications", icon: Mail },
  { id: "drafts", label: "Drafts", icon: PenLine },
]

function stamp(ms: number | undefined): string {
  if (ms === undefined) return "—"
  return new Date(ms).toLocaleString()
}

function statusTone(status: string): string {
  if (status === "delivered") return "bg-brand/15 text-brand-dark"
  if (status === "in_drafting" || status === "awaiting_docs") return "bg-gold/20 text-gold-dark"
  if (status === "awaiting_payment") return "bg-amber-100 text-amber-900"
  return "bg-navy/5 text-navy/70"
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-navy/40">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-navy">{children}</dd>
    </div>
  )
}

function Panel({
  title,
  children,
  hint,
}: {
  title: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <section className="border border-navy/10 bg-white p-5 sm:p-6">
      <h2 className="font-display text-xl text-navy">{title}</h2>
      {hint && <p className="mt-1 text-xs text-navy/50">{hint}</p>}
      <div className="mt-2 h-px w-12 bg-gold" />
      <div className="mt-4">{children}</div>
    </section>
  )
}

function ActionButton({
  children,
  onClick,
  disabled,
  variant = "secondary",
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: "primary" | "secondary" | "gold" | "ghost"
}) {
  const styles =
    variant === "primary"
      ? "border-navy bg-navy text-cream hover:bg-navy-light"
      : variant === "gold"
        ? "border-gold bg-gold/20 text-navy hover:bg-gold/30"
        : variant === "ghost"
          ? "border-navy/15 bg-transparent text-navy/70 hover:bg-cream"
          : "border-navy/20 bg-white text-navy hover:border-gold"

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`border px-3 py-2 text-sm font-semibold disabled:opacity-40 ${styles}`}
    >
      {children}
    </button>
  )
}

export function CaseDetailView({ opsToken, caseId }: Props) {
  const detail = useQuery(api.cases.getCaseForOps, { opsToken, caseId })
  const markPersonalizedFormSent = useMutation(api.payments.markPersonalizedFormSent)
  const markFormReturned = useMutation(api.payments.markFormReturned)
  const sendFormReceivedAcknowledgment = useMutation(api.payments.sendFormReceivedAcknowledgment)
  const markPaidManual = useMutation(api.payments.markPaidManual)
  const markWorkStarted = useMutation(api.payments.markWorkStarted)
  const markDelivered = useMutation(api.payments.markDelivered)
  const recordCounselDecision = useMutation(api.counselReview.recordCounselDecision)
  const regenerateCaseDraft = useMutation(api.counselReview.regenerateCaseDraft)
  const saveDraftPackage = useMutation(api.payments.saveDraftPackage)
  const regenerateDraftPackage = useMutation(api.payments.regenerateDraftPackage)
  const approveAndSendPackage = useMutation(api.payments.approveAndSendPackage)
  const sendGapQuestions = useMutation(api.payments.sendGapQuestions)
  const markGapQuestionsAnswered = useMutation(api.payments.markGapQuestionsAnswered)
  const retryCreateOutlookFolder = useMutation(api.payments.retryCreateOutlookFolder)
  const createStartPaymentLink = useAction(api.stripeActions.createStartPaymentLink)

  const [tab, setTab] = useState<MatterTab>("overview")
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState("")
  const [paymentLinkUrl, setPaymentLinkUrl] = useState("")
  const [quotedAmountDollars, setQuotedAmountDollars] = useState("499.99")
  const [scopeSummary, setScopeSummary] = useState("")
  const [issuesSummary, setIssuesSummary] = useState("")
  const [timeframe, setTimeframe] = useState("")
  const [counselReviewer, setCounselReviewer] = useState("")
  const [counselNotes, setCounselNotes] = useState("")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (!detail || hydrated) return
    const f = detail.fulfillment
    if (f.draftIssuesSummary) setIssuesSummary(f.draftIssuesSummary)
    if (f.paymentLinkUrl) setPaymentLinkUrl(f.paymentLinkUrl)
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
  }, [
    detail?.fulfillment.draftPackageGeneratedAt,
    detail?.fulfillment.draftIssuesSummary,
    detail?.fulfillment.draftPackageStatus,
    hydrated,
  ])

  const timelineSteps = useMemo(() => {
    if (!detail) return []
    const f = detail.fulfillment
    return [
      { id: "intake", label: "Intake received", at: detail.createdAt, done: true },
      {
        id: "form",
        label: "Part 1 form sent",
        at: f.personalizedFormSentAt,
        done: f.personalizedFormSentAt !== undefined,
      },
      {
        id: "returned",
        label: "Form returned",
        at: f.formReturnedAt,
        done: f.formReturnedAt !== undefined,
      },
      {
        id: "gaps",
        label: "Gap questions",
        at: f.gapQuestionsSentAt,
        done:
          f.gapQuestionsStatus === "sent" ||
          f.gapQuestionsStatus === "answered" ||
          f.gapQuestionsStatus === "none_needed",
      },
      {
        id: "draft",
        label: "Issues draft ready",
        at: f.draftPackageGeneratedAt,
        done: f.draftPackageGeneratedAt !== undefined,
      },
      {
        id: "contract",
        label: "Contract / invoice sent",
        at: f.contractInvoiceSentAt,
        done: f.contractInvoiceSentAt !== undefined,
      },
      {
        id: "paid",
        label: "Paid $499",
        at: f.paidAt,
        done: f.paidAt !== undefined,
      },
      {
        id: "work",
        label: "Document draft",
        at: detail.agentRuns.find((r) => r.agentType === "drafting" && r.status === "completed")
          ?.createdAt,
        done: detail.status === "in_counsel_review" || detail.status === "delivered",
      },
      {
        id: "counsel",
        label: "Counsel approved",
        at: detail.counselReviews.find((r) => r.decision === "approved")?.reviewedAt,
        done: detail.counselReviews.some((r) => r.decision === "approved"),
      },
      {
        id: "outlook",
        label: "Outlook folder",
        at: f.outlookFolderCreatedAt,
        done: f.outlookFolderCreatedAt !== undefined,
      },
      {
        id: "delivered",
        label: "Delivered",
        at: detail.status === "delivered" ? detail.updatedAt : undefined,
        done: detail.status === "delivered",
      },
    ]
  }, [detail])

  const pendingCounselReview = detail?.counselReviews.find((r) => r.decision === "pending")

  if (detail === undefined) {
    return <p className="py-16 text-center text-navy/45">Loading matter…</p>
  }

  if (detail === null) {
    return (
      <div className="py-12 text-center">
        <p className="text-navy/65">Case not found or access denied.</p>
        <Link
          href="/ops/intakes"
          className="mt-4 inline-block text-sm font-semibold text-navy underline"
        >
          Back to matters
        </Link>
      </div>
    )
  }

  const f = detail.fulfillment
  const paid = f.paidAt !== undefined || detail.payment?.status === "paid"
  const part1Sent = f.personalizedFormSentAt !== undefined
  const part1Returned = f.formReturnedAt !== undefined
  const canSendQuoteEmail = part1Sent && part1Returned && paymentLinkUrl.trim().length > 0
  const quoteEmailBlockReason = !part1Sent
    ? "Send Part 1 intake form before emailing quote/invoice."
    : !part1Returned
      ? "Mark Part 1 returned before emailing quote/invoice."
      : !paymentLinkUrl.trim()
        ? "Generate or paste a Stripe payment link first."
        : null

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

  const nextHint = !f.personalizedFormSentAt
    ? "Next: email Part 1 intake form"
    : !f.formReturnedAt
      ? "Next: wait for form return (or mark returned)"
      : !f.contractInvoiceSentAt
        ? "Next: approve issues + send contract / pay link"
        : !paid
          ? "Next: client payment ($499) or mark paid"
          : detail.status === "in_drafting"
            ? "Next: drafting in progress (or regenerate draft)"
            : detail.status === "in_counsel_review"
              ? "Next: counsel must approve before delivery"
              : detail.status !== "delivered"
                ? "Next: start work to auto-generate draft, then counsel gate"
                : "Matter delivered"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/ops/intakes"
          className="text-xs font-semibold uppercase tracking-wider text-navy/45 hover:text-gold-dark"
        >
          ← All matters
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl text-navy sm:text-4xl">
                {detail.caseReference}
              </h1>
              <span
                className={`px-2 py-0.5 text-xs font-semibold capitalize ${statusTone(detail.status)}`}
              >
                {detail.status.replace(/_/g, " ")}
              </span>
            </div>
            <p className="mt-2 text-sm text-navy/70">
              {detail.client.firstName} {detail.client.lastName}
              <span className="text-navy/30"> · </span>
              <a href={`mailto:${detail.client.email}`} className="underline-offset-2 hover:underline">
                {detail.client.email}
              </a>
              {detail.client.phone && (
                <>
                  <span className="text-navy/30"> · </span>
                  {detail.client.phone}
                </>
              )}
            </p>
            <p className="mt-1 text-xs text-gold-dark">{nextHint}</p>
          </div>
          <div className="text-right text-xs text-navy/45">
            <p>Opened {stamp(detail.createdAt)}</p>
            <p className="mt-1 capitalize">
              Matter: {detail.matterType.replace(/_/g, " ")}
            </p>
          </div>
        </div>
        <div className="mt-4 h-px w-16 bg-gold" />
      </div>

      {/* Timeline */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-navy/45">
          Matter timeline
        </p>
        <MatterTimeline steps={timelineSteps} />
      </div>

      {/* One-click toolbar */}
      <div className="sticky top-0 z-10 border border-navy/10 bg-cream/95 p-3 backdrop-blur sm:p-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-navy/40">
          One-click actions
        </p>
        <div className="flex flex-wrap gap-2">
          <ActionButton
            disabled={busy}
            onClick={() => void runAction(() => markPersonalizedFormSent({ opsToken, caseId }))}
          >
            Send Part 1 form
          </ActionButton>
          <ActionButton
            disabled={busy}
            onClick={() =>
              void runAction(() =>
                markFormReturned({ opsToken, caseId, sendAcknowledgment: true })
              )
            }
          >
            Form returned + ack
          </ActionButton>
          <ActionButton
            disabled={busy}
            onClick={() => void runAction(() => sendGapQuestions({ opsToken, caseId }))}
          >
            Send gap questions
          </ActionButton>
          <ActionButton
            disabled={busy}
            onClick={() => void runAction(() => regenerateDraftPackage({ opsToken, caseId }))}
          >
            Regenerate issues draft
          </ActionButton>
          <ActionButton
            variant="gold"
            disabled={busy || !canSendQuoteEmail}
            onClick={() =>
              void runAction(() =>
                approveAndSendPackage({
                  opsToken,
                  caseId,
                  issuesSummary: issuesSummary.trim() || undefined,
                  paymentLinkUrl: paymentLinkUrl.trim() || undefined,
                  quotedAmountCents: parseQuotedCents(),
                  scopeSummary: scopeSummary.trim() || undefined,
                  timeframe: timeframe.trim() || undefined,
                })
              )
            }
          >
            Approve &amp; send contract
          </ActionButton>
          <ActionButton
            variant="primary"
            disabled={busy || paid}
            onClick={() =>
              void runAction(() =>
                markPaidManual({
                  opsToken,
                  caseId,
                  amountCents: parseQuotedCents(),
                })
              )
            }
          >
            Mark paid
          </ActionButton>
          <ActionButton
            disabled={busy || !paid || detail.status === "delivered"}
            onClick={() => void runAction(() => markWorkStarted({ opsToken, caseId }))}
          >
            Start work (auto-draft)
          </ActionButton>
          <ActionButton
            variant="gold"
            disabled={busy || !paid || detail.status === "delivered"}
            onClick={() => void runAction(() => markDelivered({ opsToken, caseId }))}
          >
            Mark delivered
          </ActionButton>
        </div>
        {actionError && <p className="mt-2 text-sm text-red-700">{actionError}</p>}
        {quoteEmailBlockReason && (
          <p className="mt-2 text-sm text-amber-800">{quoteEmailBlockReason}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-navy/10">
        <nav className="-mb-px flex flex-wrap gap-1" aria-label="Matter sections">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "border-gold text-navy"
                    : "border-transparent text-navy/45 hover:text-navy"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {label}
                {id === "documents" && detail.documents.length > 0 && (
                  <span className="bg-navy/5 px-1.5 text-[10px] text-navy/60">
                    {detail.documents.length}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab panels */}
      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Client & parties">
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                {detail.client.firstName} {detail.client.lastName}
              </Field>
              <Field label="Email">
                <a href={`mailto:${detail.client.email}`} className="underline">
                  {detail.client.email}
                </a>
              </Field>
              <Field label="Phone">{detail.client.phone ?? "—"}</Field>
              <Field label="Role">{detail.intakeStructured.role ?? "—"}</Field>
              <Field label="Opposing party">
                {detail.intakeStructured.opposingParty ?? "—"}
              </Field>
              <Field label="County">{detail.intakeStructured.county ?? "—"}</Field>
              <Field label="Case #">{detail.intakeStructured.caseNumber ?? "—"}</Field>
              <Field label="Service needed">
                {detail.intakeStructured.serviceNeeded ?? "—"}
              </Field>
            </dl>
            {detail.intakeStructured.issueSummary && (
              <div className="mt-5 border-t border-navy/8 pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-navy/40">
                  Issue summary
                </p>
                <p className="mt-2 text-sm leading-relaxed text-navy/80">
                  {detail.intakeStructured.issueSummary}
                </p>
              </div>
            )}
          </Panel>

          <Panel title="Deadlines & filing">
            {detail.deadlines.length === 0 ? (
              <p className="text-sm text-navy/45">No deadlines tracked yet.</p>
            ) : (
              <ul className="space-y-2">
                {detail.deadlines.map((d) => (
                  <li
                    key={d.deadlineId}
                    className="flex flex-wrap items-center gap-2 border border-navy/8 bg-cream/60 px-3 py-2 text-sm"
                  >
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        d.completedAt
                          ? "bg-brand/15 text-brand-dark"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {d.kind}
                    </span>
                    <span className="flex-1 font-medium text-navy">{d.label}</span>
                    <span className="text-navy/50">
                      {new Date(d.dueAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {detail.intakeStructured.knownDates && (
              <p className="mt-3 text-xs text-navy/50">
                Client-reported: {detail.intakeStructured.knownDates}
              </p>
            )}
          </Panel>

          <Panel title="Fulfillment snapshot" hint="Full actions stay in the toolbar and Drafts tab.">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <Field label="Part 1 sent">{stamp(f.personalizedFormSentAt)}</Field>
              <Field label="Form returned">{stamp(f.formReturnedAt)}</Field>
              <Field label="Ack emailed">{stamp(f.formReceivedAckSentAt)}</Field>
              <Field label="Contract sent">{stamp(f.contractInvoiceSentAt)}</Field>
              <Field label="Paid">{stamp(f.paidAt)}</Field>
              <Field label="Outlook">{f.outlookFolderPath ?? "—"}</Field>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionButton
                disabled={busy}
                onClick={() =>
                  void runAction(() => sendFormReceivedAcknowledgment({ opsToken, caseId }))
                }
              >
                Resend receipt ack
              </ActionButton>
              <ActionButton
                disabled={busy || !paid}
                onClick={() =>
                  void runAction(() =>
                    retryCreateOutlookFolder({
                      opsToken,
                      caseId,
                      amountCents: parseQuotedCents(),
                    })
                  )
                }
              >
                Retry Outlook folder
              </ActionButton>
            </div>
          </Panel>

          <Panel title="Call credits">
            <dl className="grid gap-3 sm:grid-cols-2">
              <Field label="File review deposit paid">
                {detail.callCredits.caseFileReviewPaid ? "Yes" : "No"}
              </Field>
              <Field label="Planning calls left">
                {detail.callCredits.includedPlanningCallsRemaining}
              </Field>
            </dl>
            {detail.appointments.length > 0 && (
              <ul className="mt-4 space-y-2">
                {detail.appointments.slice(0, 3).map((appt) => (
                  <li
                    key={appt.appointmentId}
                    className="flex items-center gap-2 border border-navy/8 px-3 py-2 text-sm"
                  >
                    <Calendar className="h-3.5 w-3.5 text-gold" aria-hidden />
                    <span className="capitalize">
                      {appt.callType.replace(/_/g, " ")} · {appt.status}
                    </span>
                    <span className="ml-auto text-xs text-navy/45">
                      {new Date(appt.scheduledAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}

      {tab === "documents" && (
        <Panel
          title="Documents & exhibits"
          hint="Client uploads and generated files for this matter."
        >
          {detail.documents.length === 0 ? (
            <p className="text-sm text-navy/45">No uploads yet.</p>
          ) : (
            <ul className="divide-y divide-navy/8 border border-navy/8">
              {detail.documents.map((doc) => (
                <li
                  key={doc.documentId}
                  className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm"
                >
                  <FileText className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                  <div className="min-w-0 flex-1">
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-navy underline-offset-2 hover:underline"
                      >
                        {doc.fileName}
                      </a>
                    ) : (
                      <span className="font-semibold text-navy">{doc.fileName}</span>
                    )}
                    <p className="text-xs text-navy/45">
                      {doc.type.replace(/_/g, " ")} · {doc.folder} · {doc.status} ·{" "}
                      {stamp(doc.createdAt)}
                    </p>
                  </div>
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold uppercase tracking-wider text-gold-dark hover:underline"
                    >
                      Open
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}

      {tab === "money" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Money ledger">
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Quoted total">
                <span className="font-display text-2xl">
                  {formatUsdFromCents(detail.money.quotedTotalCents)}
                </span>
              </Field>
              <Field label="Deposit ($499)">
                {formatUsdFromCents(detail.money.depositAmountCents)}
              </Field>
              <Field label="Referral discount">
                {formatUsdFromCents(detail.money.referralDiscountCents)}
              </Field>
              <Field label="Total paid">
                <span className="font-semibold text-brand-dark">
                  {formatUsdFromCents(detail.money.totalPaidCents)}
                </span>
              </Field>
              <Field label="Balance remaining">
                <span
                  className={
                    detail.money.balanceRemainingCents > 0
                      ? "font-semibold text-red-700"
                      : "text-brand-dark"
                  }
                >
                  {formatUsdFromCents(detail.money.balanceRemainingCents)}
                </span>
              </Field>
              <Field label="Stripe session">
                <span className="break-all text-xs">
                  {detail.money.stripeCheckoutSessionId ?? "—"}
                </span>
              </Field>
            </dl>
            {detail.payment && (
              <p className="mt-4 text-xs text-navy/50">
                Latest payment: {detail.payment.status} ·{" "}
                {formatUsdFromCents(detail.payment.amountCents)} ·{" "}
                {stamp(detail.payment.createdAt)}
              </p>
            )}
          </Panel>

          <Panel title="Quote / estimate">
            {detail.estimate ? (
              <>
                <p className="text-sm font-medium text-navy">{detail.estimate.serviceLine}</p>
                <p className="mt-2 text-sm text-navy/70">
                  Attorneys typically{" "}
                  {formatUsdFromCents(detail.estimate.attorneyCompareLowCents)}–
                  {formatUsdFromCents(detail.estimate.attorneyCompareHighCents)}
                  {!detail.estimate.isCustomQuote && (
                    <>
                      {" "}
                      · Our quote {formatUsdFromCents(detail.estimate.finalQuoteCents)}
                    </>
                  )}
                  {detail.estimate.retrievalCostCents > 0 && (
                    <>
                      {" "}
                      · Retrieval {formatUsdFromCents(detail.estimate.retrievalCostCents)}
                    </>
                  )}
                </p>
              </>
            ) : (
              <p className="text-sm text-navy/45">No estimate on file.</p>
            )}

            {detail.referrals.length > 0 && (
              <ul className="mt-4 space-y-2 border-t border-navy/8 pt-4">
                {detail.referrals.map((r) => (
                  <li key={r.referralId} className="text-sm text-navy/70">
                    Code <span className="font-mono font-semibold">{r.code}</span>
                    {r.source && <> · {r.source}</>} ·{" "}
                    {formatUsdFromCents(r.discountCents)}
                    {r.applied ? " ✓" : " (pending)"}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}

      {tab === "communications" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel
            title="Gap questions (auto email)"
            hint="After Part 1 return we email missing-info questions when the file is incomplete. Client replies by email."
          >
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-navy/40">
                  Status
                </dt>
                <dd className="mt-1 font-medium text-navy">
                  {detail.fulfillment.gapQuestionsStatus?.replace(/_/g, " ") ?? "not assessed"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-navy/40">
                  Sent
                </dt>
                <dd className="mt-1 text-navy/70">
                  {detail.fulfillment.gapQuestionsSentAt
                    ? stamp(detail.fulfillment.gapQuestionsSentAt)
                    : "—"}
                </dd>
              </div>
            </dl>
            {detail.fulfillment.gapQuestionsSummary ? (
              <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap bg-cream p-3 text-xs text-navy/80">
                {detail.fulfillment.gapQuestionsSummary}
              </pre>
            ) : (
              <p className="mt-3 text-sm text-navy/45">No gap questions on file yet.</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionButton
                disabled={busy}
                onClick={() => void runAction(() => sendGapQuestions({ opsToken, caseId }))}
              >
                Assess &amp; send / resend
              </ActionButton>
              <ActionButton
                disabled={busy || detail.fulfillment.gapQuestionsStatus !== "sent"}
                onClick={() =>
                  void runAction(() => markGapQuestionsAnswered({ opsToken, caseId }))
                }
              >
                Mark answered
              </ActionButton>
            </div>
          </Panel>

          <Panel title="Scheduled calls">
            {detail.appointments.length === 0 ? (
              <p className="text-sm text-navy/45">No calls booked yet.</p>
            ) : (
              <ul className="space-y-3">
                {detail.appointments.map((appt) => (
                  <li
                    key={appt.appointmentId}
                    className="border border-navy/8 bg-cream/50 px-4 py-3 text-sm"
                  >
                    <p className="font-medium capitalize text-navy">
                      {appt.callType.replace(/_/g, " ")} · {appt.status}
                    </p>
                    <p className="mt-1 text-navy/60">
                      {new Date(appt.scheduledAt).toLocaleString()}
                      {appt.timezone ? ` (${appt.timezone})` : ""} · {appt.durationMinutes}{" "}
                      min
                    </p>
                    {appt.meetLink && (
                      <a
                        href={appt.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-xs font-semibold text-gold-dark underline"
                      >
                        Join link
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Agent / workflow log" hint="Audit trail of automated runs on this matter.">
            {detail.agentRuns.length === 0 ? (
              <p className="text-sm text-navy/45">No agent runs recorded.</p>
            ) : (
              <ul className="space-y-2">
                {detail.agentRuns.map((ar) => (
                  <li
                    key={ar.agentRunId}
                    className="flex flex-wrap items-center gap-2 border border-navy/8 px-3 py-2 text-sm"
                  >
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        ar.status === "completed"
                          ? "bg-brand/15 text-brand-dark"
                          : ar.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-navy/5 text-navy/70"
                      }`}
                    >
                      {ar.agentType}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs text-navy/55">
                      {ar.inputRef} → {ar.outputRef}
                    </span>
                    <span className="text-xs text-navy/40">{stamp(ar.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <div className="lg:col-span-2">
            <Panel title="Intake audit">
              <details className="group">
                <summary className="cursor-pointer text-sm font-semibold text-navy">
                  Structured intake (JSON)
                </summary>
                <pre className="mt-3 overflow-x-auto bg-cream p-4 text-xs text-navy/80">
                  {JSON.stringify(detail.intakeStructured, null, 2)}
                </pre>
              </details>
              <details className="group mt-4">
                <summary className="cursor-pointer text-sm font-semibold text-navy">
                  Raw intake
                </summary>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap bg-cream p-4 text-xs text-navy/80">
                  {detail.intakeRaw}
                </pre>
              </details>
            </Panel>
          </div>
        </div>
      )}

      {tab === "drafts" && (
        <div className="space-y-4">
          <Panel
            title="Internal ops draft (NOT emailed to client)"
            hint="LLM drafts after form return for your review only. Approve & send emails the short quote + pay link — not this text."
          >
            <div className="space-y-3">
              <textarea
                value={issuesSummary}
                onChange={(e) => setIssuesSummary(e.target.value)}
                placeholder="Internal notes: documents we could prepare, missing docs, etc. (never sent to client)"
                rows={10}
                className="w-full border border-navy/15 bg-cream/40 px-3 py-2 font-mono text-xs text-navy focus:border-gold focus:outline-none"
              />
              <input
                value={paymentLinkUrl}
                onChange={(e) => setPaymentLinkUrl(e.target.value)}
                placeholder="Stripe Checkout / Payment Link URL"
                className="w-full border border-navy/15 px-3 py-2 text-sm focus:border-gold focus:outline-none"
              />
              <input
                value={quotedAmountDollars}
                onChange={(e) => setQuotedAmountDollars(e.target.value)}
                placeholder="Start amount USD (e.g. 499.99)"
                className="w-full border border-navy/15 px-3 py-2 text-sm focus:border-gold focus:outline-none"
              />
              <textarea
                value={scopeSummary}
                onChange={(e) => setScopeSummary(e.target.value)}
                placeholder="Scope summary (optional)"
                rows={2}
                className="w-full border border-navy/15 px-3 py-2 text-sm focus:border-gold focus:outline-none"
              />
              <input
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                placeholder="Timeframe (optional)"
                className="w-full border border-navy/15 px-3 py-2 text-sm focus:border-gold focus:outline-none"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                <ActionButton
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
                >
                  Save draft
                </ActionButton>
                <ActionButton
                  disabled={busy}
                  onClick={() =>
                    void runAction(() => regenerateDraftPackage({ opsToken, caseId }))
                  }
                >
                  Regenerate LLM draft
                </ActionButton>
                <ActionButton
                  disabled={busy}
                  onClick={() =>
                    void runAction(async () => {
                      const amountCents = parseQuotedCents() ?? 49999
                      const created = await createStartPaymentLink({
                        opsToken,
                        caseId,
                        amountCents,
                      })
                      setPaymentLinkUrl(created.url)
                      setQuotedAmountDollars((created.amountCents / 100).toFixed(2))
                    })
                  }
                >
                  Generate Stripe pay link
                </ActionButton>
                <ActionButton
                  variant="gold"
                  disabled={busy || !canSendQuoteEmail}
                  onClick={() =>
                    void runAction(() =>
                      approveAndSendPackage({
                        opsToken,
                        caseId,
                        issuesSummary: issuesSummary.trim() || undefined,
                        paymentLinkUrl: paymentLinkUrl.trim() || undefined,
                        quotedAmountCents: parseQuotedCents(),
                        scopeSummary: scopeSummary.trim() || undefined,
                        timeframe: timeframe.trim() || undefined,
                      })
                    )
                  }
                >
                  Approve &amp; send (requires pay link)
                </ActionButton>
              </div>
              {quoteEmailBlockReason && (
                <p className="text-sm text-amber-800">{quoteEmailBlockReason}</p>
              )}
              <p className="text-xs text-navy/45">
                Agreement link included: /document-preparation-agreement (pay = accept). Draft
                status:{" "}
                {f.draftPackageStatus?.replace(/_/g, " ") ?? "none"} · Generated{" "}
                {stamp(f.draftPackageGeneratedAt)}
              </p>
            </div>
          </Panel>

          <Panel
            title="Counsel review"
            hint="No final document can be delivered until a licensed human attorney approves it."
          >
            {detail.counselReviews.length === 0 ? (
              <p className="text-sm text-navy/45">
                No reviews yet. Submit a document for counsel review before delivery.
              </p>
            ) : (
              <ul className="space-y-2">
                {detail.counselReviews.map((cr) => (
                  <li
                    key={cr.reviewId}
                    className="border border-navy/8 bg-cream/50 px-3 py-2 text-sm"
                  >
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        cr.decision === "approved"
                          ? "bg-brand/15 text-brand-dark"
                          : cr.decision === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {cr.decision}
                    </span>{" "}
                    by {cr.reviewerId}
                    {cr.reviewedAt ? ` · ${stamp(cr.reviewedAt)}` : ""}
                    {cr.notes && (
                      <p className="mt-1 text-xs text-navy/60">{cr.notes}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}
    </div>
  )
}
