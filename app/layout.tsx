import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

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
}

export const metadata: Metadata = {
  title: "Ask AI Legal — Legal Document Generation",
  description:
    "We generate your court-ready legal documents — researched, drafted, and delivered. Not a law firm.",
  openGraph: {
    title: "Ask AI Legal — We Generate Your Legal Documents.",
    description:
      "Attorney-quality motions and filings — generated for you.",
    type: "website",
  },
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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
