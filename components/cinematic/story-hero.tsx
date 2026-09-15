"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { prefersReducedMotion } from "./smooth-scroll"

gsap.registerPlugin(ScrollTrigger)

const FallingPapers = dynamic(() => import("./falling-papers"), { ssr: false })

const SCENES = [
  {
    img: "hero-desk.png",
    label: "01 · Tonight",
    title: ["It starts at your", "kitchen table."],
    sub: "Court papers. Deadlines. No idea where to begin.",
    pos: "70% center",
  },
  {
    img: "story-02-install.png",
    label: "02 · Within 72 hours",
    title: ["We do the", "install."],
    sub: "You accept our link and we set up your workspace live on your screen — you see every step.",
    pos: "60% center",
  },
  {
    img: "story-03-drafting.png",
    label: "03 · Your pace",
    title: ["You do the", "work."],
    sub: "Research, drafting, next steps — from home, with the recorded walkthrough whenever you need it.",
    pos: "60% center",
  },
  {
    img: "story-04-ready.png",
    label: "04 · The morning",
    title: ["You walk in", "prepared."],
    sub: "Your documents. Your binder. Your plan.",
    pos: "55% center",
  },
  {
    img: "story-05-courthouse.png",
    label: "05 · Your matter",
    title: ["Your matter.", "Your voice."],
    sub: "Not a law firm. Nothing is filed for you — you stay in control the whole way.",
    pos: "40% center",
  },
  {
    img: "story-06-home.png",
    label: "06 · After",
    title: ["From home.", "On your terms."],
    sub: "No retainer. No hourly clock. Two payments, and the setup is yours.",
    pos: "60% center",
    cta: true,
  },
]

export function StoryHero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>("[data-scene]")
      const copies = gsap.utils.toArray<HTMLElement>("[data-copy]")
      gsap.set(scenes.slice(1), { opacity: 0 })
      gsap.set(copies.slice(1), { opacity: 0, y: 40 })
      gsap.set(scenes, { scale: 1.08 })
      gsap.set(scenes[0], { scale: 1 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${SCENES.length * 100}%`,
          pin: true,
          scrub: 0.8,
        },
      })
      SCENES.forEach((_, i) => {
        if (i === 0) return
        const at = `s${i}`
        tl.to(scenes[i - 1], { opacity: 0, scale: 1.12, duration: 1 }, at)
          .to(scenes[i], { opacity: 1, scale: 1, duration: 1 }, at)
          .to(copies[i - 1], { opacity: 0, y: -40, duration: 0.5 }, at)
          .to(copies[i], { opacity: 1, y: 0, duration: 0.6 }, `${at}+=0.4`)
          .to("[data-dot]", { backgroundColor: "rgba(250,249,246,0.25)", duration: 0.1 }, at)
          .to(`[data-dot="${i}"]`, { backgroundColor: "#FBB034", duration: 0.1 }, at)
      })
      ScrollTrigger.refresh()
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="cine-grain relative h-[100svh] overflow-hidden bg-ground">
      {/* scene plates */}
      {SCENES.map((s, i) => (
        <div key={s.img} data-scene className={`absolute inset-0 will-change-transform ${i > 0 ? "opacity-0" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/renders/${s.img}`}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: s.pos }}
            loading={i === 0 ? "eager" : "lazy"}
            draggable={false}
          />
        </div>
      ))}
      <div className="cine-vignette absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ground to-transparent" />

      <FallingPapers />

      {/* copy */}
      <div className="cine-container relative flex h-full flex-col justify-end pb-24 pt-28 sm:pb-28 md:justify-center">
        <div className="relative min-h-[22rem] sm:min-h-[26rem]">
          {SCENES.map((s, i) => (
            <div key={s.img} data-copy className={`${i === 0 ? "relative" : "absolute inset-0 opacity-0"} max-w-3xl`}>
              <p className="cine-label mb-6">{s.label}</p>
              <h1 className="cine-h1 text-cream">
                <span className="block">{s.title[0]}</span>
                <span className="cine-serif block text-accent-light">{s.title[1]}</span>
              </h1>
              <p className="cine-body mt-8 max-w-xl">{s.sub}</p>
              {s.cta && (
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link href="/pay" className="cine-btn-gold">
                    Tell us what you&apos;re facing <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link href="#install" className="cine-btn-ghost">
                    See what gets installed
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* progress dots */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2 sm:left-auto sm:right-8 sm:translate-x-0" aria-hidden>
        {SCENES.map((_, i) => (
          <span key={i} data-dot={i} className="h-1.5 w-6 rounded-full" style={{ backgroundColor: i === 0 ? "#FBB034" : "rgba(250,249,246,0.25)" }} />
        ))}
      </div>

      <p className="cine-label absolute bottom-8 left-5 hidden !text-cream/40 sm:left-8 sm:block">Scroll</p>
    </section>
  )
}
