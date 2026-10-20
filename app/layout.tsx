import type { Metadata, Viewport } from "next"
import { Instrument_Serif, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import {
  SITE_URL,
  SUPPORT_EMAIL,
  SITE_SEO_TITLE,
  SITE_SEO_DESCRIPTION,
  SITE_DISCLAIMER,
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
    "AI legal assistant",
    "private AI legal assistant",
    "help representing yourself in court",
    "self-represented litigant",
    "pro se legal software",
    "court deadline tracker",
    "AI legal research with sources",
    "legal case management software",
    "legal document preparation software",
    "Ask AI Legal",
  ],
  authors: [{ name: "Ask AI Legal" }],
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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  serviceType: "Legal workspace software installation, training, and support",
  name: "Ask AI Legal",
  description: DESCRIPTION,
  url: SITE_URL,
  email: SUPPORT_EMAIL,
  priceRange: "$3,997 one-time purchase; optional $125/month maintenance",
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  disclaimer: SITE_DISCLAIMER,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
