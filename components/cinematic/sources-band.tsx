"use client"

import { Render } from "./render"
import { Reveal } from "./reveal"

export function SourcesBand() {
  return (
    <section id="sources" className="relative flex min-h-[460px] items-center overflow-hidden bg-ground sm:min-h-[520px] xl:min-h-[640px]">
      <div className="absolute inset-0">
        <Render src="install-04-questions.png" className="h-full w-full" imgClassName="object-cover object-[70%_30%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ground via-ground/70 to-ground/30" />
      </div>
      <div className="cine-container relative w-full py-12 sm:py-16">
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
        </Reveal>
      </div>
    </section>
  )
}
