"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const ChatWidget = dynamic(
  () => import("@/components/chat-widget").then((mod) => mod.ChatWidget),
  { ssr: false, loading: () => null }
)

/** Mount chat only in the browser when Convex is configured (safe for static prerender). */
export function ChatWidgetLoader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !process.env.NEXT_PUBLIC_CONVEX_URL) {
    return null
  }

  return <ChatWidget />
}
