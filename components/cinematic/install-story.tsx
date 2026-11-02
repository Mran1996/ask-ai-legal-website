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
    title: "Pay once",
    body: "Choose Starter or Complete and pay securely through Stripe. There is no call to book.",
    img: "install-01-understand.png",
  },
  {
    n: "02",
    title: "Tell us your computer",
    body: "Right after you pay, choose Windows or Mac. We send the right download for your computer.",
    img: "install-02-link.png",
  },
  {
    n: "03",
    title: "Install in minutes",
    body: "Follow the step-by-step walkthrough video. Open the app, and we send your license code to activate it.",
    img: "install-03-live.png",
  },
  {
    n: "04",
    title: "Your questions, answered",
    body: "Use the chat on our website or email support@askailegal.com, and we will help you finish setup.",
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
          end: () => `+=${steps.length * 55}%`,
          pin: true,
          scrub: 0.6,
        },
      })
      // Each step: change (0.8), then a reading pause (0.7) before the next one starts.
      steps.forEach((_, i) => {
        if (i === 0) return
        const at = (i - 1) * 1.5 + 0.7
        tl.to(steps[i - 1], { autoAlpha: 0, y: -40, duration: 0.5 }, at)
          .to(images[i - 1], { autoAlpha: 0, scale: 1.1, rotate: -6, duration: 0.5 }, at)
          .to(steps[i], { autoAlpha: 1, y: 0, duration: 0.5 }, at + 0.3)
          .to(images[i], { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5 }, at + 0.3)
      })
      tl.to({}, { duration: 0.7 }) // hold the last step
      // progress bar
      gsap.to("[data-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${steps.length * 55}%`, scrub: true },
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
          <p className="cine-label mb-3">How the install works</p>
          <h2 className="cine-h2 mb-10 text-cream">
            On your screen.{" "}
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
                <p className="cine-label !text-cream/60">{s.n} / 04</p>
                <h3 className="cine-h3 mt-3 text-cream">{s.title}</h3>
                <p className="cine-body mt-4 max-w-md">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 h-px w-full max-w-md bg-cream/10">
            <div data-progress className="h-px origin-left scale-x-0 bg-accent" />
          </div>
          <p className="cine-body mt-4 !text-sm !text-cream/65">
            Afterwards: 30 days of installation support is included. Ongoing maintenance is optional at $125/month.
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
