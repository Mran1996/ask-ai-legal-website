"use client"

import { useMemo, useState } from "react"
import { Check, FileText, LineChart, Scale } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { PaperShaderBackground } from "@/components/paper-shader-background"
import { useLanguage } from "@/components/language-provider"

const PILLAR_ICONS: LucideIcon[] = [FileText, Scale, LineChart, Check]
const FLIP_MS = 650

function PillarCard({
  title,
  summary,
  detail,
  icon: Icon,
  isFlipped,
  onToggle,
}: {
  title: string
  summary: string
  detail: string
  icon: LucideIcon
  isFlipped: boolean
  onToggle: () => void
}) {
  return (
    <div className="[perspective:1400px]">
      <button
        type="button"
        aria-pressed={isFlipped}
        aria-label={isFlipped ? `Hide details for ${title}` : `Show details for ${title}`}
        onClick={onToggle}
        className={[
          "relative aspect-square w-full overflow-hidden rounded-sm text-left",
          isFlipped
            ? "border-2 border-gold shadow-[0_0_28px_rgba(197,160,89,0.3)]"
            : "border border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.06]",
        ].join(" ")}
        style={{ transition: "border-color 350ms ease, box-shadow 350ms ease" }}
      >
        <div
          className="relative h-full w-full [transform-style:preserve-3d]"
          style={{
            transition: `transform ${FLIP_MS}ms cubic-bezier(0.4, 0.2, 0.2, 1)`,
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-white/[0.03] p-4 sm:p-5 [backface-visibility:hidden]"
            style={{ transform: "rotateY(0deg)" }}
          >
            <Icon className="mb-3 h-8 w-8 text-white/40 sm:h-9 sm:w-9" aria-hidden />
            <span className="font-display text-center text-sm font-semibold leading-snug text-white sm:text-base">
              {title}
            </span>
            <span className="mt-2 px-1 text-center text-[11px] leading-snug text-white/45 sm:text-xs">
              {summary}
            </span>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-start justify-start overflow-y-auto bg-[#152238] p-4 sm:p-5 [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg)" }}
          >
            <span className="font-display text-left text-sm font-semibold leading-snug text-white sm:text-base">
              {title}
            </span>
            <p className="mt-3 text-left text-[11px] leading-relaxed text-white/65 sm:text-xs">
              {detail}
            </p>
          </div>
        </div>
      </button>
    </div>
  )
}

export function FourPillarsSection() {
  const { t } = useLanguage()
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)

  const pillars = useMemo(
    () =>
      t.compare.highlights.map((item, index) => ({
        ...item,
        icon: PILLAR_ICONS[index] ?? FileText,
      })),
    [t]
  )

  const handleToggle = (index: number) => {
    setFlippedIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section id="pillars" className="section-pad relative overflow-hidden text-white">
      <PaperShaderBackground variant="section" className="absolute inset-0" />
      <div className="container-main relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="firm-label text-accent-light">{t.compare.highlightsLabel}</p>
          <h2 className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">
            {t.compare.highlightsTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
            {t.compare.highlightsIntro}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:gap-5">
            {pillars.map((item, index) => (
              <PillarCard
                key={item.title}
                title={item.title}
                summary={item.summary}
                detail={item.detail}
                icon={item.icon}
                isFlipped={flippedIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
