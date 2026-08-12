"use client"

type PaperShaderBackgroundProps = {
  variant?: "hero" | "section"
  className?: string
}

export function PaperShaderBackground({
  variant = "hero",
  className = "",
}: PaperShaderBackgroundProps) {
  return (
    <div
      className={`paper-shader paper-shader--${variant} ${className}`}
      aria-hidden
    >
      <div className="paper-shader__glow paper-shader__glow--1 motion-reduce:animate-none" />
      <div className="paper-shader__glow paper-shader__glow--2 motion-reduce:animate-none" />
      <div className="paper-shader__glow paper-shader__glow--3" />
      <div className="paper-shader__grain" />
    </div>
  )
}
