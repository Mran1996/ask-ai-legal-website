"use client"

import { trackSiteAction } from "@/lib/analytics"

const SAMPLES = [
  { title: "Civil", detail: "Motion with exhibits", file: "civil-motion-with-exhibits", pages: 14 },
  { title: "Criminal", detail: "Motion with exhibits", file: "criminal-motion-with-exhibits", pages: 12 },
  { title: "Divorce", detail: "Trial brief with exhibits", file: "divorce-trial-brief-with-exhibits", pages: 12 },
  { title: "Research report", detail: "Which cases help or hurt", file: "civil-research-report", pages: 7 },
]

/** Fictional sample documents. Each card opens the full PDF from /public/samples. */
export function SampleDocuments() {
  return (
    <section id="samples" className="relative scroll-mt-20 bg-ground-surface py-8 sm:py-12" aria-labelledby="samples-title">
      <div className="cine-container">
        <h2 id="samples-title" className="cine-h2 text-cream">
          See the work <span className="cine-serif text-accent-light">before you pay.</span>
        </h2>
        <p className="cine-body mt-4 max-w-2xl">Open a full sample, with its numbered lines, exhibits and citations.</p>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {SAMPLES.map((s) => (
            <li key={s.file}>
              <a
                href={`/samples/${s.file}.pdf`}
                target="_blank"
                rel="noopener"
                onClick={() => trackSiteAction("sample_open", s.title)}
                className="cine-card group block overflow-hidden"
              >
                <div className="h-40 overflow-hidden bg-white sm:h-56">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/samples/${s.file}.png`}
                    alt={`First page of the ${s.title.toLowerCase()} sample`}
                    className="w-full transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-display text-base font-semibold text-cream sm:text-lg">{s.title}</h3>
                  <p className="mt-0.5 text-sm text-cream/65">{s.detail}</p>
                  <p className="mt-1 text-xs text-cream/45">PDF, {s.pages} pages</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-2xl text-sm text-cream/60">
          Samples use fictional cases. Check every document and citation before filing.
        </p>
      </div>
    </section>
  )
}
