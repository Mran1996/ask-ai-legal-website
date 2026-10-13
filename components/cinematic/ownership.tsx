"use client"

import { Reveal } from "./reveal"

/** Ownership (buy once, keep your workspace) and what optional maintenance covers. */
export function Ownership() {
  return (
    <section id="ownership" className="relative scroll-mt-20 bg-ground py-24 sm:py-32">
      <div className="cine-glow absolute -right-[20%] top-0 h-[60vh] w-[60vw] opacity-50" aria-hidden />
      <div className="cine-container relative grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="cine-card border-accent/30 p-8 sm:p-12">
          <p data-reveal className="cine-label mb-6">Yours to keep</p>
          <h2 data-reveal className="cine-h2 text-cream">
            Your installed workspace—{" "}
            <span className="cine-serif text-accent-light">not another workspace you rent.</span>
          </h2>
          <p data-reveal className="cine-body mt-8 max-w-2xl">
            Purchase Ask AI Legal once and keep your installed workspace on your computer under your license. Your
            saved information, documents, and accumulated memory stay with you. Optional maintenance keeps you
            supported as the software and supported connections evolve.
          </p>
        </Reveal>

        <Reveal className="cine-card p-8 sm:p-10">
          <p data-reveal className="cine-label mb-6">Optional maintenance · $125/month</p>
          <h3 data-reveal className="cine-h3 text-cream">Keep your workspace moving forward.</h3>
          <p data-reveal className="cine-body mt-5 !text-base">
            Optional maintenance provides ongoing support, supported software updates, and help maintaining your API
            and plugin connections as services change.
          </p>
          <p data-reveal className="cine-body mt-5 !text-base !text-cream/60">
            Your saved learning stays in your workspace. Maintenance supports the software and its connections.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
