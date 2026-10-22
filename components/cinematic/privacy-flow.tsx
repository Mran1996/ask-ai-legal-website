"use client"

import { ArrowRight, Lock } from "lucide-react"
import { Reveal } from "./reveal"

const FLOW = [
  "Remove personal identifiers locally",
  "Process the protected request",
  "Restore details on your computer",
]

/** Local privacy workflow (privacy mode, on by default in the installed app). */
export function PrivacyFlow() {
  return (
    <section id="privacy" className="relative scroll-mt-20 bg-ground py-6 sm:py-10">
      <div className="cine-container">
        <Reveal>
          <p data-reveal className="cine-label mb-3">Privacy</p>
          <h2 data-reveal className="cine-h2 max-w-[18ch] text-cream">
            Your papers are stored{" "}
            <span className="cine-serif text-accent-light">on your computer.</span>
          </h2>
          <p data-reveal className="cine-body mt-4 max-w-2xl">
            Your documents and Second Brain memory are saved on your computer. With privacy mode on, when a connected
            AI service is used, personal identifiers are removed locally before the request is sent. Your personal
            details are restored locally in the returned document.
          </p>
        </Reveal>

        <Reveal className="mt-6">
          <ol data-reveal className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            {FLOW.map((step, i) => (
              <li key={step} className="flex flex-1 items-center gap-3 md:contents">
                <span className="cine-card flex flex-1 items-center gap-3 p-5 text-cream">
                  <Lock className="h-5 w-5 shrink-0 text-accent" aria-hidden />
                  <span className="text-base">{step}</span>
                </span>
                {i < FLOW.length - 1 && (
                  <ArrowRight className="hidden h-5 w-5 shrink-0 text-accent md:block" aria-hidden />
                )}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
