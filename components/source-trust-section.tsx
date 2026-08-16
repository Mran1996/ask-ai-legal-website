"use client"

import { BookOpen, ExternalLink, RefreshCw } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

const TILE_ICONS: LucideIcon[] = [BookOpen, ExternalLink, RefreshCw]

export function SourceTrustSection() {
  const { t } = useLanguage()
  const copy = t.sourceTrust

  return (
    <section id="sources" className="section-pad bg-white">
      <div className="container-main">
        <div className="mx-auto max-w-3xl text-center">
          <p className="firm-label text-gold-dark">{copy.label}</p>
          <div className="gold-rule mx-auto mb-6" />
          <h2 className="firm-title text-navy">{copy.title}</h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">{copy.body}</p>
        </div>

        <ul className="mx-auto mt-12 grid max-w-5xl gap-5 sm:mt-14 sm:grid-cols-3 lg:gap-6">
          {copy.tiles.map((tile, index) => {
            const Icon = TILE_ICONS[index] ?? BookOpen
            return (
              <li
                key={tile.title}
                className="firm-card border-2 border-gold/35 bg-cream p-6 sm:p-8"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-white">
                  <Icon className="h-5 w-5 text-gold-dark" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold leading-snug text-navy sm:text-xl">
                  {tile.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{tile.description}</p>
              </li>
            )
          })}
        </ul>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-gray-600 sm:text-base">
          {copy.closing}
        </p>
      </div>
    </section>
  )
}
