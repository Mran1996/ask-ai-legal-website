"use client"

import { BrainOrb } from "./brain-orb"
import { Reveal } from "./reveal"

/** What each part of the map means. Matches the app's Second Brain legend. Check the app before changing a claim. */
const LEGEND = [
  {
    mark: <span className="h-3.5 w-3.5 rounded-full border-2 border-[#2ec4d6] bg-[#0b1626]" />,
    name: "Legal Brain, in the center",
    body: "This is where your drafts get written. It checks everything around it before it starts.",
  },
  {
    mark: <span className="h-3 w-3 rounded-full bg-[#3b8ff0]" />,
    name: "Blue dots are your court papers",
    body: "Each dot is one paper or exhibit you added to your case.",
  },
  {
    mark: <span className="h-3 w-3 rounded-full bg-[#b9a6f5]" />,
    name: "Purple dots are cited cases",
    body: "Cases your papers rely on, kept so new drafts can point to them.",
  },
  {
    mark: <span className="h-3 w-3 rounded-full bg-[#eef1f6]" />,
    name: "White dots are writing lessons",
    body: "Every correction you save, plus lessons it picks up from writing guides. Fix something once and it follows the fix from then on.",
  },
  {
    mark: <span className="h-3.5 w-3.5 rounded-full border-2 border-[#e0a93b]" />,
    name: "Gold rings are routines",
    body: "Jobs that run on their own, like watching your deadlines and finding new lessons.",
  },
  {
    mark: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path d="M12 2 21 7v10l-9 5-9-5V7z" fill="none" stroke="#8ea2d8" strokeWidth="2.2" />
      </svg>
    ),
    name: "Outer hexagons are connected tools",
    body: "Services you choose to link to the app.",
  },
]

/** Second Brain: memory and drafting lessons saved on the customer's computer.
 *  The map is a live copy of the app's orb. It shows only counts and group labels, never names or case details. */
export function SecondBrain() {
  return (
    <section id="second-brain" className="relative scroll-mt-20 bg-ground-surface py-6 sm:py-10">
      <div className="cine-container grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Reveal>
            <p data-reveal className="cine-label mb-3">Second Brain</p>
            <h2 data-reveal className="cine-h2 max-w-[20ch] text-cream">
              Fix a mistake once.{" "}
              <span className="cine-serif text-accent-light">It remembers next time.</span>
            </h2>
            <p data-reveal className="cine-body mt-4 max-w-2xl">
              Second Brain is the app&apos;s memory. Your papers, the cases you cite and every lesson you save all live
              here, on your computer. The more you use it, the fuller it gets. Here is what you are looking at.
            </p>
          </Reveal>

          <Reveal className="mt-6 grid gap-3 sm:grid-cols-2" stagger={0.06}>
            {LEGEND.map((item) => (
              <article key={item.name} data-reveal className="cine-card flex gap-3 p-4">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
                  {item.mark}
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-cream">{item.name}</h3>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-cream/65">{item.body}</p>
                </div>
              </article>
            ))}
          </Reveal>
        </div>

        <figure className="relative">
          <div className="absolute -inset-4 rounded-full bg-accent/10 blur-3xl" aria-hidden />
          <div className="relative mx-auto aspect-square w-full max-w-[600px] rounded-full bg-[#0b1220]">
            <BrainOrb className="absolute inset-0 h-full w-full" />
          </div>
          <figcaption className="mt-2 text-center font-sans text-xs text-cream/45">
            The Second Brain map, drawn the same way the app draws it. Every dot is something it remembers.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
