"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mail, Menu, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { BrandLockup } from "@/components/brand-lockup"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/components/language-provider"
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/site-config"

function isLinkActive(pathname: string, href: string) {
  if (href === "/about") return pathname === "/about"
  if (href === "/services") return pathname === "/services"
  if (href.startsWith("/#")) return pathname === "/"
  return pathname === href
}

function NavLink({
  href,
  label,
  active,
  onClick,
  className = "",
}: {
  href: string
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`nav-link ${active ? "nav-link-active" : ""} ${className}`}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  )
}

export function Navigation() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  const utilityLinks = useMemo(
    () => [
      { href: "/#contact", label: t.nav.freeReview },
      { href: "/#faq", label: t.nav.help },
      { href: "/about", label: t.nav.about },
      { href: SUPPORT_MAILTO, label: SUPPORT_EMAIL },
    ],
    [t]
  )

  const mainLinks = useMemo(
    () => [
      { href: "/about", label: t.nav.about },
      { href: "/services", label: t.nav.services },
      { href: "/#compare", label: t.nav.whyUs },
      { href: "/#process", label: t.nav.process },
      { href: "/#faq", label: t.nav.faq },
      { href: "/#contact", label: t.nav.contact },
    ],
    [t]
  )

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-navy/8 bg-cream shadow-[0_1px_0_rgba(27,42,65,0.06)]">
      <div className="hidden border-b border-navy/6 bg-cream-dark/80 sm:block">
        <div className="container-main flex h-8 items-center justify-end gap-3">
          {utilityLinks.map((link, index) => (
            <span key={link.href} className="flex items-center">
              {index > 0 && (
                <span className="mx-3 text-[10px] text-navy/25" aria-hidden>
                  |
                </span>
              )}
              <Link href={link.href} className="utility-link">
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      </div>

      <div className="container-main relative flex min-h-[3.75rem] items-center sm:min-h-[3.5rem]">
        <div className="z-10 flex shrink-0 items-center">
          <BrandLockup href="/" variant="header" />
        </div>

        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex"
          aria-label="Main"
        >
          <ul className="flex items-center gap-7 xl:gap-9">
            {mainLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  label={link.label}
                  active={isLinkActive(pathname, link.href)}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="z-10 ml-auto flex items-center gap-2 sm:gap-3">
          <LanguageSelector compact />
          <a
            href={SUPPORT_MAILTO}
            className="header-call-pill hidden sm:inline-flex"
            aria-label={`Email ${SUPPORT_EMAIL}`}
          >
            <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{t.nav.emailForReview}</span>
          </a>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md text-navy transition-colors hover:bg-navy/5 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-navy/8 bg-cream px-5 py-5 lg:hidden" aria-label="Mobile">
          <ul className="flex flex-col">
            {mainLinks.map((link) => (
              <li key={link.href} className="border-b border-navy/6 last:border-0">
                <NavLink
                  href={link.href}
                  label={link.label}
                  active={isLinkActive(pathname, link.href)}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 text-sm"
                />
              </li>
            ))}
          </ul>
          <a
            href={SUPPORT_MAILTO}
            className="header-call-pill mt-4 w-full justify-center py-3"
            onClick={() => setOpen(false)}
          >
            <Mail className="h-4 w-4" aria-hidden />
            <span>{SUPPORT_EMAIL}</span>
          </a>
        </nav>
      )}
    </header>
  )
}
