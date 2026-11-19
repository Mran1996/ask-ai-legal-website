import Link from "next/link"
import { Phone } from "lucide-react"
import { VOICE_PHONE_DISPLAY, VOICE_PHONE_TEL } from "@/lib/site-config"

/** Shared look for the redesigned pages (home redesign, Nov 2026). Use these so every page feels the same. */
export const serif = "font-[family-name:var(--font-serif)] font-normal"
export const ink = "text-[#f3ead8]"
export const muted = "text-[#a9b3c1]"
export const gold = "text-[#e8c98a]"
export const card = "rounded-2xl border border-white/[0.07] bg-white/[0.025]"
export const PAGE_BG = "min-h-screen bg-[#0b131d] font-sans"
export const ALT_BG = "bg-[#0e1824]"

export const PRIMARY_BTN =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#f3ead8] px-6 py-3 font-sans text-sm font-semibold text-[#0b131d] transition hover:bg-white"
export const GHOST_BTN =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 font-sans text-sm font-semibold text-[#f3ead8] transition hover:border-white/40"

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[#e8c98a]/80">{children}</p>
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className={`${serif} ${ink} text-[clamp(2rem,4vw,3.1rem)] leading-[1.08] tracking-[-0.01em]`}>{children}</h2>
}

export function H1({ children }: { children: React.ReactNode }) {
  return <h1 className={`${serif} ${ink} text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.05] tracking-[-0.015em]`}>{children}</h1>
}

const NAV = [
  { href: "/#brain", label: "Second Brain" },
  { href: "/#research", label: "Research" },
  { href: "/#compare", label: "Compare" },
  { href: "/plans", label: "Pricing" },
  { href: "/#how", label: "How it works" },
  { href: "/#faq", label: "Questions" },
]

/** Quiet header: logo, a few links, phone, one button. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0b131d]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className={`${serif} ${ink} text-xl`}>
          Ask AI Legal
        </Link>
        <nav className={`hidden gap-7 text-sm md:flex ${muted}`}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-[#f3ead8]">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a
            href={`tel:${VOICE_PHONE_TEL}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#f3ead8] hover:text-[#e8c98a]"
            aria-label={`Call ${VOICE_PHONE_DISPLAY}`}
          >
            <Phone className="h-4 w-4 text-[#e8c98a]" aria-hidden />
            <span className="hidden sm:inline">{VOICE_PHONE_DISPLAY}</span>
          </a>
          <Link href="/plans" className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-[#f3ead8] hover:border-white/40">
            See plans
          </Link>
        </div>
      </div>
    </header>
  )
}
