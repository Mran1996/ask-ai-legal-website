"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

type Props = {
  opsToken: string
  caseId: Id<"cases">
}

const KINDS = ["court", "filing", "hearing", "internal", "other"] as const

const DAY_MS = 24 * 60 * 60 * 1000

function dueTone(dueAt: number, completed: boolean): string {
  if (completed) return "text-gray-400"
  const daysLeft = Math.ceil((dueAt - Date.now()) / DAY_MS)
  if (daysLeft <= 1) return "text-red-700"
  if (daysLeft <= 3) return "text-amber-700"
  return "text-gray-700"
}

export function CaseDeadlines({ opsToken, caseId }: Props) {
  const deadlines = useQuery(api.deadlines.listForCase, { opsToken, caseId })
  const addDeadline = useMutation(api.deadlines.addDeadline)
  const completeDeadline = useMutation(api.deadlines.completeDeadline)
  const deleteDeadline = useMutation(api.deadlines.deleteDeadline)

  const [label, setLabel] = useState("")
  const [date, setDate] = useState("")
  const [kind, setKind] = useState<(typeof KINDS)[number]>("filing")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  return (
    <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-navy">Deadlines</h2>
      <p className="mt-1 text-xs text-gray-500">
        Reminders email/text you 7, 3, and 1 day(s) out (daily check).
      </p>

      {deadlines === undefined ? (
        <p className="mt-4 text-sm text-gray-500">Loading…</p>
      ) : deadlines.length === 0 ? (
        <p className="mt-4 rounded border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
          No deadlines tracked. Add court, filing, or hearing dates below.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {deadlines.map((d) => {
            const completed = d.completedAt !== undefined
            return (
              <li
                key={d.deadlineId}
                className="flex flex-wrap items-center gap-3 rounded border border-gray-100 bg-gray-50 px-4 py-3 text-sm"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={completed}
                    onChange={(e) =>
                      void completeDeadline({
                        opsToken,
                        deadlineId: d.deadlineId,
                        completed: e.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-[#C5A059]"
                  />
                  <span className="sr-only">Mark {d.label} complete</span>
                </label>
                <span
                  className={`font-medium ${completed ? "text-gray-400 line-through" : "text-navy"}`}
                >
                  {d.label}
                </span>
                <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] uppercase tracking-wide text-gray-500">
                  {d.kind}
                </span>
                <span className={`ml-auto font-mono text-xs ${dueTone(d.dueAt, completed)}`}>
                  {new Date(d.dueAt).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <button
                  type="button"
                  aria-label={`Delete deadline ${d.label}`}
                  onClick={() => {
                    if (window.confirm(`Delete deadline "${d.label}"?`)) {
                      void deleteDeadline({ opsToken, deadlineId: d.deadlineId })
                    }
                  }}
                  className="text-xs text-gray-400 underline-offset-2 hover:text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <form
        className="mt-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!label.trim() || !date) {
            setError("Label and date are required")
            return
          }
          setError("")
          setBusy(true)
          void addDeadline({
            opsToken,
            caseId,
            label: label.trim(),
            dueAt: new Date(`${date}T12:00:00`).getTime(),
            kind,
          })
            .then(() => {
              setLabel("")
              setDate("")
            })
            .catch((err) =>
              setError(err instanceof Error ? err.message : "Could not add deadline")
            )
            .finally(() => setBusy(false))
        }}
      >
        <label className="grow">
          <span className="mb-1 block text-xs font-semibold text-gray-500">Deadline</span>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Answer due to court"
            className="w-full rounded border border-gray-200 px-3 py-2.5 text-sm"
          />
        </label>
        <label>
          <span className="mb-1 block text-xs font-semibold text-gray-500">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded border border-gray-200 px-3 py-2.5 text-sm"
          />
        </label>
        <label>
          <span className="mb-1 block text-xs font-semibold text-gray-500">Kind</span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as (typeof KINDS)[number])}
            className="rounded border border-gray-200 px-3 py-2.5 text-sm capitalize"
          >
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded border border-navy bg-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          Add deadline
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  )
}
