"use client"

import { useEffect, useState } from "react"
import { Render } from "./render"

/**
 * An image slot: shows the render from /public/renders when it exists.
 * Until then it is a quiet dark panel with a soft gold glow (no placeholder objects).
 */
export function Slot({
  src,
  className = "",
  imgClassName = "",
  alt = "",
  quiet = false,
}: {
  src: string
  className?: string
  imgClassName?: string
  alt?: string
  /** render nothing at all while missing */
  quiet?: boolean
}) {
  const [exists, setExists] = useState<boolean | null>(null)

  useEffect(() => {
    let alive = true
    const img = new Image()
    img.onload = () => alive && setExists(true)
    img.onerror = () => alive && setExists(false)
    img.src = `/renders/${src}`
    return () => {
      alive = false
    }
  }, [src])

  if (exists) return <Render src={src} alt={alt} className={className} imgClassName={imgClassName} />
  if (quiet || exists === null) return <div className={className} aria-hidden />
  return (
    <div className={`relative overflow-hidden bg-ground-surface ${className}`} aria-hidden>
      <div className="cine-glow absolute inset-0 opacity-60" />
    </div>
  )
}
