"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import {
  CountBarList,
  Section,
  StatTile,
  formatUsd,
} from "@/components/ops/ops-ui"

type Props = {
  opsToken: string
}

export function InsightsPanel({ opsToken }: Props) {
  const data = useQuery(api.insights.summary, { opsToken })

  if (data === undefined) {
    return <p className="py-16 text-center text-sm text-gray-500">Compiling insights…</p>
  }

  const conversion =
    data.traffic.uniqueSessions > 0
      ? `${((data.money.paidWindowCount / data.traffic.uniqueSessions) * 100).toFixed(1)}%`
      : "—"

  return (
    <div className="space-y-6">
      <p className="text-xs text-gray-500">
        Last {data.windowDays} days · counts and topics only — client document text stays on the
        matter file.
      </p>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Paid, last 7 days"
          value={formatUsd(data.money.paidLast7DaysCents)}
          detail={`${formatUsd(data.money.paidWindowCents)} in ${data.windowDays}d`}
        />
        <StatTile
          label="Page views"
          value={String(data.traffic.pageViews)}
          detail={`${data.traffic.uniqueSessions} sessions`}
        />
        <StatTile label="Visit → paid" value={conversion} detail="Sessions that became paid matters" />
        <StatTile
          label="Avg time to pay"
          value={
            data.money.avgTimeToPayHours === null ? "—" : `${data.money.avgTimeToPayHours}h`
          }
          detail="Invoice sent → paid"
        />
      </div>

      <Section title="Traffic — page views per day">
        <ViewsByDayChart rows={data.traffic.viewsByDay} />
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Funnel">
          <CountBarList
            rows={data.funnel.map((f) => ({ label: f.stage, count: f.count }))}
            emptyLabel="No funnel activity yet."
          />
        </Section>
        <Section title="CTA clicks">
          <CountBarList
            rows={data.clicks}
            emptyLabel="No CTA clicks recorded yet — clicks appear once visitors use the site."
          />
        </Section>
        <Section title="Top pages">
          <CountBarList rows={data.traffic.topPaths} emptyLabel="No page views recorded yet." />
        </Section>
        <Section title="Referrers">
          <CountBarList
            rows={data.traffic.topReferrers}
            emptyLabel="No external referrers yet."
          />
        </Section>
        <Section title="Top research — case types">
          <CountBarList
            rows={data.research.caseTypes}
            emptyLabel="Case types appear as intakes arrive."
          />
        </Section>
        <Section title="Languages & chat">
          <CountBarList rows={data.research.languages} emptyLabel="No language selections yet." />
          <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-sm">
            <div>
              <dt className="text-xs text-gray-500">Chat opens</dt>
              <dd className="font-mono tabular-nums text-navy">{data.research.chatOpens}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Chat messages</dt>
              <dd className="font-mono tabular-nums text-navy">{data.research.chatMessages}</dd>
            </div>
          </dl>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Devices">
          <CountBarList rows={data.traffic.devices} emptyLabel="No device data yet." />
        </Section>
        <Section title="Ops health">
          <dl className="space-y-2 text-sm">
            <HealthRow label="Drafts awaiting approval" value={data.opsHealth.draftsAwaitingApproval} />
            <HealthRow label="Gap questions unanswered" value={data.opsHealth.gapQuestionsUnanswered} />
            <HealthRow label="Forms sent, not returned" value={data.opsHealth.formsOutstanding} />
            <HealthRow label="Unpaid contracts" value={data.money.unpaidContracts} />
            <HealthRow label={`Delivered in ${data.windowDays}d`} value={data.opsHealth.deliveredWindow} />
          </dl>
        </Section>
        <Section title="Cases by status">
          <CountBarList rows={data.opsHealth.casesByStatus} emptyLabel="No cases yet." />
        </Section>
      </div>
    </div>
  )
}

function HealthRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 last:border-b-0">
      <dt className="text-gray-700">{label}</dt>
      <dd className="font-mono tabular-nums text-navy">{value}</dd>
    </div>
  )
}

function ViewsByDayChart({ rows }: { rows: Array<{ day: string; count: number }> }) {
  const max = Math.max(...rows.map((r) => r.count), 1)
  const total = rows.reduce((sum, r) => sum + r.count, 0)
  const chartHeight = 120
  const barGap = 2

  if (total === 0) {
    return (
      <p className="py-6 text-sm text-gray-500">
        No page views recorded yet. Views are counted automatically once the site is visited with
        analytics deployed.
      </p>
    )
  }

  return (
    <figure>
      <svg
        viewBox={`0 0 ${rows.length * 24} ${chartHeight + 18}`}
        className="h-40 w-full"
        role="img"
        aria-label={`Page views per day for the last ${rows.length} days, ${total} total`}
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1={chartHeight + 0.5}
          x2={rows.length * 24}
          y2={chartHeight + 0.5}
          stroke="#d1d5db"
          strokeWidth="1"
        />
        {rows.map((row, i) => {
          const height = Math.max((row.count / max) * (chartHeight - 8), row.count > 0 ? 3 : 0)
          return (
            <g key={row.day}>
              <rect
                x={i * 24 + barGap}
                y={chartHeight - height}
                width={24 - barGap * 2}
                height={height}
                rx="2"
                fill="#0c1929"
              >
                <title>{`${row.day}: ${row.count} views`}</title>
              </rect>
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-1 flex justify-between text-[11px] text-gray-500">
        <span>{rows[0]?.day}</span>
        <span>{total} views</span>
        <span>{rows[rows.length - 1]?.day}</span>
      </figcaption>
      <table className="sr-only">
        <caption>Page views per day</caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>Views</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.day}>
              <td>{row.day}</td>
              <td>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
