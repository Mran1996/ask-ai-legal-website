import { AlertCircle, ShieldCheck } from "lucide-react"

export function ProblemSolution() {
  return (
    <section className="section-dark section-pad">
      <div className="container-main">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="section-label">The problem</span>
            <h2 className="section-title">
              Justice shouldn&apos;t require a $400/hour retainer
            </h2>
            <p className="section-desc">
              The legal system wasn&apos;t built for people without a lawyer.
              Deadlines don&apos;t wait. One wrong paragraph can cost you everything.
            </p>
          </div>

          <div className="space-y-5">
            <article className="bento-card border-red-500/20 bg-red-500/5">
              <AlertCircle className="mb-4 h-8 w-8 text-red-400" aria-hidden />
              <h3 className="font-display text-2xl text-white">Hourly fees destroy families</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                A single motion runs $2,000–$5,000 before you file. Most people
                represent themselves not by choice — but because they have no choice.
              </p>
            </article>
            <article className="bento-card border-brand/30 bg-brand/10">
              <ShieldCheck className="mb-4 h-8 w-8 text-brand" aria-hidden />
              <h3 className="font-display text-2xl text-white">Ask AI Legal changes that</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                Professional drafts, document planning, and 24/7 guidance — flat monthly
                pricing, on your schedule, always on your side.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
