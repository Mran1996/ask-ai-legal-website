"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  /** filename inside /public/renders, e.g. "hero-desk.png" */
  src: string
  alt?: string
  className?: string
  imgClassName?: string
  /** label shown on the placeholder until the render exists */
  label?: string
  priority?: boolean
  /** render nothing (instead of a placeholder) while the file is missing */
  hideIfMissing?: boolean
}

/**
 * Shows an AI render from /public/renders. If the file is missing yet,
 * shows a dark gold-glow placeholder so layout and motion can be reviewed first.
 */
export function Render({ src, alt = "", className = "", imgClassName = "", label, priority, hideIfMissing }: Props) {
  const [missing, setMissing] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // If the image already failed before hydration, onError never fires — check on mount.
  useEffect(() => {
    const el = imgRef.current
    if (el && el.complete && el.naturalWidth === 0) setMissing(true)
  }, [])

  if (missing && hideIfMissing) return null

  if (missing) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-cream/[0.06] bg-ground-surface ${className}`}>
        <div className="cine-glow absolute inset-0" />
        <div className="absolute inset-0 flex items-end p-4">
          <span className="cine-label !text-cream/25">{label ?? src} · coming</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={`/renders/${src}`}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setMissing(true)}
        className={`h-full w-full object-cover ${imgClassName}`}
        draggable={false}
      />
    </div>
  )
}
