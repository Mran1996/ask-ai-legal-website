"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { BrandLockup } from "@/components/brand-lockup"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { prefersReducedMotion } from "./smooth-scroll"
import { CONSULT_CTA_LABEL, CONSULT_HREF } from "@/lib/site-config"
import { DEMO_VIDEO_READY } from "@/lib/demo-video"

gsap.registerPlugin(ScrollTrigger)

const FallingPapers = dynamic(() => import("./falling-papers"), { ssr: false })

const MATTERS = [
  { label: "Divorce & separation", href: "/situations/divorce" },
  { label: "Custody & family", href: "/situations/custody" },
  { label: "Housing", href: "/situations/housing" },
  { label: "Civil disputes", href: "/situations/civil" },
  { label: "Small claims", href: "/situations/small-claims" },
  { label: "Criminal", href: "/situations/criminal" },
  { label: "& more", href: "/services" },
]

const SCENES = [
  {
    img: "hero-desk.png",
    alt: "Laptop glowing on a kitchen table at night with legal documents rising from the screen — Ask AI Legal workspace installed at home",
    label: "We install it on your computer. You run your own court papers from home.",
    title: ["Represent yourself", "with a legal assistant on your own computer."],
    sub: "It reads your court papers, tracks your deadlines, and drafts documents for you to check. Your files are kept on your own computer.",
    pos: "70% center",
    brand: true,
    intro: true,
  },
  {
    img: "story-02-install.png",
    imgMobile: "story-02-install-m.png",
    alt: "Woman at her home desk watching her legal workspace being installed on her laptop",
    label: "02 · Installation",
    title: ["We do the", "install."],
    sub: "We connect to your computer, set everything up while you watch, and explain each step.",
    pos: "60% center",
  },
  {
    img: "story-03-drafting.png",
    imgMobile: "story-03-drafting-m.png",
    alt: "Self-represented woman drafting court documents from home on her laptop",
    label: "03 · Your pace",
    title: ["Work from your", "kitchen table."],
    sub: "Sort your papers, look up the law, and get drafts ready to review. No office visits.",
    pos: "60% center",
  },
  {
    img: "story-04-ready.png",
    alt: "Woman leaving home with her organized legal binder, prepared for court",
    label: "04 · Organized",
    title: ["Your papers,", "in order."],
    sub: "Every document in one place. Every draft ready for you to check and finish.",
    pos: "55% center",
  },
  {
    img: "story-05-courthouse.png",
    alt: "Woman walking up courthouse steps carrying her own case binder",
    label: "05 · Your matter",
    title: ["You stay", "in charge."],
    sub: "You decide what gets filed and what it says. Ask AI Legal prepares the paperwork. You sign it.",
    pos: "40% center",
  },
  {
    img: "story-06-home.png",
    imgMobile: "story-06-home-m.png",
    alt: "Woman relaxed at her kitchen table after handling her legal matter from home",
    label: "06 · After",
    title: ["Court papers,", "handled from home."],
    sub: "No appointments. No hourly bills.",
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
          // Each scene: a short change, then a pause so the words can be read (about 2.5 screens in total).
          end: () => `+=${SCENES.length * 42}%`,
          pin: true,
          scrub: 0.8,
        },
      })
      const STEP = 1.6 // 1 unit of change + 0.6 of reading pause per scene
      SCENES.forEach((_, i) => {
        if (i === 0) return
        const at = (i - 1) * STEP + 0.6
        tl.to(scenes[i - 1], { autoAlpha: 0, scale: 1.12, duration: 1 }, at)
          .to(scenes[i], { autoAlpha: 1, scale: 1, duration: 1 }, at)
          .to(copies[i - 1], { autoAlpha: 0, y: -40, duration: 0.5 }, at)
          .set(copies[i - 1], { pointerEvents: "none" }, at + 0.45)
          .to(copies[i], { autoAlpha: 1, y: 0, duration: 0.45 }, at + 0.35)
          .set(copies[i], { pointerEvents: "auto" }, at + 0.45)
          .to("[data-dot]", { backgroundColor: "rgba(250,249,246,0.25)", duration: 0.1 }, at)
          .to(`[data-dot="${i}"]`, { backgroundColor: "#FBB034", duration: 0.1 }, at)
      })
      tl.to({}, { duration: 0.6 }) // hold the last scene before the page moves on
      ScrollTrigger.refresh()
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="cine-grain relative h-[100svh] overflow-hidden bg-ground">
      {/* scene plates */}
      {SCENES.map((s, i) => (
        <div key={s.img} data-scene className={`pointer-events-none absolute inset-0 will-change-transform ${i > 0 ? "invisible opacity-0" : ""}`}>
          <picture>
            {"imgMobile" in s && s.imgMobile && <source media="(max-width: 767px)" srcSet={`/renders/${s.imgMobile}`} />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/renders/${s.img}`}
              alt={s.alt}
              className={`h-full w-full object-cover ${"imgMobile" in s && s.imgMobile ? "max-md:!object-center" : ""}`}
              style={{ objectPosition: s.pos }}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
            />
          </picture>
        </div>
      ))}
      {/* Phone: shade only behind the copy at the top, let the photo breathe below. */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,15,24,0.92) 0%, rgba(7,15,24,0.74) 40%, rgba(7,15,24,0.3) 58%, rgba(7,15,24,0) 68%, rgba(7,15,24,0.55) 92%, rgba(7,15,24,0.85) 100%)",
        }}
      />
      {/* Desktop: side + bottom vignette behind left-aligned copy. */}
      <div className="cine-vignette absolute inset-0 hidden md:block" />
      <div className="absolute inset-x-0 bottom-0 hidden h-[65%] bg-gradient-to-t from-ground via-ground/55 to-transparent md:block" />
      <div className="absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-r from-ground/90 via-ground/55 to-transparent md:block" />

      <FallingPapers />

      {/* copy */}
      <div className="cine-container relative z-10 flex h-full flex-col [justify-content:safe_center] pb-16 pt-24 sm:pb-24 sm:pt-24">
        <div className="relative min-h-[22rem] sm:min-h-[26rem]">
          {SCENES.map((s, i) => (
            <div
              key={s.img}
              data-copy
              className={`${i === 0 ? "relative mx-auto flex flex-col items-center text-center" : "absolute inset-0 invisible opacity-0 pointer-events-none md:top-auto"} max-w-3xl`}
            >
              {"brand" in s && s.brand && (
                <div className="mb-3 hidden sm:[@media(min-height:860px)]:block">
                  <BrandLockup href="/" className="justify-center" />
                </div>
              )}
              <p className={`cine-label cine-shadow ${i === 0 ? "mb-3 hidden sm:block sm:!text-xs sm:!tracking-[0.12em]" : "mb-6"}`}>{s.label}</p>
              {i === 0 ? (
                <h1 className="cine-shadow font-display text-cream">
                  <span className="block text-[clamp(2.3rem,5.4vw,4.25rem)] font-semibold leading-[1.05] tracking-[-0.02em]">{s.title[0]}</span>{" "}
                  <span className="cine-serif block text-[clamp(2.15rem,5vw,4rem)] leading-[1.05] text-accent-light">{s.title[1]}</span>
                </h1>
              ) : (
                <h2 className="cine-h1 cine-shadow text-cream">
                  <span className="block">{s.title[0]}</span>
                  <span className="cine-serif block text-accent-light">{s.title[1]}</span>
                </h2>
              )}
              <p className={`cine-body cine-shadow max-w-2xl !text-cream ${i === 0 ? "mx-auto mt-4 !text-[15px] !leading-relaxed sm:!text-lg" : "mt-6 rounded-xl bg-ground/55 px-4 py-3 backdrop-blur-[2px] sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-0"}`}>
                {s.sub}
              </p>
              {"intro" in s && s.intro && (
                <>
                  <ul className="mt-5 hidden flex-wrap justify-center gap-2 sm:flex" aria-label="Matters people use Ask AI Legal for">
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
                  <div className="mt-5 flex w-full flex-col items-center gap-2.5 sm:mt-6 sm:flex-row sm:justify-center sm:gap-3">
                    <Link href={CONSULT_HREF} className="cine-btn-gold w-full sm:w-auto">
                      {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    {DEMO_VIDEO_READY ? (
                      <Link href="#demo" className="cine-btn-ghost w-full sm:w-auto">
                        Watch the demo
                      </Link>
                    ) : (
                      <Link href="/pricing" className="cine-btn-ghost w-full sm:w-auto">
                        See pricing
                      </Link>
                    )}
                  </div>
                </>
              )}
              {"cta" in s && s.cta && (
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link href={CONSULT_HREF} className="cine-btn-gold">
                    {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link href="/pricing" className="cine-btn-ghost">
                    See pricing
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

      <p className="cine-label absolute bottom-8 left-5 hidden !text-cream/40 sm:left-8 sm:[@media(min-height:860px)]:block">Scroll</p>
    </section>
  )
}
