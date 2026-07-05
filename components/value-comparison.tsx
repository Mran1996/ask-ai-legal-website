"use client"

import { ArrowRight, Mail } from "lucide-react"
import { PaperShaderBackground } from "@/components/paper-shader-background"
import { NeonButton } from "@/components/neon-button"
import { useLanguage } from "@/components/language-provider"
import { SUPPORT_MAILTO } from "@/lib/site-config"

export function ValueComparison() {
  const { t } = useLanguage()

  return (
    <section id="compare" className="section-pad relative overflow-hidden text-white">
      <PaperShaderBackground variant="section" className="absolute inset-0" />
      <div className="container-main relative">
        <div className="text-center">
          <p className="firm-label text-accent-light">{t.compare.label}</p>
          <div className="mx-auto mb-8 h-px w-12 bg-accent/60" />
          <h2 className="firm-title mx-auto max-w-3xl">
            {t.compare.titleLine1}{" "}
            <span className="text-gradient-accent italic">{t.compare.titleHighlight}</span>{" "}
            {t.compare.titleLine2}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/60">{t.compare.subtitle}</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2">
          <div className="rounded-sm border border-white/10 bg-white/5 p-6 opacity-70 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
              {t.compare.traditionalHeading}
            </p>
            <p className="mt-4 font-display text-3xl font-semibold text-white/80">{t.compare.traditionalPrice}</p>
            <p className="mt-2 text-sm text-white/50">{t.compare.traditionalDesc}</p>
            <ul className="mt-8 space-y-3 text-sm text-white/60">
              {t.compare.traditionalBullets.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-sm border-2 border-accent/50 bg-navy-light/90 p-6 shadow-neon backdrop-blur-sm sm:p-8">
            <div className="absolute -top-3 left-6 rounded-sm bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy">
              {t.compare.usBadge}
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-light">{t.compare.usHeading}</p>
            <p className="mt-4 font-display text-3xl font-semibold text-accent-light">{t.compare.usPrice}</p>
            <p className="mt-2 text-sm text-white/70">{t.compare.usDesc}</p>
            <ul className="mt-8 space-y-3 text-sm text-white/80">
              {t.compare.usBullets.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
            <NeonButton href={SUPPORT_MAILTO} className="btn-neon mt-8 inline-flex w-full sm:w-auto">
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
              <span>{t.compare.cta}</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </NeonButton>
          </div>
        </div>
      </div>
    </section>
  )
}
