import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ServicesPageContent } from "@/components/services-page-content"

export const metadata: Metadata = {
  title: "Services — Ask AI Legal",
  description:
    "Full-service legal document preparation: case analysis, roadmap, research, success rate analysis, hearing prep, drafting, delivery, and revisions. Not a law firm — documents for your review.",
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
