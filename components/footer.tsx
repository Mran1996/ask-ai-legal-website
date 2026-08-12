"use client"

import Link from "next/link"
import { Scale, Instagram, Facebook } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { serviceSlug } from "@/lib/service-icons"
import {
  BUSINESS_HOURS,
  BUSINESS_PHONE,
  BUSINESS_SERVICE_AREAS,
  SITE_DISCLAIMER,
  SITE_BRAND_NAME,
  SITE_LEGAL_NAME,
  SOCIAL_LINKS,
  SUPPORT_EMAIL,
} from "@/lib/site-config"

const social = [
  { label: "Instagram", icon: Instagram, href: SOCIAL_LINKS.instagram },
  { label: "Facebook", icon: Facebook, href: SOCIAL_LINKS.facebook },
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
        { label: links.legalResearch, href: `/services#${serviceSlug("In-depth research")}` },
        { label: links.outcomeAnalysis, href: `/services#${serviceSlug("Source verification")}` },
        { label: links.hearingPrep, href: `/services#${serviceSlug("Hearing preparation")}` },
        { label: links.documentPrep, href: `/services#${serviceSlug("Document preparation")}` },
      ],
    },
    {
      title: columns.company,
      links: [
        { label: links.about, href: "/about" },
        { label: links.pricing, href: "/pricing" },
        { label: "Pay deposit", href: "/pay" },
        { label: links.process, href: "/#process" },
        { label: links.whyUs, href: "/#compare" },
        { label: links.contact, href: "/contact" },
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
            <address className="mt-5 not-italic text-sm leading-relaxed text-white/60">
              <p className="font-semibold text-white/80">{SITE_LEGAL_NAME}</p>
              <p className="mt-2">{BUSINESS_SERVICE_AREAS}</p>
              <p className="mt-1">{BUSINESS_HOURS}</p>
              <p className="mt-1">
                <a href={`mailto:${SUPPORT_EMAIL}`} className="transition-colors hover:text-gold">
                  {SUPPORT_EMAIL}
                </a>
              </p>
              {BUSINESS_PHONE ? (
                <p className="mt-1">
                  <a href={`tel:${BUSINESS_PHONE}`} className="transition-colors hover:text-gold">
                    {BUSINESS_PHONE}
                  </a>
                </p>
              ) : null}
            </address>
            <p className="mt-5 rounded-sm border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-white/50">
              {SITE_DISCLAIMER}
            </p>
            <div className="mt-5 flex gap-3">
              {social.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 text-white/70 transition-colors hover:border-gold/40 hover:text-gold"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
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
              {social.map(({ label, icon: Icon, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm transition-colors hover:text-gold"
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs">© {new Date().getFullYear()} {SITE_LEGAL_NAME}. All rights reserved.</p>
          <p className="text-xs text-white/40">{t.footer.documentOnly}</p>
        </div>
      </div>
    </footer>
  )
}
