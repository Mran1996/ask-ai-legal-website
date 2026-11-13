"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, Mic, PhoneOff } from "lucide-react"
import { RETELL_AGENT_ID, VOICE_PHONE_DISPLAY, VOICE_PHONE_TEL } from "@/lib/site-config"

type Status = "idle" | "connecting" | "live" | "error"
type Session = { end: () => Promise<void> | void }

/** "Talk to us" header button: a browser voice call with the Ask AI Legal voice agent. */
export function VoiceCallButton({ className = "", showPhone = false }: { className?: string; showPhone?: boolean }) {
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")
  const session = useRef<Session | null>(null)

  useEffect(() => () => void session.current?.end(), [])

  async function start() {
    if (status === "connecting" || status === "live") return
    setStatus("connecting")
    setMessage("")
    try {
      const { RetellClient } = await import("retell-client-js-sdk")
      const client = new RetellClient({
        // The real key lives on our server. This route only starts calls with our agent.
        key: "server-side",
        fetch: (url, init) => fetch("/api/retell" + new URL(String(url)).pathname, init),
      })
      session.current = client.createWebCall({
        agent_id: RETELL_AGENT_ID,
        hooks: {
          onStatus: (s: string) => {
            if (s === "live") setStatus("live")
            if (s === "ended") {
              session.current = null
              setStatus((prev) => (prev === "error" ? prev : "idle"))
            }
          },
          onError: (err: Error) => {
            const denied = /permission|notallowed|microphone/i.test(err?.message ?? "")
            setMessage(denied ? "Allow microphone access to talk, or call us instead." : "The call didn't connect. You can call us instead.")
            setStatus("error")
          },
        },
      }) as unknown as Session
    } catch {
      setMessage("The call didn't connect. You can call us instead.")
      setStatus("error")
    }
  }

  async function stop() {
    await session.current?.end()
    session.current = null
    setStatus("idle")
  }

  const live = status === "live"
  const connecting = status === "connecting"

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      <a
        href={`tel:${VOICE_PHONE_TEL}`}
        className={`${showPhone ? "order-last inline" : "hidden 2xl:inline"} whitespace-nowrap font-sans text-sm font-semibold text-cream/80 transition-colors hover:text-cream`}
      >
        {VOICE_PHONE_DISPLAY}
      </a>
      <button
        type="button"
        onClick={live || connecting ? stop : start}
        aria-label={live ? "End the voice call" : "Talk to us by voice"}
        className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-2 font-sans text-[11px] font-semibold text-cream transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-4 sm:text-xs ${
          live ? "border-red-400/70 bg-red-600/90" : "border-cream/25 bg-ground/60 hover:border-accent hover:bg-accent/10"
        }`}
      >
        {connecting ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent-light motion-reduce:animate-none" aria-hidden />
        ) : live ? (
          <PhoneOff className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <Mic className="h-4 w-4 shrink-0 text-accent-light" aria-hidden />
        )}
        <span className="sm:hidden">{connecting ? "…" : live ? "End" : "Call"}</span>
        <span className="hidden sm:inline">{connecting ? "Connecting…" : live ? "End call" : "Talk to us"}</span>
      </button>
      {message && (
        <p
          role="status"
          className="absolute right-0 top-full mt-2 w-60 rounded-md border border-accent/30 bg-ground px-3 py-2 font-sans text-xs text-cream/90 shadow-lg"
        >
          {message}{" "}
          <a href={`tel:${VOICE_PHONE_TEL}`} className="font-semibold text-accent-light underline">
            Call {VOICE_PHONE_DISPLAY}
          </a>
        </p>
      )}
    </div>
  )
}
