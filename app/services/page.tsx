import type { Metadata } from "next"
import { CineNav } from "@/components/cinematic/nav"
import { Footer } from "@/components/footer"
import { ServicesPageContent } from "@/components/services-page-content"

export const metadata: Metadata = {
  title: "Services",
  description:
    "We install Ask AI Legal so you can work from home — analysis, roadmap, verified research, hearing prep materials, document tools, and setup refinements.",
  alternates: { canonical: "/services" },
}

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <CineNav />
      <ServicesPageContent />
      <Footer />
    </div>
  )
}
