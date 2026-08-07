"use client"

type TimelineStep = {
  id: string
  label: string
  at?: number
  done: boolean
}

export function MatterTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li
          key={step.id}
          className={`relative border px-3 py-3 ${
            step.done
              ? "border-gold/40 bg-gold/10"
              : "border-navy/10 bg-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center text-[10px] font-bold ${
                step.done
                  ? "bg-navy text-gold"
                  : "bg-navy/5 text-navy/40"
              }`}
            >
              {step.done ? "✓" : String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-xs font-semibold text-navy">{step.label}</p>
          </div>
          <p className="mt-2 text-[11px] text-navy/50">
            {step.at ? new Date(step.at).toLocaleString() : "Pending"}
          </p>
        </li>
      ))}
    </ol>
  )
}
