"use client"

import { useEffect, useRef, useState } from "react"

type CountUpStatProps = {
  value: number
  prefix?: string
  suffix?: string
  durationMs?: number
  tickMs?: number
  className?: string
}

export function CountUpStat({
  value,
  prefix = "",
  suffix = "",
  durationMs = 1500,
  tickMs = 40,
  className,
}: CountUpStatProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [display, setDisplay] = useState(0)
  const [started, setStarted] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduceMotion(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return

    if (reduceMotion) {
      setDisplay(value)
      return
    }

    const steps = Math.max(1, Math.floor(durationMs / tickMs))
    let step = 0

    const timer = window.setInterval(() => {
      step += 1
      const progress = step / steps
      const next = Math.min(value, Math.round(progress * value))
      setDisplay(next)
      if (step >= steps) {
        setDisplay(value)
        window.clearInterval(timer)
      }
    }, tickMs)

    return () => window.clearInterval(timer)
  }, [started, value, durationMs, tickMs, reduceMotion])

  return (
    <p ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </p>
  )
}

export type HeroStatItem = {
  kind: "text" | "count"
  value?: number
  prefix?: string
  suffix?: string
  display?: string
  label: string
  sub: string
}
