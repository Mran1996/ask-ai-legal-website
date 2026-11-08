"use client"

import { BrainOrb } from "./brain-orb"
import { Reveal } from "./reveal"

/** Second Brain: kept short on purpose. One line, plus a live copy of the app's orb.
 *  The orb shows only counts and group labels, never names or case details. */
export function SecondBrain() {
  return (
    <section id="second-brain" className="relative scroll-mt-20 bg-ground-surface py-10 sm:py-16">
      <div className="cine-container grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="text-center lg:text-left">
          <p data-reveal className="cine-label mb-3">Second Brain</p>
          <h2 data-reveal className="cine-h2 mx-auto max-w-[18ch] text-cream lg:mx-0">
            Your Second Brain learns.{" "}
            <span className="cine-serif text-accent-light">It gets better with every document.</span>
          </h2>
        </Reveal>

        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-accent/10 blur-3xl" aria-hidden />
          {/* Sized to the screen height too, so the whole orb fits on laptops with short screens. */}
          <div className="relative mx-auto aspect-square w-full rounded-full bg-[#0b1220]" style={{ maxWidth: "min(480px, 68vh)" }}>
            <BrainOrb className="absolute inset-0 h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
