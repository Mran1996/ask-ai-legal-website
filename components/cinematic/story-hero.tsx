"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { BrandLockup } from "@/components/brand-lockup"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { prefersReducedMotion } from "./smooth-scroll"

gsap.registerPlugin(ScrollTrigger)

const FallingPapers = dynamic(() => import("./falling-papers"), { ssr: false })

const MATTERS = [
  { label: "Divorce & separation", href: "/situations/divorce" },
  { label: "Custody & family", href: "/situations/custody" },
  { label: "Housing", href: "/situations/housing" },
  { label: "Civil disputes", href: "/situations/civil" },
  { label: "Small claims", href: "/situations/small-claims" },
  { label: "Green cards & immigration", href: "/situations/immigration" },
  { label: "& more", href: "/services" },
]

const SCENES = [
  {
    img: "hero-desk.png",
    alt: "Laptop glowing on a kitchen table at night with legal documents rising from the screen — Ask AI Legal workspace installed at home",
    label: "Let us help you get your issues in order",
    title: ["We do the install.", "You do everything from home."],
    sub: "We set up Ask AI Legal so you can do everything you need from the comfort of your home — research, documents, and next steps — without waiting on someone else to do it for you. You don't have to share your story up front; we walk you through everything.",
    subExtra: "Plain language. Private. Yours to run.",
    pos: "70% center",
    brand: true,
    intro: true,
  },
  {
    img: "story-02-install.png",
    alt: "Woman at her home desk watching her legal workspace being installed on her laptop",
    label: "02 · Within 72 hours",
    title: ["We do the", "install."],
    sub: "You accept our link and we set up your workspace live on your screen — you see every step.",
    pos: "60% center",
  },
  {
    img: "story-03-drafting.png",
    alt: "Self-represented woman drafting court documents from home on her laptop",
    label: "03 · Your pace",
    title: ["You do the", "work."],
    sub: "Research, drafting, next steps — from home, with the recorded walkthrough whenever you need it.",
    pos: "60% center",
  },
  {
    img: "story-04-ready.png",
    alt: "Woman leaving home with her organized legal binder, prepared for court",
    label: "04 · The morning",
    title: ["You walk in", "prepared."],
    sub: "Your issue, organized. Your papers, drafted. A fighting chance — built from your own home.",
    pos: "55% center",
  },
  {
    img: "story-05-courthouse.png",
    alt: "Woman walking up courthouse steps carrying her own case binder",
    label: "05 · Your matter",
    title: ["Your matter.", "Your voice."],
    sub: "You file. You speak. You stand up for what matters — with the tools ready behind you.",
    pos: "40% center",
  },
  {
    img: "story-06-home.png",
    alt: "Woman relaxed at her kitchen table after handling her legal matter from home",
    label: "06 · After",
    title: ["From home.", "On your terms."],
    sub: "No retainer. No hourly clock. Two payments, and the setup — and the fight — is yours.",
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
      gsap.set(scenes.slice(1), { autoAlpha: 0 })
      gsap.set(copies.slice(1), { autoAlpha: 0, y: 40, pointerEvents: "none" })
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
        tl.to(scenes[i - 1], { autoAlpha: 0, scale: 1.12, duration: 1 }, at)
          .to(scenes[i], { autoAlpha: 1, scale: 1, duration: 1 }, at)
          .to(copies[i - 1], { autoAlpha: 0, y: -40, duration: 0.5 }, at)
          .set(copies[i - 1], { pointerEvents: "none" }, `${at}+=0.45`)
          .to(copies[i], { autoAlpha: 1, y: 0, duration: 0.6 }, `${at}+=0.4`)
          .set(copies[i], { pointerEvents: "auto" }, `${at}+=0.45`)
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
        <div key={s.img} data-scene className={`pointer-events-none absolute inset-0 will-change-transform ${i > 0 ? "invisible opacity-0" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/renders/${s.img}`}
            alt={s.alt}
            className="h-full w-full object-cover"
            style={{ objectPosition: s.pos }}
            loading={i === 0 ? "eager" : "lazy"}
            draggable={false}
          />
        </div>
      ))}
      <div className="cine-vignette absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-ground via-ground/80 to-transparent md:h-[65%] md:via-ground/55" />
      <div className="absolute inset-y-0 left-0 hidden w-[60%] bg-gradient-to-r from-ground/80 to-transparent md:block" />

      <FallingPapers />

      {/* copy */}
      <div className="cine-container relative z-10 flex h-full flex-col justify-center pb-28 pt-20 sm:pb-24 sm:pt-24">
        <div className="relative min-h-[22rem] sm:min-h-[26rem]">
          {SCENES.map((s, i) => (
            <div
              key={s.img}
              data-copy
              className={`${i === 0 ? "relative mx-auto flex flex-col items-center text-center" : "absolute inset-0 invisible opacity-0 pointer-events-none"} max-w-3xl`}
            >
              {"brand" in s && s.brand && (
                <div className="mb-4">
                  <BrandLockup href="/" className="justify-center" />
                </div>
              )}
              <p className={`cine-label cine-shadow ${i === 0 ? "mb-4 !tracking-[0.12em]" : "mb-6"}`}>{s.label}</p>
              {i === 0 ? (
                <h1 className="cine-shadow font-display text-cream">
                  <span className="block text-[clamp(2.1rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em]">{s.title[0]}</span>
                  <span className="cine-serif block text-[clamp(2rem,5.6vw,4.25rem)] leading-[1.05] text-accent-light">{s.title[1]}</span>
                </h1>
              ) : (
                <h2 className="cine-h1 cine-shadow text-cream">
                  <span className="block">{s.title[0]}</span>
                  <span className="cine-serif block text-accent-light">{s.title[1]}</span>
                </h2>
              )}
              <p className={`cine-body cine-shadow max-w-xl !text-cream/85 ${i === 0 ? "mx-auto mt-5 !text-[15px] sm:!text-lg" : "mt-8"}`}>
                {s.sub}
                {"subExtra" in s && s.subExtra && <span className="hidden sm:inline"> {s.subExtra}</span>}
              </p>
              {"intro" in s && s.intro && (
                <>
                  <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Matters we install for">
                    {MATTERS.map((m) => (
                      <li key={m.href}>
                        <Link
                          href={m.href}
                          className="cine-pill inline-flex rounded-full border border-accent/50 bg-ground/60 px-3.5 py-1.5 text-[13px] text-cream sm:px-4 sm:py-2 sm:text-sm transition-colors hover:border-accent hover:bg-accent/10 active:bg-accent active:text-ground"
                        >
                          {m.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Link href="/pay" className="cine-btn-gold w-full sm:w-auto">
                      Start from home <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    <Link href="#install" className="cine-btn-ghost w-full sm:w-auto">
                      See how it works
                    </Link>
                  </div>
                </>
              )}
              {"cta" in s && s.cta && (
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link href="/pay" className="cine-btn-gold">
                    Start from home <ArrowRight className="h-4 w-4" aria-hidden />
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
