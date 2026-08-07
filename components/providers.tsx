"use client"

import { Suspense } from "react"
import { ChatWidgetLoader } from "@/components/chat-widget-loader"
import { LanguageProvider } from "@/components/language-provider"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import {
  PostHogPageView,
  PostHogProvider,
} from "@/components/analytics/posthog-provider"
import { ConsentProvider } from "@/components/privacy/consent-provider"
import { CookieConsentBanner } from "@/components/privacy/cookie-consent-banner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider>
      <ConvexClientProvider>
        <PostHogProvider>
          <LanguageProvider>
            <Suspense fallback={null}>
              <PostHogPageView />
            </Suspense>
            {children}
            <ChatWidgetLoader />
            <CookieConsentBanner />
          </LanguageProvider>
        </PostHogProvider>
      </ConvexClientProvider>
    </ConsentProvider>
  )
}
