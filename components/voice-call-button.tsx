"use client"

import { useState } from "react"
import { VOICE_PHONE_DISPLAY, VOICE_PHONE_TEL } from "@/lib/site-config"

/** "Call us" button: click it and the phone number appears (tap to dial on phones). */
export function VoiceCallButton({ className = "" }: { className?: string }) {
  const [shown, setShown] = useState(false)
  const base =
    "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-cream/25 bg-ground/60 px-3 py-2 font-sans text-[11px] font-semibold text-cream transition-colors hover:border-accent hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-4 sm:text-xs"

  return (
    <div className={`flex items-center ${className}`}>
      {shown ? (
        <a href={`tel:${VOICE_PHONE_TEL}`} className={base}>
          {VOICE_PHONE_DISPLAY}
        </a>
      ) : (
        <button type="button" onClick={() => setShown(true)} className={base}>
          Call us
        </button>
      )}
    </div>
  )
}
