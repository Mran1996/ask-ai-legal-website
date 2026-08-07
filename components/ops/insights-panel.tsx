"use client"

import {
  Clock3,
  FileSearch,
  MessageSquare,
  MousePointerClick,
  TrendingUp,
  Users,
} from "lucide-react"

const KPI_PLACEHOLDERS = [
  {
    label: "Visitors (7d)",
    value: "—",
    hint: "Site sessions",
    icon: Users,
  },
  {
    label: "Chat opens",
    value: "—",
    hint: "Widget opened",
    icon: MessageSquare,
  },
  {
    label: "Quote submits",
    value: "—",
    hint: "Intake created",
    icon: FileSearch,
  },
  {
    label: "Paid $499",
    value: "—",
    hint: "Case file review",
    icon: TrendingUp,
  },
] as const

const FUNNEL_STEPS = [
  "Visit site",
  "Open chat",
  "Submit intake",
  "Form returned",
  "Contract + pay",
  "Draft delivered",
] as const

const TRACKING_ROADMAP = [
  {
    title: "Website behavior",
    items: [
      "Page views, entry/exit pages",
      "CTA clicks (chat, quote, book, pay)",
      "Scroll depth on long pages",
      "Device, referrer, coarse geo",
    ],
  },
  {
    title: "Product research",
    items: [
      "Top chat topics & FAQ hits",
      "Case types selected most often",
      "Languages chosen",
      "Intake drop-off by field",
    ],
  },
  {
    title: "Money & ops health",
    items: [
      "Funnel conversion at each step",
      "Time-to-pay after contract sent",
      "Drafts due in 24h / gap emails unanswered",
      "Revenue by week",
    ],
  },
] as const

export function InsightsPanel() {
  return (
    <div className="space-y-8">
      <div className="rounded-sm border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
        <p className="font-semibold">Phase 1 shell — live metrics in Phase 4</p>
        <p className="mt-1 text-amber-900/80">
          This layout is ready. Event tracking (Convex analytics + optional Vercel Analytics)
          ships next so these cards fill with real numbers from your site and intake funnel.
        </p>
      </div>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <MousePointerClick className="h-4 w-4 text-gold-dark" aria-hidden />
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-navy/50">
            This week at a glance
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {KPI_PLACEHOLDERS.map(({ label, value, hint, icon: Icon }) => (
            <div
              key={label}
              className="border border-navy/10 bg-white px-4 py-4 shadow-[0_1px_0_rgba(12,25,41,0.04)]"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-navy/45">
                  {label}
                </p>
                <Icon className="h-4 w-4 text-gold" aria-hidden />
              </div>
              <p className="mt-3 font-display text-3xl text-navy">{value}</p>
              <p className="mt-1 text-xs text-navy/50">{hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-navy/10 bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-gold-dark" aria-hidden />
          <h2 className="font-display text-xl text-navy">Client funnel</h2>
        </div>
        <ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {FUNNEL_STEPS.map((step, i) => (
            <li
              key={step}
              className="relative border border-navy/8 bg-cream/80 px-3 py-4 text-center"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-dark">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 text-xs font-semibold leading-snug text-navy">{step}</p>
              <p className="mt-3 font-display text-2xl text-navy/25">—</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {TRACKING_ROADMAP.map((block) => (
          <div key={block.title} className="border border-navy/10 bg-white p-5">
            <h3 className="font-display text-lg text-navy">{block.title}</h3>
            <div className="mt-2 h-px w-10 bg-gold" />
            <ul className="mt-4 space-y-2">
              {block.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-navy/70">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  )
}
