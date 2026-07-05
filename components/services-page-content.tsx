"use client"

import { ArrowRight, Check, Shield } from "lucide-react"
import { NeonButton } from "@/components/neon-button"
import { useLanguage } from "@/components/language-provider"
import { SERVICE_ICONS, serviceSlug } from "@/lib/service-icons"
import { SUPPORT_MAILTO } from "@/lib/site-config"

export function ServicesPageContent() {
  const { t } = useLanguage()
  const page = t.servicesPage

  return (
    <main className="flex-grow pt-[7.25rem] sm:pt-[7.75rem]">
      <section className="section-navy section-pad">
        <div className="container-main max-w-4xl">
          <p className="firm-label">{page.label}</p>
          <div className="gold-rule mb-8" />
          <h1 className="firm-title text-white">{page.title}</h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70">{page.intro}</p>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="container-main">
          <div className="max-w-2xl">
            <p className="firm-label text-gold-dark">{page.flow.label}</p>
            <div className="gold-rule mb-6" />
            <h2 className="firm-title text-navy">{page.flow.title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">{page.flow.narrative}</p>
          </div>

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {page.flow.steps.map((step, index) => (
              <li
                key={step}
                className="firm-card flex flex-col border border-gold/25 bg-white/80 py-5 text-center"
              >
                <span className="font-display text-3xl font-light text-gold/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-2 text-sm font-semibold uppercase tracking-wide text-navy">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-main">
          <div className="max-w-2xl">
            <p className="firm-label text-gold-dark">{page.deepDivesLabel}</p>
            <div className="gold-rule mb-6" />
            <h2 className="firm-title text-navy">{page.deepDivesTitle}</h2>
          </div>

          <ul className="mt-16 space-y-10">
            {t.services.items.map((service, index) => {
              const Icon = SERVICE_ICONS[index]
              const extra = page.items[index]
              const slug = serviceSlug(service.title)

              if (!extra) return null

              return (
                <li
                  key={service.title}
                  id={slug}
                  className="firm-card scroll-mt-32 border-2 border-gold/30 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10"
                >
                  <div>
                    <div className="mb-5 flex items-center gap-4">
                      {Icon && (
                        <Icon className="h-8 w-8 shrink-0 text-gold-dark" aria-hidden />
                      )}
                      <h3 className="font-display text-2xl font-semibold text-navy">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">{service.description}</p>
                    <p className="mt-4 text-sm leading-relaxed text-gray-600">{extra.detail}</p>
                  </div>
                  <div className="mt-6 rounded-sm border border-gold/20 bg-cream/60 p-5 lg:mt-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-navy">
                      {page.includesLabel}
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {extra.includes.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-gray-600">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark"
                            aria-hidden
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="section-pad bg-cream-dark">
        <div className="container-main max-w-3xl">
          <div className="flex items-start gap-3 rounded-sm border border-gold/30 bg-white p-6 sm:p-8">
            <Shield className="mt-0.5 h-6 w-6 shrink-0 text-gold-dark" aria-hidden />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-navy">
                {page.disclaimer.label}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">{page.disclaimer.text}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-navy section-pad">
        <div className="container-main mx-auto max-w-2xl text-center">
          <h2 className="firm-title text-white">{page.cta.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70">{page.cta.body}</p>
          <NeonButton href={SUPPORT_MAILTO} className="mt-8 inline-flex">
            {page.cta.button}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </NeonButton>
        </div>
      </section>
    </main>
  )
}
