"use client"

import { createElement, useEffect, useRef, useState } from "react"
import Script from "next/script"
import Link from "next/link"
import { SUPPORT_EMAIL } from "@/lib/site-config"

/**
 * Stripe Buy Button (hosted). The publishable key is public by design; each
 * buy button (price, success URL) is configured in the Stripe Dashboard.
 */
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ||
  "pk_live_51REEH2D8ZPcBhwZRjHdMz4BU2un8ae0Y7XKNi7fIynYu6K2EnoZuaNRh2RKynkaty4Gn8DrEC14l8F5stkMSGE0i00lxIZJnKP"

/** Give up and show the fallback if Stripe hasn't drawn the checkout by then. */
const LOAD_TIMEOUT_MS = 20000

type Status = "loading" | "ready" | "failed"

export function StripeBuyButton({ buyButtonId }: { buyButtonId: string }) {
  const host = useRef<HTMLDivElement>(null)
  const [scriptReady, setScriptReady] = useState(false)
  const [status, setStatus] = useState<Status>("loading")

  // Overall timeout: script blocked, offline, or Stripe never renders its iframe.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStatus((s) => (s === "loading" ? "failed" : s))
    }, LOAD_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [])

  // Keep the loading state up until Stripe's iframe exists and has loaded.
  useEffect(() => {
    if (!scriptReady) return
    let cancelled = false
    const poll = window.setInterval(() => {
      const el = host.current?.querySelector("stripe-buy-button")
      const frame = (el?.shadowRoot ?? el)?.querySelector("iframe")
      if (!frame) return
      window.clearInterval(poll)
      const markReady = () => !cancelled && setStatus((s) => (s === "loading" ? "ready" : s))
      frame.addEventListener("load", markReady, { once: true })
      // The iframe may already have loaded before we attached the listener.
      window.setTimeout(markReady, 2500)
    }, 200)
    return () => {
      cancelled = true
      window.clearInterval(poll)
    }
  }, [scriptReady])

  if (status === "failed") {
    return (
      <div role="alert" className="rounded-md border border-white/15 bg-white/5 px-5 py-5 text-left text-sm text-white/80">
        <p className="font-semibold text-white">Secure checkout couldn&apos;t load.</p>
        <p className="mt-2 leading-relaxed">
          Refresh the page to try again, or{" "}
          <Link href="/contact" className="text-gold underline underline-offset-2">
            contact us
          </Link>{" "}
          at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold underline underline-offset-2">
            {SUPPORT_EMAIL}
          </a>{" "}
          and we&apos;ll send you a secure payment link. You have not been charged.
        </p>
      </div>
    )
  }

  return (
    <div ref={host} className="relative min-h-[48px] min-w-[220px]">
      <Script
        src="https://js.stripe.com/v3/buy-button.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setStatus("failed")}
      />

      {status === "loading" && (
        <div
          className="absolute inset-0 z-10 flex min-h-[48px] items-center justify-center rounded-2xl bg-gold-dark"
          role="status"
          aria-live="polite"
        >
          <span className="animate-pulse text-sm font-semibold text-white/90">Loading secure checkout…</span>
        </div>
      )}

      {createElement("stripe-buy-button", {
        "buy-button-id": buyButtonId,
        "publishable-key": PUBLISHABLE_KEY,
      })}
    </div>
  )
}
