import type { Metadata, Viewport } from "next"
import { Instrument_Serif, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import {
  SITE_URL,
  SUPPORT_EMAIL,
  VOICE_PHONE_TEL,
  SITE_SEO_TITLE,
  SITE_SEO_DESCRIPTION,
  SITE_DISCLAIMER,
  STARTER_PRICE_USD,
  PURCHASE_PRICE_USD,
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
    "AI legal document drafting software",
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
  telephone: VOICE_PHONE_TEL,
  priceRange: "$1,497 to $2,997 one-time purchase; optional $125/month maintenance",
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  disclaimer: SITE_DISCLAIMER,
}

/** Tells search engines and AI tools this is installable software, with the two real plans and prices.
 *  No ratings or reviews here until real ones exist. */
const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Ask AI Legal",
  description: DESCRIPTION,
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Windows, macOS",
  featureList: [
    "Court document drafting for self-represented people",
    "Case organization for court papers and exhibits",
    "Court deadline tracking",
    "Legal research with sources",
    "Writing Check and Second Opinion review of drafts",
    "Second Brain memory that learns from each document",
    "Privacy mode that replaces names before anything is sent",
  ],
  offers: [
    { "@type": "Offer", name: "Starter", price: String(STARTER_PRICE_USD), priceCurrency: "USD", url: `${SITE_URL}/plans` },
    { "@type": "Offer", name: "Complete", price: String(PURCHASE_PRICE_USD), priceCurrency: "USD", url: `${SITE_URL}/plans` },
  ],
  publisher: { "@type": "Organization", name: "Ask AI Legal", url: SITE_URL, email: SUPPORT_EMAIL },
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
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
