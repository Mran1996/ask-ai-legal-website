"use client"

import { ChevronDown, Globe } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/components/language-provider"

function LanguageGlobe({ size = "sm" }: { size?: "sm" | "md" }) {
  const ball = size === "sm" ? "h-6 w-6" : "h-7 w-7"
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"

  return (
    <span
      className={`relative flex ${ball} shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold via-gold-light to-gold-dark text-navy shadow-[0_0_10px_rgba(197,160,89,0.45)] ring-2 ring-gold/30`}
      aria-hidden
    >
      <Globe className={`${icon} stroke-[2.25px]`} />
    </span>
  )
}

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, languages, setLanguage, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={
          compact
            ? "inline-flex items-center gap-1.5 rounded-full py-0.5 pl-0.5 pr-2 text-[11px] font-semibold text-navy transition-colors hover:bg-gold/10"
            : "inline-flex items-center gap-2 rounded-full border-2 border-gold/35 bg-white py-1 pl-1 pr-3 text-xs font-semibold text-navy shadow-sm transition-colors hover:border-gold/55 hover:bg-cream-dark"
        }
        aria-label={t.nav.language}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <LanguageGlobe size={compact ? "sm" : "md"} />
        <span>{language.label}</span>
        <ChevronDown
          className={`h-3 w-3 shrink-0 text-gold-dark transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.nav.language}
          className="absolute right-0 top-full z-[60] mt-1.5 max-h-64 min-w-[11rem] overflow-y-auto rounded-md border border-gold/25 bg-white py-1 shadow-firm"
        >
          {languages.map((item) => (
            <li key={item.value} role="option" aria-selected={item.value === language.value}>
              <button
                type="button"
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-gold/10 ${
                  item.value === language.value ? "bg-gold/15 font-semibold text-navy" : "text-navy/80"
                }`}
                onClick={() => {
                  setLanguage(item)
                  setOpen(false)
                }}
              >
                {item.value === language.value && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                )}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
