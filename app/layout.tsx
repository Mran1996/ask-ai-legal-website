import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import {
  SITE_URL,
  SUPPORT_EMAIL,
  CASE_REVIEW_PRICE_DISPLAY,
  TOTAL_PRICE_DISPLAY,
  SITE_SEO_TITLE,
  SITE_SEO_DESCRIPTION,
  SITE_DISCLAIMER,
} from "@/lib/site-config"

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
})

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1929" },
  ],
}

const TITLE_DEFAULT = SITE_SEO_TITLE
const DESCRIPTION = SITE_SEO_DESCRIPTION

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE_DEFAULT,
    template: "%s — Ask AI Legal",
  },
  description: DESCRIPTION,
  keywords: [
    "case review legal support",
    "hands-on legal guidance",
    "self-help legal support",
    "divorce guidance",
    "custody support",
    "housing dispute help",
    "flat fee legal support",
    "self represented litigant",
  ],
  authors: [{ name: "Ask AI Legal" }],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: TITLE_DEFAULT,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Ask AI Legal",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE_DEFAULT,
    description: DESCRIPTION,
  },
}

const legalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  serviceType: "Case review and hands-on legal support",
  name: "Ask AI Legal",
  description: DESCRIPTION,
  url: SITE_URL,
  email: SUPPORT_EMAIL,
  priceRange: `${CASE_REVIEW_PRICE_DISPLAY}–${TOTAL_PRICE_DISPLAY}`,
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  knowsAbout: [
    "Divorce case review and support",
    "Custody guidance and walkthrough",
    "Housing dispute support",
    "Civil dispute self-help guidance",
  ],
  disclaimer: SITE_DISCLAIMER,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} overflow-x-hidden`}>
      <body
        className="min-w-0 overflow-x-hidden font-sans bg-cream text-gray-700 antialiased"
        style={{ backgroundColor: "#faf8f5", color: "#374151" }}
      >
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
