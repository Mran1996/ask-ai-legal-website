"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useConvex } from "convex/react"
import { api } from "@/convex/_generated/api"
import { OPEN_CHAT_EVENT, type OpenChatEventDetail } from "@/lib/chat/open-chat"

const SESSION_KEY = "aal_session_id"

function getSessionId(): string | undefined {
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36)
      window.sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return undefined
  }
}

function getDevice(): string {
  const width = window.innerWidth
  if (width < 640) return "mobile"
  if (width < 1024) return "tablet"
  return "desktop"
}

function getReferrer(): string | undefined {
  const ref = document.referrer
  if (!ref) return undefined
  try {
    const host = new URL(ref).host
    return host === window.location.host ? undefined : host
  } catch {
    return undefined
  }
}

/**
 * Records page views and clicks on elements marked data-track="cta_id".
 * Counts and labels only — never form contents or document text.
 * Ops pages are excluded so internal work doesn't skew Insights.
 */
export function AnalyticsTracker() {
  const convex = useConvex()
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || pathname.startsWith("/ops")) return
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    void convex
      .mutation(api.events.track, {
        name: "page_view",
        path: pathname,
        referrer: getReferrer(),
        device: getDevice(),
        sessionId: getSessionId(),
      })
      .catch(() => {})
  }, [convex, pathname])

  useEffect(() => {
    const onOpenChat = (event: Event) => {
      const detail = (event as CustomEvent<OpenChatEventDetail>).detail
      void convex
        .mutation(api.events.track, {
          name: "chat_open",
          path: window.location.pathname,
          device: getDevice(),
          sessionId: getSessionId(),
          meta: detail?.tab ?? "chat",
        })
        .catch(() => {})
    }
    window.addEventListener(OPEN_CHAT_EVENT, onOpenChat)
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpenChat)
  }, [convex])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]")
      if (!target) return
      const meta = target.dataset.track
      if (!meta) return
      void convex
        .mutation(api.events.track, {
          name: meta === "chat_open" ? "chat_open" : "cta_click",
          path: window.location.pathname,
          device: getDevice(),
          sessionId: getSessionId(),
          meta,
        })
        .catch(() => {})
    }
    document.addEventListener("click", onClick, { capture: true })
    return () => document.removeEventListener("click", onClick, { capture: true })
  }, [convex])

  return null
}
