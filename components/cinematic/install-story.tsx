"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Slot } from "./slot"
import { prefersReducedMotion } from "./smooth-scroll"

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    n: "01",
    title: "We understand your situation",
    body: "Share as much or as little as you're comfortable with — you never have to tell your whole story to a stranger. We ask the questions that matter and work out what your setup needs.",
    img: "install-01-understand.png",
  },
  {
    n: "02",
    title: "You accept a link",
    body: "That gives us permission to access your computer for the session — and recording starts right then, so everything that happens is yours to keep. End the session any time. We never hold your logins.",
    img: "install-02-link.png",
  },
  {
    n: "03",
    title: "We install while you watch",
    body: "Live, on your screen. We walk through every step as we do it, so you see everything that goes into your workspace.",
    img: "install-03-live.png",
  },
  {
    n: "04",
    title: "Your questions, answered",
    body: "Before we close the session, our staff answer every question until you're comfortable and understand how it all works. The full recording is yours to review whenever you want.",
    img: "install-04-questions.png",
  },
]

/** Pinned scroll story: the section holds while each step slides through. */
export function InstallStory() {
  const root = useRef<HTMLElement>(null)
  const [staticLayout, setStaticLayout] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStaticLayout(true)
      return
    }
    if (!root.current) return
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]")
      const images = gsap.utils.toArray<HTMLElement>("[data-step-img]")
      gsap.set(steps.slice(1), { autoAlpha: 0, y: 40 })
      gsap.set(images.slice(1), { autoAlpha: 0, scale: 0.85, rotate: 6 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${steps.length * 90}%`,
          pin: true,
          scrub: 0.6,
        },
      })
      steps.forEach((_, i) => {
        if (i === 0) return
        tl.to(steps[i - 1], { autoAlpha: 0, y: -40, duration: 0.5 }, `s${i}`)
          .to(images[i - 1], { autoAlpha: 0, scale: 1.1, rotate: -6, duration: 0.5 }, `s${i}`)
          .to(steps[i], { autoAlpha: 1, y: 0, duration: 0.5 }, `s${i}+=0.3`)
          .to(images[i], { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5 }, `s${i}+=0.3`)
      })
      // progress bar
      gsap.to("[data-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${steps.length * 90}%`, scrub: true },
      })
      ScrollTrigger.refresh()
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="install" ref={root} className="relative min-h-[100svh] overflow-hidden bg-ground">
      <div className="cine-glow absolute -right-[10%] top-1/2 h-[80vh] w-[60vw] -translate-y-1/2 opacity-70" aria-hidden />

      <div className="cine-container relative grid min-h-[100svh] items-center gap-12 py-24 md:grid-cols-2">
        {/* text column */}
        <div className="relative">
          <p className="cine-label mb-6">How the install works</p>
          <h2 className="cine-h2 mb-10 text-cream">
            On your screen.
            <br />
            <span className="cine-serif text-accent-light">Every step, in view.</span>
          </h2>

          <div className={staticLayout ? "space-y-12" : "relative min-h-[14rem]"}>
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                data-step
                className={staticLayout ? "relative" : i === 0 ? "relative" : "absolute inset-0 invisible opacity-0 pointer-events-none"}
              >
                <p className="cine-label !text-cream/40">{s.n} / 04</p>
                <h3 className="cine-h3 mt-3 text-cream">{s.title}</h3>
                <p className="cine-body mt-4 max-w-md">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 h-px w-full max-w-md bg-cream/10">
            <div data-progress className="h-px origin-left scale-x-0 bg-accent" />
          </div>
          <p className="cine-body mt-4 !text-sm !text-cream/40">
            Afterwards: we help you use what we installed, and keep it current as tools improve.
          </p>
        </div>

        {/* image column */}
        <div className="relative aspect-square w-full max-w-[560px] justify-self-center">
          {STEPS.map((s, i) => (
            <div
              key={s.img}
              data-step-img
              className={`${i === 0 ? "relative" : "absolute inset-0 invisible opacity-0 pointer-events-none"} h-full w-full ${staticLayout && i > 0 ? "hidden" : ""}`}
            >
              <Slot src={s.img} className="h-full w-full rounded-3xl" imgClassName="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
