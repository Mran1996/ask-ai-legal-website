"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

const CABO_GOLD = "#C5A059"
const CABO_CREAM = "#FAF9F6"
const SLIDE_MS = 500
const HOLD_MS = 5000
const AUTO_SCROLL_MS = SLIDE_MS + HOLD_MS
const RESUME_AFTER_MS = 8000

const CLIENT_IDS = ["sandra", "marcus", "priya", "keisha", "carlos"] as const

type ClientId = (typeof CLIENT_IDS)[number]

const CLIENT_IMAGES: Record<ClientId, string> = {
  sandra: "/clients/sandra.jpg",
  marcus: "/clients/marcus.jpg",
  priya: "/clients/priya.jpg",
  keisha: "/clients/keisha.jpg",
  carlos: "/clients/carlos.jpg",
}

type IllustrativeExample = {
  id: ClientId
  quote: string
  name: string
  title: string
  case: string
  image: string
  imageAlt: string
}

function ExampleCardContent({
  example,
  cardBadge,
}: {
  example: IllustrativeExample
  cardBadge: string
}) {
  return (
    <>
      <blockquote className="text-sm leading-relaxed text-gray-700 sm:text-[0.9375rem]">
        &ldquo;{example.quote}&rdquo;
      </blockquote>

      <footer className="mt-5 flex items-start gap-3 border-t border-navy/10 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={example.image}
          alt={example.imageAlt}
          className="h-12 w-12 shrink-0 rounded-full border-2 object-cover object-center shadow-sm"
          style={{ borderColor: `${CABO_GOLD}99` }}
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy">{example.name}</p>
          <p className="mt-0.5 text-xs text-gray-500">
            {example.title} · {example.case}
          </p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-gold-dark">
            {cardBadge}
          </p>
        </div>
      </footer>
    </>
  )
}

function SlideCarousel({
  examples,
  activeIndex,
  cardBadge,
  reduceMotion,
  onPrev,
  onNext,
}: {
  examples: IllustrativeExample[]
  activeIndex: number
  cardBadge: string
  reduceMotion: boolean
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous illustrative example"
        className="absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/15 bg-navy/80 p-2 text-white/70 transition-colors hover:border-gold/40 hover:text-gold sm:flex"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next illustrative example"
        className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/15 bg-navy/80 p-2 text-white/70 transition-colors hover:border-gold/40 hover:text-gold sm:flex"
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>

      <div className="w-full overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: reduceMotion ? "none" : `transform ${SLIDE_MS}ms ease-in-out`,
          }}
        >
          {examples.map((example) => (
            <div key={example.id} className="min-w-full shrink-0">
              <div
                className="flex flex-col rounded-lg border-2 p-5 text-navy sm:p-6"
                style={{ borderColor: CABO_GOLD, backgroundColor: CABO_CREAM }}
              >
                <ExampleCardContent example={example} cardBadge={cardBadge} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  const { t } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollTimerRef = useRef<number | null>(null)

  const illustrativeExamples = useMemo<IllustrativeExample[]>(
    () =>
      CLIENT_IDS.map((id) => {
        const copy = t.testimonials.clients[id]
        return {
          id,
          quote: copy.quote,
          name: copy.name,
          title: copy.title,
          case: copy.case,
          image: CLIENT_IMAGES[id],
          imageAlt: copy.imageAlt,
        }
      }),
    [t]
  )

  const count = illustrativeExamples.length

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduceMotion(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const pauseTemporarily = useCallback(() => {
    setUserPaused(true)
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      setUserPaused(false)
    }, RESUME_AFTER_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
      if (scrollTimerRef.current) clearInterval(scrollTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (scrollTimerRef.current) {
      clearInterval(scrollTimerRef.current)
      scrollTimerRef.current = null
    }

    if (userPaused || reduceMotion) return

    scrollTimerRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count)
    }, AUTO_SCROLL_MS)

    return () => {
      if (scrollTimerRef.current) clearInterval(scrollTimerRef.current)
    }
  }, [userPaused, reduceMotion, count])

  const goTo = useCallback(
    (index: number) => {
      pauseTemporarily()
      setActiveIndex(index)
    },
    [pauseTemporarily]
  )

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + count) % count)
  }, [goTo, activeIndex, count])

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % count)
  }, [goTo, activeIndex, count])

  return (
    <section id="illustrative-examples" className="section-pad overflow-x-hidden bg-navy text-white">
      <div className="container-main">
        <div className="text-center">
          <p className="firm-label" style={{ color: CABO_GOLD }}>
            {t.testimonials.label}
          </p>
          <div className="mx-auto mb-6 h-px w-12" style={{ backgroundColor: `${CABO_GOLD}99` }} />
          <h2 className="firm-title">
            <span className="text-white">{t.testimonials.titleWhite}</span>
            <span className="italic" style={{ color: CABO_GOLD }}>
              {t.testimonials.titleGold}
            </span>
          </h2>
        </div>

        <div className="relative mt-12 flex flex-col items-center sm:mt-14">
          <SlideCarousel
            examples={illustrativeExamples}
            activeIndex={activeIndex}
            cardBadge={t.testimonials.cardBadge}
            reduceMotion={reduceMotion}
            onPrev={goPrev}
            onNext={goNext}
          />

          <div className="mt-6 flex justify-center gap-2">
            {illustrativeExamples.map((example, index) => (
              <button
                key={example.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Show illustrative example: ${example.name}`}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === activeIndex ? "w-6 bg-gold" : "bg-white/25 hover:bg-white/45"
                }`}
              />
            ))}
          </div>

          {!reduceMotion && (
            <p className="mt-8 text-center text-xs text-white/40">{t.testimonials.rotateHint}</p>
          )}

          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-white/50">
            {t.testimonials.disclaimer}
          </p>
        </div>
      </div>
    </section>
  )
}
