"use client"

import { ArrowRight, FileSearch } from "lucide-react"
import { PaperShaderBackground } from "@/components/paper-shader-background"
import { useLanguage } from "@/components/language-provider"
import { openChatWidget } from "@/lib/chat/open-chat"

export function CtaSection() {
  const { t } = useLanguage()

  return (
    <section id="contact" className="section-pad relative overflow-hidden">
      <PaperShaderBackground variant="section" className="absolute inset-0" />
      <div className="container-main relative">
        <div className="relative overflow-hidden rounded-md border border-accent/30 bg-navy-light/80 px-8 py-16 text-center backdrop-blur-sm sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-dark/10" aria-hidden />
          <p className="firm-label relative text-accent-light">{t.cta.label}</p>
          <h2 className="firm-title relative mx-auto max-w-2xl text-white">
            {t.cta.title}
          </h2>
          <p className="relative mx-auto mt-5 max-w-lg text-white/65">
            {t.cta.body}
          </p>
          <button
            type="button"
            onClick={() => openChatWidget("quote")}
            className="btn-neon relative mt-10 inline-flex flex-row items-center gap-2"
          >
            <FileSearch className="h-4 w-4 shrink-0" aria-hidden />
            <span>{t.cta.emailConsult}</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </button>
          <p className="relative mt-6 text-xs text-white/40">
            {t.cta.disclaimer}
          </p>
        </div>
      </div>
    </section>
  )
}
