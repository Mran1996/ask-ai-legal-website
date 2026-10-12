import { COMPARISON } from "@/lib/comparison"

type Props = {
  /** "dark" for the cinematic homepage, "light" for the cream /pricing section. */
  tone?: "dark" | "light"
  /** Only the rows marked `short` (homepage). */
  short?: boolean
}

/** Two-column comparison: a real table on wider screens, stacked cards on phones. */
export function CompareTable({ tone = "light", short = false }: Props) {
  const rows = short ? COMPARISON.rows.filter((r) => r.short) : COMPARISON.rows
  const dark = tone === "dark"
  const text = dark ? "text-cream/80" : "text-gray-700"
  const head = dark ? "text-cream" : "text-navy"
  const label = dark ? "text-accent" : "text-gold-dark"
  const line = dark ? "border-cream/10" : "border-navy/10"
  const card = dark ? "cine-card" : "rounded-sm border-2 border-navy/10 bg-white"

  return (
    <>
      {/* Wider screens */}
      <div className={`hidden overflow-hidden md:block ${card}`}>
        <table className="w-full table-fixed text-left text-sm">
          <caption className="sr-only">{COMPARISON.title}</caption>
          <thead>
            <tr className={`border-b ${line}`}>
              <th scope="col" className="w-[22%] p-5">
                <span className="sr-only">Topic</span>
              </th>
              {COMPARISON.columns.map((c) => (
                <th key={c} scope="col" className={`p-5 font-display text-base font-semibold ${head}`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className={`border-b last:border-0 ${line}`}>
                <th scope="row" className={`p-5 align-top text-xs font-bold uppercase tracking-[0.12em] ${label}`}>
                  {r.label}
                </th>
                <td className={`p-5 align-top leading-relaxed ${text}`}>{r.ours}</td>
                <td className={`p-5 align-top leading-relaxed ${text}`}>{r.attorney}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones */}
      <ul className="space-y-4 md:hidden">
        {rows.map((r) => (
          <li key={r.label} className={`p-5 ${card}`}>
            <p className={`text-xs font-bold uppercase tracking-[0.12em] ${label}`}>{r.label}</p>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className={`font-semibold ${head}`}>{COMPARISON.columns[0]}</dt>
                <dd className={`mt-1 leading-relaxed ${text}`}>{r.ours}</dd>
              </div>
              <div>
                <dt className={`font-semibold ${head}`}>{COMPARISON.columns[1]}</dt>
                <dd className={`mt-1 leading-relaxed ${text}`}>{r.attorney}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  )
}
