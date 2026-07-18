import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { SITE_URL, SUPPORT_EMAIL, CASE_FILE_REVIEW_PRICE_DISPLAY } from "@/lib/site-config"

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

const TITLE_DEFAULT = "Ask AI Legal — Court-Ready Documents & Verified Legal Research"
const DESCRIPTION =
  `Flat-fee document preparation for divorce, custody, civil, and business matters. Start with a ${CASE_FILE_REVIEW_PRICE_DISPLAY} case file review — credited toward your documents. Every citation retrieved and verified. Not a law firm, no legal advice.`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE_DEFAULT,
    template: "%s — Ask AI Legal",
  },
  description: DESCRIPTION,
  keywords: [
    "document preparation",
    "divorce paperwork help",
    "custody documents",
    "civil case document preparation",
    "flat fee documents",
    "self represented litigant",
    "court ready documents",
    "legal citation verification",
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
  "@type": "LegalService",
  name: "Ask AI Legal",
  description: DESCRIPTION,
  url: SITE_URL,
  email: SUPPORT_EMAIL,
  priceRange: `${CASE_FILE_REVIEW_PRICE_DISPLAY}+`,
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  knowsAbout: [
    "Divorce document preparation",
    "Custody document preparation",
    "Civil dispute document preparation",
    "Business dispute document preparation",
  ],
  disclaimer:
    "Ask AI Legal generates documents only. We are not a law firm and do not provide legal advice.",
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
