"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PaperShaderBackground } from "@/components/paper-shader-background"
import { NeonButton } from "@/components/neon-button"
import { BrandLockup } from "@/components/brand-lockup"
import { useLanguage } from "@/components/language-provider"
import { openChatWidget } from "@/lib/chat/open-chat"
import { CountUpStat, type HeroStatItem } from "@/components/count-up-stat"

export function HeroSection() {
  const { t } = useLanguage()

  const stats: HeroStatItem[] = [
    {
      kind: "text",
      display: t.hero.stat1Value,
      label: t.hero.stat1Label,
      sub: t.hero.stat1Sub,
    },
    {
      kind: "count",
      value: 2,
      suffix: " hrs",
      label: t.hero.stat2Label,
      sub: t.hero.stat2Sub,
    },
    {
      kind: "text",
      display: t.hero.stat3Value,
      label: t.hero.stat3Label,
      sub: t.hero.stat3Sub,
    },
  ]

  return (
    <section className="relative min-h-[100dvh] overflow-hidden pt-[7.25rem] sm:pt-[7.75rem]">
      <PaperShaderBackground variant="hero" className="absolute inset-0" />

      <div className="container-main relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center section-pad text-center sm:min-h-[calc(100vh-5rem)]">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
          <BrandLockup
            href="/"
            typewriterClassName="text-glow-accent"
            typewriterSpeed={75}
            typewriterDelay={400}
            className="animate-fade-up justify-center px-4 py-2 sm:py-3"
          />

          <h1 className="firm-title mt-10 text-white animate-fade-up [animation-delay:180ms] sm:mt-12">
            {t.hero.titleLine1}
            <br />
            <span className="text-gradient-gold italic">{t.hero.titleHighlight}</span> {t.hero.titleLine2}
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/70 animate-fade-up [animation-delay:260ms] sm:text-xl">
            {t.hero.body}
          </p>

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up [animation-delay:340ms]">
            <NeonButton onClick={() => openChatWidget("quote")}>
              {t.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </NeonButton>
            <Link href="#compare" className="btn-ghost-light">
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="mt-16 grid w-full max-w-4xl gap-8 border-t border-accent/20 pt-12 sm:grid-cols-3 lg:mt-20">
          {stats.map((item) => (
            <div key={item.label} className="text-center">
              {item.kind === "count" && item.value !== undefined ? (
                <CountUpStat
                  value={item.value}
                  suffix={item.suffix ?? ""}
                  className="font-display text-4xl font-semibold text-accent-light sm:text-5xl"
                />
              ) : (
                <p className="font-display text-4xl font-semibold text-accent-light sm:text-5xl">
                  {item.display}
                </p>
              )}
              <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-white">
                {item.label}
              </p>
              <p className="mt-1 text-sm text-white/45">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
