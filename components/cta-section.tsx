"use client"

import { ArrowRight } from "lucide-react"
import { PaperShaderBackground } from "@/components/paper-shader-background"
import { NeonButton } from "@/components/neon-button"
import { useLanguage } from "@/components/language-provider"

export function CtaSection() {
  const { t } = useLanguage()

  return (
    <section id="contact" className="section-pad relative overflow-hidden">
      <PaperShaderBackground variant="section" className="absolute inset-0" />
      <div className="container-main relative">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
          <p className="firm-label text-accent-light">{t.cta.label}</p>
          <h2 className="firm-title relative mx-auto mt-4 max-w-2xl text-white">{t.cta.title}</h2>
          <p className="relative mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/65">
            {t.cta.body}
          </p>
          <NeonButton href="/pay" className="btn-neon relative mt-10 inline-flex flex-row items-center gap-2">
            <span>{t.cta.emailConsult}</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </NeonButton>
          <p className="relative mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-white/40">
            {t.cta.disclaimer}
          </p>
        </div>
      </div>
    </section>
  )
}
