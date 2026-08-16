import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ServicesPageContent } from "@/components/services-page-content"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Case review and complete hands-on support: we listen, assess, walk you through your setup, and support you for 30 days. Not a law firm — guidance only.",
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
