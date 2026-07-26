import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ServicesPageContent } from "@/components/services-page-content"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full document preparation service: case analysis, roadmap, verified source research, hearing prep, drafting, delivery, and revisions. Not a law firm — documents for your review.",
  alternates: { canonical: "/services" },
}

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <ServicesPageContent />
      <Footer />
    </div>
  )
}
