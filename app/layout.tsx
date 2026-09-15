import type { Metadata, Viewport } from "next"
import { Instrument_Serif, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import {
  SITE_URL,
  SUPPORT_EMAIL,
  SITE_SEO_TITLE,
  SITE_SEO_DESCRIPTION,
} from "@/lib/site-config"

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#070f18" },
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
    "represent yourself in court",
    "self represented litigant help",
    "pro se legal help",
    "legal document preparation from home",
    "divorce paperwork help",
    "custody paperwork help",
    "eviction response help",
    "small claims paperwork",
    "civil dispute documents",
    "immigration paperwork help",
    "no retainer legal help",
    "flat fee legal document service",
    "Ask AI Legal",
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
  serviceType: "Legal tool install and configuration for home use",
  name: "Ask AI Legal",
  description: DESCRIPTION,
  url: SITE_URL,
  email: SUPPORT_EMAIL,
  priceRange: "Custom quote",
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  knowsAbout: [
    "Divorce paperwork tools",
    "Custody paperwork tools",
    "Civil dispute tools",
    "Business dispute tools",
  ],
  disclaimer:
    "Ask AI Legal installs and configures tools you use from home. We are not a law firm and do not provide legal advice.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable} overflow-x-hidden`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-grotesk@400,500,600,700&f[]=general-sans@400,500,600&display=swap"
        />
      </head>
      <body
        className="cine min-w-0 overflow-x-hidden font-sans antialiased"
        style={{ backgroundColor: "#070f18", color: "#faf9f6" }}
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
