"use client"

import { useEffect } from "react"

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <h1 className="font-display text-3xl font-semibold text-navy sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-gray-600">{message}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={() => reset()} className="btn-neon-light">
          Try again
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-sm border-2 border-navy/20 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-navy transition-colors hover:border-gold hover:text-gold-dark"
        >
          Reload page
        </button>
      </div>
    </div>
  )
}
