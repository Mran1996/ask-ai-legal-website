"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

/** A block of text with a Copy button, for prompts readers paste into another tool. */
export function CopyBox({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="relative mt-3 rounded-lg border border-accent/30 bg-black/30">
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-accent/60 bg-ground px-3 py-1.5 font-sans text-xs font-semibold text-accent-light transition-colors hover:bg-accent/10"
      >
        {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="whitespace-pre-wrap break-words p-4 pt-14 font-sans text-[15px] leading-relaxed text-cream/90 sm:pt-4 sm:pr-28">
        {text}
      </pre>
    </div>
  )
}
