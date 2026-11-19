"use client"

import { useEffect } from "react"
import { Eyebrow, GHOST_BTN, gold, H1, muted, PRIMARY_BTN } from "@/components/site/ui"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const message =
    error?.message && !error.message.startsWith("[object ")
      ? error.message
      : "The page failed to load. This usually clears after a refresh."

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0b131d] px-4 text-center font-sans">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,201,138,0.08),transparent_60%)]" />
      <div className="relative max-w-2xl">
        <Eyebrow>Error</Eyebrow>
        <H1>
          Something <em className={gold}>went wrong.</em>
        </H1>
        <p className={`mx-auto mt-5 max-w-md text-lg leading-relaxed ${muted}`}>{message}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => reset()} className={PRIMARY_BTN}>
            Try again
          </button>
          <button type="button" onClick={() => window.location.reload()} className={GHOST_BTN}>
            Reload page
          </button>
        </div>
      </div>
    </div>
  )
}
