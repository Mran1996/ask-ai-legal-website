"use client"

import { ChatWidgetLoader } from "@/components/chat-widget-loader"
import { LanguageProvider } from "@/components/language-provider"
import { ConvexClientProvider } from "@/components/convex-client-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <LanguageProvider>
        {children}
        <ChatWidgetLoader />
      </LanguageProvider>
    </ConvexClientProvider>
  )
}
