"use client"

import { Reveal } from "./reveal"

/** Founder's note: why Ask AI Legal exists, in the founder's own story. */
export function FounderNote() {
  return (
    <section id="founder" className="relative scroll-mt-20 bg-ground py-6 sm:py-10">
      <div className="cine-container relative">
        <Reveal className="cine-card mx-auto max-w-3xl border-accent/30 p-6 sm:p-10">
          <p data-reveal className="cine-label mb-3">Founder&apos;s note</p>
          <h2 data-reveal className="cine-h2 text-cream">
            Why I built{" "}
            <span className="cine-serif text-accent-light">Ask AI Legal.</span>
          </h2>
          <div data-reveal className="cine-body mt-6 space-y-4">
            <p>
              I built this for myself first. I had legal problems and could not afford a lawyer, so I went to court
              on my own.
            </p>
            <p>
              I tried ChatGPT and Claude. They made too many mistakes for court work. They got the format wrong and
              cited the wrong cases. I missed deadlines, and I got called out for filing papers a chatbot had drafted.
            </p>
            <p>
              So three years ago I started building my own tool. I fed it the best legal YouTube channels, real court
              cases, citations, and the rules for what each filing has to include. I added helpers that keep working
              in the background, so it finds the right documents, cases, and files without wasting time or money.
              Every mistake became a lesson it kept.
            </p>
            <p>
              It got good. Attorneys on the other side started asking me not to file certain documents, or to pull
              ones I had filed. Then friends and family asked me to help with their own paperwork. That is when I knew
              what I made for my own case could help other people too.
            </p>
            <p>
              It has taken countless hours and a lot of my own money to get right. As the technology improves, I keep
              up with it and keep making Ask AI Legal better.
            </p>
            <p>
              People ask me why they should pay for something that can make mistakes. They are right, it can. So can
              the firm that charges thousands, where an intern may draft your papers, and the lawyer has dozens of
              other files and limited hours for yours. With Ask AI Legal, you read every draft yourself, and you can
              open the source behind each citation before anything is filed.
            </p>
          </div>
          <p data-reveal className="mt-6 font-display text-lg text-accent-light">The founder of Ask AI Legal</p>
        </Reveal>
      </div>
    </section>
  )
}
