"use client"

import { useEffect, useState } from "react"

type TypewriterTextProps = {
  text: string
  className?: string
  speed?: number
  startDelay?: number
  showCursor?: boolean
}

export function TypewriterText({
  text,
  className = "",
  speed = 65,
  startDelay = 300,
  showCursor = true,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setDisplayed(text)
      setDone(true)
      return
    }

    let index = 0
    let tickTimeout: ReturnType<typeof setTimeout>
    const startTimeout = setTimeout(() => {
      const tick = () => {
        if (index <= text.length) {
          setDisplayed(text.slice(0, index))
          index += 1
          tickTimeout = setTimeout(tick, speed)
        } else {
          setDone(true)
        }
      }
      tick()
    }, startDelay)

    return () => {
      clearTimeout(startTimeout)
      clearTimeout(tickTimeout)
    }
  }, [text, speed, startDelay, reduceMotion])

  return (
    <span className={className}>
      {displayed}
      {showCursor && !done && (
        <span className="typewriter-cursor ml-0.5 text-accent" aria-hidden>
          |
        </span>
      )}
    </span>
  )
}
