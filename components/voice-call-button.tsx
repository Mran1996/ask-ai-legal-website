"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, Mic, PhoneOff } from "lucide-react"
import { RETELL_AGENT_ID, VOICE_PHONE_DISPLAY, VOICE_PHONE_TEL } from "@/lib/site-config"

type Status = "idle" | "connecting" | "live" | "error"
type Session = { end: () => Promise<void> | void }

/** Floating "Talk to us" button: a browser voice call with the Ask AI Legal voice agent. */
export function VoiceCallButton() {
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
            setMessage(
              denied
                ? "Allow microphone access to talk, or call us instead."
                : `The call didn't connect. You can call us at ${VOICE_PHONE_DISPLAY}.`
            )
            setStatus("error")
          },
        },
      }) as unknown as Session
    } catch {
      setMessage(`The call didn't connect. You can call us at ${VOICE_PHONE_DISPLAY}.`)
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
    <div className="fixed bottom-20 right-5 z-[70] flex flex-col items-end gap-2">
      {message && (
        <p role="status" className="max-w-[240px] rounded-md border border-gold/30 bg-navy px-3 py-2 text-xs text-white/90 shadow-firm">
          {message}{" "}
          <a href={`tel:${VOICE_PHONE_TEL}`} className="font-semibold text-gold underline">
            Call {VOICE_PHONE_DISPLAY}
          </a>
        </p>
      )}
      <button
        type="button"
        onClick={live || connecting ? stop : start}
        aria-label={live ? "End the voice call" : "Talk to us by voice"}
        className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold text-white shadow-neon transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
          live ? "border-red-400/70 bg-red-600/90" : "border-gold/50 bg-navy hover:border-gold"
        }`}
      >
        {connecting ? (
          <Loader2 className="h-5 w-5 animate-spin text-gold motion-reduce:animate-none" aria-hidden />
        ) : live ? (
          <PhoneOff className="h-5 w-5" aria-hidden />
        ) : (
          <Mic className="h-5 w-5 text-gold" aria-hidden />
        )}
        <span className="hidden sm:inline">{connecting ? "Connecting…" : live ? "End call" : "Talk to us"}</span>
      </button>
    </div>
  )
}
