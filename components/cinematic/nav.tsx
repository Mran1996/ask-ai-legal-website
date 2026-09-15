"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { BrandLockup } from "@/components/brand-lockup"

const LINKS = [
  { href: "/#install", label: "The install" },
  { href: "/#compare", label: "Why us" },
  { href: "/#process", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
]

export function CineNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[70] transition-all duration-500 ${
        open ? "bg-ground border-b border-cream/[0.06]" : scrolled ? "bg-ground/70 backdrop-blur-md border-b border-cream/[0.06]" : "bg-transparent"
      }`}
    >
      <div className="cine-container flex h-[4.5rem] items-center justify-between">
        <BrandLockup href="/" variant="header" />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-sans text-sm text-cream/70 transition-colors hover:text-cream"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/pay" className="cine-btn-gold hidden !px-5 !py-2.5 !text-xs sm:inline-flex">
            Tell us what you&apos;re facing
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 top-[4.5rem] z-[65] overflow-y-auto bg-ground lg:hidden" style={{ backgroundColor: "#070f18" }}>
          <nav className="cine-container flex flex-col gap-2 py-8" aria-label="Mobile">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="cine-h3 border-b border-cream/[0.08] py-4 text-cream"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/pay" onClick={() => setOpen(false)} className="cine-btn-gold mt-6 w-full">
              Tell us what you&apos;re facing
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
