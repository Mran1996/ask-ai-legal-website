"use client"

import dynamic from "next/dynamic"
import { LanguageProvider } from "@/components/language-provider"
import { ConvexClientProvider } from "@/components/convex-client-provider"

const ChatWidget = dynamic(
  () => import("@/components/chat-widget").then((mod) => mod.ChatWidget),
  { ssr: false }
)

const hasConvexUrl = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <LanguageProvider>
        {children}
        {hasConvexUrl ? <ChatWidget /> : null}
      </LanguageProvider>
    </ConvexClientProvider>
  )
}
