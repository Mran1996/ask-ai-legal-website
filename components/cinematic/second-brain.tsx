"use client"

import { Reveal } from "./reveal"

const STEPS = [
  {
    title: "Correct it once. Save the lesson.",
    body: "When you identify a drafting mistake, save the correction as a standing instruction in your Second Brain. Those saved instructions guide future drafts, helping it avoid repeating the same mistake.",
  },
  {
    title: "Teach it from your materials.",
    body: "Use supported videos, examples, and reference materials to develop drafting lessons you can review and save for future work.",
  },
  {
    title: "Build on what it remembers.",
    body: "Your saved preferences and approved lessons give future drafting a more consistent starting point.",
  },
]

/** Second Brain: memory and drafting lessons saved on the customer's computer. */
export function SecondBrain() {
  return (
    <section id="second-brain" className="relative scroll-mt-20 bg-ground-surface py-6 sm:py-10">
      <div className="cine-container">
        <Reveal>
          <p data-reveal className="cine-label mb-3">Second Brain</p>
          <h2 data-reveal className="cine-h2 max-w-[20ch] text-cream">
            Fix a mistake once.{" "}
            <span className="cine-serif text-accent-light">It remembers next time.</span>
          </h2>
          <p data-reveal className="cine-body mt-4 max-w-2xl">
            Keep your saved information, documents, preferences, and drafting lessons together on your computer. Teach
            Second Brain how you want your documents written, save corrections, and build on those instructions in
            future work.
          </p>
        </Reveal>

        <Reveal className="mt-8 grid gap-5 md:grid-cols-3" stagger={0.08}>
          {STEPS.map((s) => (
            <article key={s.title} data-reveal className="cine-card p-5 sm:p-6">
              <h3 className="cine-h3 !text-xl text-cream">{s.title}</h3>
              <p className="cine-body mt-2 !text-lg">{s.body}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
