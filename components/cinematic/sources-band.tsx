"use client"

import { Render } from "./render"
import { Reveal } from "./reveal"

export function SourcesBand() {
  return (
    <section className="relative overflow-hidden bg-ground">
      <div className="absolute inset-0">
        <Render src="install-04-questions.png" className="h-full w-full" imgClassName="object-cover object-[70%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ground via-ground/70 to-ground/30" />
      </div>
      <div className="cine-container relative py-32 sm:py-44">
        <Reveal className="max-w-2xl">
          <p data-reveal className="cine-label mb-6">Built on tools that don&apos;t guess</p>
          <h2 data-reveal className="cine-h2 text-cream">
            Nothing
            <br />
            <span className="cine-serif text-accent-light">invented.</span>
          </h2>
          <p data-reveal className="cine-body mt-8">
            Every citation in your workspace links to the real published opinion, statute, or document. If it
            can&apos;t be traced, it doesn&apos;t go in.
          </p>
          <p data-reveal className="font-mono mt-10 text-xs uppercase tracking-widest text-cream/40">
            Opinions · Statutes · Court rules · Forms · Your own documents
          </p>
        </Reveal>
      </div>
    </section>
  )
}
