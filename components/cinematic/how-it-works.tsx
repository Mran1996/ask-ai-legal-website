"use client"

import { Slot } from "./slot"
import { Reveal } from "./reveal"

const STEPS = [
  {
    n: "01",
    title: "Start from home",
    body: "No long forms about your story. Share what you want; we walk you through the rest.",
    img: "step-01-tell-us.png",
  },
  {
    n: "02",
    title: "Accept the link. We install — you watch.",
    body: "Recording starts when you accept. We set everything up live on your screen and answer every question before we close.",
    img: "step-02-install.png",
  },
  {
    n: "03",
    title: "You work from home",
    body: "Research, draft, and fight for what matters yourself — with the recording to fall back on any time.",
    img: "step-03-home.png",
  },
]

export function HowItWorks() {
  return (
    <section id="process" className="relative bg-ground-surface py-24 sm:py-32">
      <div className="cine-container">
        <Reveal>
          <p data-reveal className="cine-label mb-6">How it works</p>
          <h2 data-reveal className="cine-h2 text-cream">
            Three steps.
            <span className="cine-serif text-accent-light"> No hourly clock.</span>
          </h2>
        </Reveal>

        <Reveal className="mt-16 grid gap-6 md:grid-cols-3" stagger={0.15}>
          {STEPS.map((s) => (
            <article key={s.n} data-reveal className="cine-card group overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Slot src={s.img} className="h-full w-full transition-transform duration-700 group-hover:scale-105" imgClassName="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ground-surface to-transparent" />
                <span className="cine-label absolute left-5 top-5">{s.n}</span>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="cine-h3 text-cream">{s.title}</h3>
                <p className="cine-body mt-3 !text-base">{s.body}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
