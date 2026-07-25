"use client"

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}

export function formatStamp(ms: number | undefined): string {
  if (ms === undefined) return "—"
  return new Date(ms).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export type Stage =
  | "Intake"
  | "Form sent"
  | "Form returned"
  | "Awaiting approval"
  | "Invoice sent"
  | "Paid"
  | "In work"
  | "Delivered"

export function stageForCase(row: {
  status: string
  personalizedFormSentAt?: number
  formReturnedAt?: number
  contractInvoiceSentAt?: number
  paidAt?: number
  draftPackageStatus?: string
}): Stage {
  if (row.status === "delivered") return "Delivered"
  if (row.status === "in_drafting" || row.status === "in_counsel_review") return "In work"
  if (row.paidAt !== undefined) return "Paid"
  if (row.contractInvoiceSentAt !== undefined) return "Invoice sent"
  if (row.draftPackageStatus === "awaiting_ops_approval") return "Awaiting approval"
  if (row.formReturnedAt !== undefined) return "Form returned"
  if (row.personalizedFormSentAt !== undefined) return "Form sent"
  return "Intake"
}

const STAGE_STYLES: Record<Stage, string> = {
  Intake: "border-gray-300 text-gray-600",
  "Form sent": "border-sky-300 text-sky-800",
  "Form returned": "border-sky-400 text-sky-900",
  "Awaiting approval": "border-gold text-navy bg-gold/10",
  "Invoice sent": "border-gold/70 text-navy",
  Paid: "border-brand text-brand-dark bg-brand-light",
  "In work": "border-navy/40 text-navy",
  Delivered: "border-navy bg-navy text-cream",
}

/** Inked-stamp stage chip — bordered small caps, color never the only signal. */
export function StageChip({ stage }: { stage: Stage }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-sm border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${STAGE_STYLES[stage]}`}
    >
      {stage}
    </span>
  )
}

export function StatTile({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail?: string
}) {
  return (
    <div className="border-l-2 border-gold bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold tabular-nums text-navy">{value}</p>
      {detail && <p className="mt-0.5 text-xs text-gray-500">{detail}</p>}
    </div>
  )
}

export function Section({
  title,
  aside,
  children,
}: {
  title: string
  aside?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="border border-gray-200 bg-white shadow-sm">
      <div className="flex items-baseline justify-between gap-4 border-b border-gray-100 px-5 py-3">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-navy">{title}</h2>
        {aside}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  )
}

/** Horizontal count bar — single navy hue; the label carries identity. */
export function CountBarList({
  rows,
  emptyLabel,
}: {
  rows: Array<{ label: string; count: number }>
  emptyLabel: string
}) {
  const max = Math.max(...rows.map((r) => r.count), 1)
  if (rows.length === 0) {
    return <p className="py-2 text-sm text-gray-500">{emptyLabel}</p>
  }
  return (
    <ul className="space-y-2">
      {rows.map((row) => (
        <li key={row.label} className="flex items-center gap-3 text-sm">
          <span className="w-40 shrink-0 truncate text-gray-700" title={row.label}>
            {row.label}
          </span>
          <span className="relative h-3 flex-1 overflow-hidden rounded-sm bg-gray-100">
            <span
              className="absolute inset-y-0 left-0 rounded-sm bg-navy"
              style={{ width: `${Math.max((row.count / max) * 100, 2)}%` }}
            />
          </span>
          <span className="w-10 shrink-0 text-right font-mono text-xs tabular-nums text-navy">
            {row.count}
          </span>
        </li>
      ))}
    </ul>
  )
}
