"use client"

import { LanguageProvider } from "@/components/language-provider"
import { ChatWidget } from "@/components/chat-widget"
import { ConvexClientProvider } from "@/components/convex-client-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <LanguageProvider>
        {children}
        <ChatWidget />
      </LanguageProvider>
    </ConvexClientProvider>
  )
}
