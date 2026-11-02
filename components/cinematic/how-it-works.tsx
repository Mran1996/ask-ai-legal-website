"use client"

import { Slot } from "./slot"
import { Reveal } from "./reveal"

const STEPS = [
  {
    n: "01",
    title: "Choose your plan and pay once",
    body: "Pick Starter or Complete and check out securely. Then tell us which computer you use.",
    img: "step-01-tell-us.png",
  },
  {
    n: "02",
    title: "Download and install",
    body: "We email your download and a step-by-step walkthrough video. Install it in minutes, then activate it with your license code.",
    img: "step-02-install.png",
  },
  {
    n: "03",
    title: "You work from home",
    body: "Organize documents, research legal sources, and prepare drafts for your review, with support by chat, email, or phone.",
    img: "step-03-home.png",
  },
]

export function HowItWorks() {
  return (
    <section id="process" className="relative bg-ground-surface py-6 sm:py-10">
      <div className="cine-container">
        <Reveal>
          <p data-reveal className="cine-label mb-3">How it works</p>
          <h2 data-reveal className="cine-h2 text-cream">
            Three steps
            <span className="cine-serif text-accent-light"> from first call to first draft.</span>
          </h2>
        </Reveal>

        <Reveal className="mt-8 grid gap-6 md:grid-cols-3" stagger={0.15}>
          {STEPS.map((s) => (
            <article key={s.n} data-reveal className="cine-card group overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Slot src={s.img} className="h-full w-full transition-transform duration-700 group-hover:scale-105" imgClassName="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ground-surface to-transparent" />
                <span className="cine-label absolute left-5 top-5">{s.n}</span>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="cine-h3 text-cream">{s.title}</h3>
                <p className="cine-body mt-2 !text-lg">{s.body}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
