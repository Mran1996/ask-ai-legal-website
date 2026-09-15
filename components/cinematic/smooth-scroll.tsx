"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** Lenis smooth scroll wired into GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenis.on("scroll", ScrollTrigger.update)
    // Same-page anchors: scroll with Lenis so pinned sections resolve correctly.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href*='#']") as HTMLAnchorElement | null
      if (!a) return
      const url = new URL(a.href, location.href)
      if (url.pathname !== location.pathname || !url.hash) return
      const target = document.querySelector(url.hash)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -72 })
      history.replaceState(null, "", url.hash)
    }
    document.addEventListener("click", onClick)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      document.removeEventListener("click", onClick)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
  return null
}
