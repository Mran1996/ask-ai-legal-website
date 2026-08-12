"use client"

import { Suspense } from "react"
import { ChatWidgetLoader } from "@/components/chat-widget-loader"
import { LanguageProvider } from "@/components/language-provider"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import {
  MetaPixelPageView,
  MetaPixelProvider,
} from "@/components/analytics/meta-pixel-provider"
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
          <MetaPixelProvider>
            <LanguageProvider>
              <Suspense fallback={null}>
                <PostHogPageView />
                <MetaPixelPageView />
              </Suspense>
              {children}
              <ChatWidgetLoader />
              <CookieConsentBanner />
            </LanguageProvider>
          </MetaPixelProvider>
        </PostHogProvider>
      </ConvexClientProvider>
    </ConsentProvider>
  )
}
