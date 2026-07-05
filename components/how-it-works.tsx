"use client"

import { ArrowRight, FileCheck, FileText, MessageSquare } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { NeonButton } from "@/components/neon-button"
import { useLanguage } from "@/components/language-provider"
import { SUPPORT_MAILTO } from "@/lib/site-config"

const STEP_ICONS: LucideIcon[] = [MessageSquare, FileText, FileCheck]

export function HowItWorks() {
  const { t } = useLanguage()

  return (
    <section id="process" className="section-pad bg-white">
      <div className="container-main">
        <div className="mx-auto max-w-3xl text-center">
          <p className="firm-label text-gold-dark">{t.process.label}</p>
          <div className="gold-rule mx-auto mb-6" />
          <h2 className="firm-title text-navy">{t.process.title}</h2>
        </div>

        <div className="relative mx-auto mt-14 max-w-5xl sm:mt-16">
          <div
            className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-14 hidden h-px bg-gold/25 sm:block"
            aria-hidden
          />

          <ol className="grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-8">
            {t.process.steps.map((item, i) => {
              const Icon = STEP_ICONS[i] ?? FileText

              return (
                <li
                  key={item.title}
                  className="firm-card relative flex flex-col items-center border-2 border-gold/35 bg-cream px-6 py-8 text-center shadow-[0_0_24px_rgba(197,160,89,0.1),inset_0_1px_0_rgba(232,220,200,0.65)] sm:px-5 sm:py-9"
                >
                  <span className="absolute -top-3.5 left-1/2 flex h-7 min-w-7 -translate-x-1/2 items-center justify-center rounded-full bg-gold px-2 text-[11px] font-bold tracking-wide text-navy">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-white shadow-sm">
                    <Icon className="h-5 w-5 text-gold-dark" aria-hidden />
                  </div>

                  <h3 className="font-display text-xl font-semibold leading-snug text-navy sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.body}</p>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="mt-12 flex justify-center sm:mt-14">
          <NeonButton href={SUPPORT_MAILTO} className="btn-neon-light">
            {t.process.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </NeonButton>
        </div>
      </div>
    </section>
  )
}
