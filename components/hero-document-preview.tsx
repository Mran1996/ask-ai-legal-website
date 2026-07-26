"use client"

import { FileText, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

const documentLines = [
  "IN THE SUPERIOR COURT OF [JURISDICTION]",
  "",
  "MOTION TO DISMISS — LACK OF PROBABLE CAUSE",
  "",
  "COMES NOW the Defendant, appearing pro se, and respectfully",
  "moves this Court to dismiss the charge pursuant to...",
  "",
  "I. STATEMENT OF FACTS",
  "On [date], law enforcement conducted a traffic stop without",
  "reasonable suspicion as established in Whren v. United States...",
  "",
  "II. LEGAL STANDARD",
  "The Fourth Amendment requires that all seizures be supported",
  "by probable cause or reasonable suspicion...",
]

export function HeroDocumentPreview() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  const currentLine = documentLines[visibleLines] ?? ""
  const displayed = currentLine.slice(0, charIndex)
  const isComplete = visibleLines >= documentLines.length

  useEffect(() => {
    if (isComplete) return

    if (charIndex < currentLine.length) {
      const speed = currentLine.length === 0 ? 120 : 18
      const timer = setTimeout(() => setCharIndex((c) => c + 1), speed)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setVisibleLines((l) => l + 1)
      setCharIndex(0)
    }, 200)
    return () => clearTimeout(timer)
  }, [charIndex, currentLine, isComplete, visibleLines])

  return (
    <div className="relative mx-auto max-w-md lg:max-w-none">
      <div className="overflow-hidden rounded-2xl border border-accent/30 bg-white shadow-demo">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="ml-2 flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <FileText className="h-3.5 w-3.5" aria-hidden />
            motion-to-dismiss.docx
          </span>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent-dark">
            <Sparkles className="h-3 w-3" aria-hidden />
            Generating
          </span>
        </div>

        <div className="doc-rules min-h-[280px] bg-white p-5 font-mono text-[11px] leading-relaxed text-gray-700 sm:min-h-[320px] sm:p-6 sm:text-xs">
          {documentLines.slice(0, visibleLines).map((line, i) => (
            <p
              key={i}
              className={`${line.startsWith("MOTION") || line.startsWith("IN THE") ? "font-bold text-gray-900" : ""} ${line.match(/^I+\./) ? "mt-2 font-semibold text-accent-dark" : ""}`}
            >
              {line || "\u00A0"}
            </p>
          ))}
          {!isComplete && (
            <p className="font-bold text-gray-900">
              {displayed}
              <span className="ml-px inline-block h-3.5 w-0.5 animate-blink bg-accent align-middle" aria-hidden />
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-3">
          <span className="text-xs text-gray-500">Professional format</span>
          <span className="rounded-lg bg-accent px-3 py-1 text-xs font-semibold text-white">
            Export PDF
          </span>
        </div>
      </div>
    </div>
  )
}
