"use client"

import { ArrowRight } from "lucide-react"
import { NeonButton } from "@/components/neon-button"
import { useLanguage } from "@/components/language-provider"

export function HowItWorks() {
  const { t } = useLanguage()

  return (
    <section id="process" className="section-pad bg-cream">
      <div className="container-main">
        <div className="mx-auto max-w-3xl text-center">
          <p className="firm-label text-gold-dark">{t.process.label}</p>
          <div className="gold-rule mx-auto mb-6" />
          <h2 className="firm-title text-navy">
            {t.process.titleLine1 ?? t.process.title}{" "}
            <span className="italic text-gold-dark">{t.process.titleHighlight}</span>
          </h2>
        </div>

        <ol className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3 sm:mt-14">
          {t.process.steps.map((item, i) => (
            <li
              key={item.title}
              className="firm-card flex flex-col border border-gold/20 bg-white p-6 shadow-sm sm:p-8"
            >
              <span className="font-display text-5xl font-light leading-none text-gold/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-navy sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">{item.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex justify-center sm:mt-14">
          <NeonButton href="/pay" className="btn-neon-light">
            {t.process.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </NeonButton>
        </div>
      </div>
    </section>
  )
}
