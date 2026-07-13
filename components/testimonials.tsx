"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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

type ClientExample = {
  id: ClientId
  quote: string
  name: string
  title: string
  image: string
  imageAlt: string
}

function ReviewCardContent({ client }: { client: ClientExample }) {
  return (
    <>
      <blockquote className="whitespace-normal text-sm leading-relaxed text-gray-700 sm:text-[0.9375rem]">
        &ldquo;{client.quote}&rdquo;
      </blockquote>

      <footer className="mt-5 flex items-start gap-3 border-t border-navy/10 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={client.image}
          alt={client.imageAlt}
          className="h-12 w-12 shrink-0 rounded-full border-2 object-cover object-center shadow-sm"
          style={{ borderColor: `${CABO_GOLD}99` }}
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy">{client.name}</p>
          <p className="mt-0.5 text-xs text-gray-500">{client.title}</p>
        </div>
      </footer>
    </>
  )
}

function SlideCarousel({
  clients,
  activeIndex,
  reduceMotion,
}: {
  clients: ClientExample[]
  activeIndex: number
  reduceMotion: boolean
}) {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="w-full overflow-hidden">
        <div
          className="flex w-full"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: reduceMotion ? "none" : `transform ${SLIDE_MS}ms ease-in-out`,
          }}
        >
          {clients.map((client) => (
            <div key={client.id} className="w-full shrink-0 basis-full">
              <div
                className="flex min-h-[12rem] flex-col rounded-lg border-2 p-5 text-navy sm:min-h-[13rem] sm:p-6"
                style={{ borderColor: CABO_GOLD, backgroundColor: CABO_CREAM }}
              >
                <ReviewCardContent client={client} />
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

  const clientExamples = useMemo<ClientExample[]>(
    () =>
      CLIENT_IDS.map((id) => {
        const copy = t.testimonials.clients[id]
        return {
          id,
          quote: copy.quote,
          name: copy.name,
          title: copy.title,
          image: CLIENT_IMAGES[id],
          imageAlt: copy.imageAlt,
        }
      }),
    [t]
  )

  const count = clientExamples.length

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

  return (
    <section id="testimonials" className="section-pad overflow-x-hidden bg-navy text-white">
      <div className="container-main">
        <div className="text-center">
          <h2 className="firm-title">
            <span className="text-white">{t.testimonials.titleWhite}</span>
            <span className="italic" style={{ color: CABO_GOLD }}>
              {t.testimonials.titleGold}
            </span>
          </h2>
          <p className="firm-label mt-6" style={{ color: CABO_GOLD }}>
            {t.testimonials.label}
          </p>
        </div>

        <div className="relative mt-10 flex flex-col items-center sm:mt-12">
          <SlideCarousel
            clients={clientExamples}
            activeIndex={activeIndex}
            reduceMotion={reduceMotion}
          />

          <div className="mt-6 flex justify-center gap-2">
            {clientExamples.map((client, index) => (
              <button
                key={client.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Show testimonial from ${client.name}`}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === activeIndex ? "w-6 bg-gold" : "bg-white/25 hover:bg-white/45"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
