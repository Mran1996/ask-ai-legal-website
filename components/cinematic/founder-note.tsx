"use client"

import { Reveal } from "./reveal"

/** Our story: why the Ask AI Legal team built it. */
export function FounderNote() {
  return (
    <section id="our-story" className="relative scroll-mt-20 bg-ground py-6 sm:py-10">
      <div className="cine-container relative">
        <Reveal className="cine-card mx-auto max-w-3xl border-accent/30 p-6 sm:p-10">
          <p data-reveal className="cine-label mb-3">Our story</p>
          <h2 data-reveal className="cine-h2 text-cream">
            Why we built{" "}
            <span className="cine-serif text-accent-light">Ask AI Legal.</span>
          </h2>
          <div data-reveal className="cine-body mt-6 space-y-4">
            <p>
              Ask AI Legal started with our founder&apos;s own legal problems. Our founder could not afford a lawyer
              and went to court alone.
            </p>
            <p>
              ChatGPT and Claude made too many mistakes for court work. They got the format wrong and cited the wrong
              cases. Deadlines were missed, and our founder got called out for filing papers a chatbot had drafted.
            </p>
            <p>
              So our founder reached out to others for help and input, and together we started building something
              better. Over three years, we fed it the best legal YouTube channels, real court cases, citations, and the
              rules for what each filing has to include. We added helpers that keep working in the background, so it
              finds the right documents, cases, and files without wasting time or money. Every mistake became a lesson
              it kept.
            </p>
            <p>
              Then friends and family asked for help with their own paperwork. That is when we knew a tool built for
              one case could help other people too.
            </p>
            <p>
              It has taken countless hours and a lot of our own money to get right. As the technology improves, we
              keep up with it and keep making Ask AI Legal better.
            </p>
            <p>
              People ask us why they should pay for something that can make mistakes. They are right, it can. So can
              the firm that charges thousands, where an intern may draft your papers, and the lawyer has dozens of
              other files and limited hours for yours. With Ask AI Legal, you read every draft yourself, and you can
              open the source behind each citation before anything is filed.
            </p>
          </div>
          <p data-reveal className="mt-6 font-display text-lg text-accent-light">The Ask AI Legal team</p>
        </Reveal>
      </div>
    </section>
  )
}
