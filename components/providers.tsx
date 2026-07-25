"use client"

import { ChatWidgetLoader } from "@/components/chat-widget-loader"
import { LanguageProvider } from "@/components/language-provider"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import { AnalyticsTracker } from "@/components/analytics-tracker"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <LanguageProvider>
        {children}
        <ChatWidgetLoader />
        <AnalyticsTracker />
      </LanguageProvider>
    </ConvexClientProvider>
  )
}
