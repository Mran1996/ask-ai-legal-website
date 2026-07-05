"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/components/language-provider"

export function FaqSection() {
  const { t } = useLanguage()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="section-pad bg-cream">
      <div className="container-main">
        <div className="mx-auto max-w-3xl text-center">
          <p className="firm-label text-gold-dark">{t.faq.label}</p>
          <div className="gold-rule mx-auto mb-6" />
          <h2 className="firm-title text-navy">{t.faq.title}</h2>
          <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">{t.faq.intro}</p>
        </div>

        <ul className="mx-auto mt-12 max-w-3xl space-y-3 sm:mt-14">
          {t.faq.items.map((faq, i) => {
            const isOpen = open === i

            return (
              <li
                key={faq.q}
                className={[
                  "overflow-hidden rounded-sm border-2 bg-white transition-all duration-300",
                  isOpen
                    ? "border-gold/45 shadow-[0_0_24px_rgba(197,160,89,0.12)]"
                    : "border-gold/20 hover:border-gold/35",
                ].join(" ")}
              >
                <button
                  type="button"
                  className="flex w-full min-h-[44px] items-start justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="font-display text-base font-semibold leading-snug text-navy sm:text-lg">
                    {faq.q}
                  </span>
                  <span
                    className={[
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                      isOpen ? "border-gold/50 bg-gold/10" : "border-gold/25 bg-cream",
                    ].join(" ")}
                  >
                    <ChevronDown
                      className={`h-4 w-4 text-gold-dark transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </span>
                </button>

                <div
                  className={[
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-navy/8 px-5 pb-5 pt-4 text-sm leading-relaxed text-gray-600 sm:px-6 sm:pb-6">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
