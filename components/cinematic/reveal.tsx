"use client"

import { useEffect, useRef, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { prefersReducedMotion } from "./smooth-scroll"

gsap.registerPlugin(ScrollTrigger)

/** Fades/lifts children in when they scroll into view. Wrap any block. */
export function Reveal({ children, className = "", stagger = 0.08 }: { children: ReactNode; className?: string; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from("[data-reveal]", {
        opacity: 0,
        y: 32,
        duration: 0.9,
        ease: "power3.out",
        stagger,
        scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [stagger])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
