"use client"

import Link from "next/link"
import { ArrowRight, Shield } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { SERVICE_ICONS } from "@/lib/service-icons"

/** Homepage teaser only — full list lives on /services */
const FEATURED_SERVICE_INDICES = [0, 1, 4, 6] as const

export function DoneForYou() {
  const { t } = useLanguage()

  const featured = FEATURED_SERVICE_INDICES.flatMap((index) => {
    const service = t.services.items[index]
    return service ? [{ index, service }] : []
  })

  return (
    <section id="services" className="section-pad bg-cream">
      <div className="container-main">
        <div className="mx-auto max-w-3xl text-center">
          <p className="firm-label text-gold-dark">{t.services.label}</p>
          <div className="gold-rule mx-auto mb-6" />
          <h2 className="firm-title text-navy">
            {t.services.titleLine1}
            <br />
            <span className="italic text-gold-dark">{t.services.titleLine2}</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">{t.services.intro}</p>
        </div>

        <ul className="mx-auto mt-12 grid max-w-4xl gap-5 sm:mt-14 sm:grid-cols-2 lg:gap-6">
          {featured.map(({ index, service }, displayIndex) => {
            const Icon = SERVICE_ICONS[index]

            return (
              <li
                key={service.title}
                className="firm-card group flex flex-col border-2 border-gold/35 bg-white shadow-[0_0_24px_rgba(197,160,89,0.08),inset_0_1px_0_rgba(232,220,200,0.65)] transition-all duration-300 hover:border-gold/50 hover:shadow-[0_0_28px_rgba(197,160,89,0.14)]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-cream transition-colors group-hover:border-gold/55">
                    {Icon && (
                      <Icon
                        className="h-5 w-5 text-gold-dark transition-colors group-hover:text-gold"
                        aria-hidden
                      />
                    )}
                  </div>
                  <span className="font-display text-4xl font-light leading-none text-navy/5">
                    {String(displayIndex + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="font-display text-xl font-semibold leading-snug text-navy sm:text-2xl">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{service.description}</p>
              </li>
            )
          })}
        </ul>

        <p className="mt-12 text-center sm:mt-14">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-sm border border-gold/35 bg-white px-5 py-3 text-sm font-semibold text-gold-dark transition-colors hover:border-gold/55 hover:text-gold"
          >
            {t.servicesPage.homeLink}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </p>

        <div className="mx-auto mt-8 flex max-w-3xl items-start gap-3 rounded-sm border border-gold/30 bg-white/70 p-5 sm:p-6">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" aria-hidden />
          <p className="text-sm leading-relaxed text-gray-600">
            <strong className="text-navy">{t.services.importantLabel}</strong> {t.services.importantText}
          </p>
        </div>
      </div>
    </section>
  )
}
