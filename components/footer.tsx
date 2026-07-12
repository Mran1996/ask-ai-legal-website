"use client"

import Link from "next/link"
import { Scale, Instagram, Facebook } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { serviceSlug } from "@/lib/service-icons"
import { SITE_DISCLAIMER, SITE_BRAND_NAME } from "@/lib/site-config"

const social = [
  { label: "Instagram", icon: Instagram },
  { label: "Facebook", icon: Facebook },
]

export function Footer() {
  const { t } = useLanguage()
  const { links, columns } = t.footer

  const linkGroups = [
    {
      title: columns.services,
      links: [
        { label: links.allServices, href: "/services" },
        { label: links.caseRoadmap, href: `/services#${serviceSlug("Case roadmap")}` },
        { label: links.caseResearch, href: `/services#${serviceSlug("Case research")}` },
        { label: links.legalResearch, href: `/services#${serviceSlug("Legal research")}` },
        { label: links.outcomeAnalysis, href: `/services#${serviceSlug("Citation verification")}` },
        { label: links.hearingPrep, href: `/services#${serviceSlug("Hearing preparation")}` },
        { label: links.documentPrep, href: `/services#${serviceSlug("Document preparation")}` },
      ],
    },
    {
      title: columns.company,
      links: [
        { label: links.about, href: "/about" },
        { label: links.process, href: "/#process" },
        { label: links.whyUs, href: "/#compare" },
        { label: links.contact, href: "/#contact" },
        { label: links.faq, href: "/#faq" },
      ],
    },
    {
      title: columns.legal,
      links: [
        { label: links.terms, href: "/terms-of-service" },
        { label: links.privacy, href: "/privacy-policy" },
        { label: links.disclaimer, href: "/disclaimer" },
      ],
    },
  ]

  return (
    <footer className="bg-navy-dark pt-12 pb-8 text-white/60">
      <div className="container-main">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(240px,280px)_1fr] lg:items-start lg:gap-x-10 xl:gap-x-12">
          <div>
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
              <Scale className="h-6 w-6 shrink-0 text-gold" aria-hidden />
              <span className="font-display text-xl font-semibold text-white">{SITE_BRAND_NAME}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">{t.footer.tagline}</p>
            <p className="mt-5 rounded-sm border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-white/50">
              {SITE_DISCLAIMER}
            </p>
            <div className="mt-5 flex gap-3">
              {social.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="flex h-10 w-10 cursor-default items-center justify-center rounded-sm border border-white/10 text-white/70 transition-colors hover:border-gold/40 hover:text-gold"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </button>
              ))}
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-8 lg:gap-x-10">
          {linkGroups.map(({ title, links: colLinks }) => (
            <div key={title} className="min-w-0">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                {title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {colLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm transition-colors hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="min-w-0">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
              {columns.social}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {social.map(({ label, icon: Icon }) => (
                <li key={label}>
                  <button
                    type="button"
                    className="flex cursor-default items-center gap-2 text-sm transition-colors hover:text-gold"
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs">© {new Date().getFullYear()} Ask AI Legal. All rights reserved.</p>
          <p className="text-xs text-white/40">{t.footer.documentOnly}</p>
        </div>
      </div>
    </footer>
  )
}
