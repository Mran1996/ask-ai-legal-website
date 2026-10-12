"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { BrandLockup } from "@/components/brand-lockup"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { prefersReducedMotion } from "./smooth-scroll"
import { CONSULT_CTA_LABEL, CONSULT_HREF, THIRD_PARTY_COSTS_NOTE } from "@/lib/site-config"

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
    title: ["Your legal workspace.", "Installed on your computer."],
    sub: "Purchase your own installed copy of Ask AI Legal for $3,997. We install and configure your workspace, help you set up your first case, and personally show you how to organize documents, research legal sources, and prepare drafts for review. Your purchase includes a walkthrough video of the installation and the software, plus 30 days of installation support. Optional maintenance is available for $125 per month.",
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
    sub: "We check your computer, then install and configure your workspace with you — and explain each step as we go.",
    pos: "60% center",
  },
  {
    img: "story-03-drafting.png",
    imgMobile: "story-03-drafting-m.png",
    alt: "Self-represented woman drafting court documents from home on her laptop",
    label: "03 · Your pace",
    title: ["You do the", "work."],
    sub: "Organize documents, research legal sources, and prepare drafts for your review — from home, at your own pace.",
    pos: "60% center",
  },
  {
    img: "story-04-ready.png",
    alt: "Woman leaving home with her organized legal binder, prepared for court",
    label: "04 · Organized",
    title: ["Your papers,", "in order."],
    sub: "Your documents organized. Your drafts ready for you to review, check, and finish.",
    pos: "55% center",
  },
  {
    img: "story-05-courthouse.png",
    alt: "Woman walking up courthouse steps carrying her own case binder",
    label: "05 · Your matter",
    title: ["Your matter.", "Your voice."],
    sub: "You decide what to file and what to say. Ask AI Legal helps you organize and prepare — it does not represent you.",
    pos: "40% center",
  },
  {
    img: "story-06-home.png",
    imgMobile: "story-06-home-m.png",
    alt: "Woman relaxed at her kitchen table after handling her legal matter from home",
    label: "06 · After",
    title: ["From home.", "On your terms."],
    sub: "A $3,997 one-time purchase, with optional maintenance at $125 per month. We explain additional costs before installation.",
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
            "linear-gradient(to bottom, rgba(7,15,24,0.90) 0%, rgba(7,15,24,0.62) 34%, rgba(7,15,24,0.18) 52%, rgba(7,15,24,0) 68%, rgba(7,15,24,0.55) 92%, rgba(7,15,24,0.85) 100%)",
        }}
      />
      {/* Desktop: side + bottom vignette behind left-aligned copy. */}
      <div className="cine-vignette absolute inset-0 hidden md:block" />
      <div className="absolute inset-x-0 bottom-0 hidden h-[65%] bg-gradient-to-t from-ground via-ground/55 to-transparent md:block" />
      <div className="absolute inset-y-0 left-0 hidden w-[60%] bg-gradient-to-r from-ground/80 to-transparent md:block" />

      <FallingPapers />

      {/* copy */}
      <div className="cine-container relative z-10 flex h-full flex-col justify-center pb-28 pt-20 sm:pb-24 sm:pt-24">
        <div className="relative min-h-[22rem] sm:min-h-[26rem]">
          {SCENES.map((s, i) => (
            <div
              key={s.img}
              data-copy
              className={`${i === 0 ? "relative mx-auto flex flex-col items-center text-center" : "absolute inset-0 invisible opacity-0 pointer-events-none md:top-auto"} max-w-3xl`}
            >
              {"brand" in s && s.brand && (
                <div className="mb-3 hidden sm:block">
                  <BrandLockup href="/" className="justify-center" />
                </div>
              )}
              <p className={`cine-label cine-shadow ${i === 0 ? "mb-3 !tracking-[0.12em]" : "mb-6"}`}>{s.label}</p>
              {i === 0 ? (
                <h1 className="cine-shadow font-display text-cream">
                  <span className="block text-[clamp(1.9rem,5.4vw,4.25rem)] font-semibold leading-[1.05] tracking-[-0.02em]">{s.title[0]}</span>{" "}
                  <span className="cine-serif block text-[clamp(1.8rem,5vw,4rem)] leading-[1.05] text-accent-light">{s.title[1]}</span>
                </h1>
              ) : (
                <h2 className="cine-h1 cine-shadow text-cream">
                  <span className="block">{s.title[0]}</span>
                  <span className="cine-serif block text-accent-light">{s.title[1]}</span>
                </h2>
              )}
              <p className={`cine-body cine-shadow max-w-2xl !text-cream/85 ${i === 0 ? "mx-auto mt-4 !text-[14px] !leading-relaxed sm:!text-base" : "mt-8"}`}>
                {s.sub}
              </p>
              {"intro" in s && s.intro && (
                <>
                  <div className="mt-4 flex flex-col items-center gap-1 sm:flex-row sm:gap-4">
                    <p className="cine-shadow font-display text-lg font-semibold text-accent-light sm:text-xl">$3,997 one-time purchase</p>
                    <span className="hidden text-cream/40 sm:inline" aria-hidden>
                      ·
                    </span>
                    <p className="cine-shadow font-display text-base text-cream sm:text-xl">Optional maintenance: $125/month.</p>
                  </div>
                  <p className="cine-shadow mx-auto mt-2 max-w-xl text-xs leading-relaxed text-cream/65 sm:text-sm">{THIRD_PARTY_COSTS_NOTE}</p>
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
                  <div className="mt-6 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Link href={CONSULT_HREF} className="cine-btn-gold w-full sm:w-auto">
                      {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    <Link href="/pricing" className="cine-btn-ghost w-full sm:w-auto">
                      See pricing
                    </Link>
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

      <p className="cine-label absolute bottom-8 left-5 hidden !text-cream/40 sm:left-8 sm:block">Scroll</p>
    </section>
  )
}
