"use client"

import { Reveal } from "./reveal"

const POINTS = [
  "We connect the AI providers you choose",
  "We set up the integrations we support",
  "We personalise the interface around your work",
  "We show you how to run it without us",
]

export function Ownership() {
  return (
    <section className="relative overflow-hidden bg-ground">
      <div className="cine-container relative py-32 sm:py-44">
        <Reveal className="max-w-2xl">
          <p data-reveal className="cine-label mb-6">What you are buying</p>
          <h2 data-reveal className="cine-h2 text-cream">
            Your software. Your computer.
            <br />
            <span className="cine-serif text-accent-light">Yours to keep.</span>
          </h2>
          <p data-reveal className="cine-body mt-8">
            We build a workspace, install it on your machine, and set it up for the way you
            work. Pay in full and that copy is yours. It is not a rental, and there is no
            monthly fee keeping it alive.
          </p>

          <ul data-reveal className="mt-10 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-3 text-cream/75">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-light" />
                <span className="cine-body !mt-0">{point}</span>
              </li>
            ))}
          </ul>

          <p data-reveal className="cine-body mt-10">
            Your documents and your saved work stay on your computer, under your control.
            Maintenance is available afterwards if you want it. You do not have to buy it to
            keep what you paid for.
          </p>

          <p data-reveal className="mt-10 max-w-xl text-xs leading-relaxed text-cream/45">
            Ask AI Legal builds, installs, and configures software. We are not a law firm. We
            do not provide legal advice, legal representation, or document preparation for
            your matter.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
