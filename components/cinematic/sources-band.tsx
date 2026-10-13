"use client"

import { Render } from "./render"
import { Reveal } from "./reveal"
import { SOURCES } from "./tools"
import { RESEARCH_ACCESS_NOTE } from "@/lib/site-config"

export function SourcesBand() {
  return (
    <section className="relative overflow-hidden bg-ground">
      <div className="absolute inset-0">
        <Render src="install-04-questions.png" className="h-full w-full" imgClassName="object-cover object-[70%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ground via-ground/70 to-ground/30" />
      </div>
      <div className="cine-container relative py-12 sm:py-16">
        <Reveal className="max-w-2xl">
          <p data-reveal className="cine-label mb-3">Research you can check</p>
          <h2 data-reveal className="cine-h2 text-cream">
            Open the source.{" "}
            <br />
            <span className="cine-serif text-accent-light">Check the citation.</span>
          </h2>
          <p data-reveal className="cine-body mt-4">
            Use source links to read the opinions, statutes, court rules, and documents behind your research. AI can
            make mistakes, including incorrect citations. Check each source and confirm that it supports your point
            before relying on it.
          </p>
          <div data-reveal className="mt-6">
            <p className="cine-label mb-3 !text-cream/50">Supported research connections</p>
            <ul className="flex flex-wrap gap-2">
              {SOURCES.map((s) => (
                <li key={s} className="rounded-full border border-cream/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-cream/75">
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-cream/60">{RESEARCH_ACCESS_NOTE}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
