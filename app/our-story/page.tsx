import type { Metadata } from "next"
import { CineNav } from "@/components/cinematic/nav"
import { FounderNote } from "@/components/cinematic/founder-note"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Our Story | Why We Built Ask AI Legal",
  description:
    "Ask AI Legal started with one person going to court without a lawyer. Why we built a private legal assistant for people who represent themselves.",
  alternates: { canonical: "/our-story" },
}

export default function OurStoryPage() {
  return (
    <div className="cine min-h-screen">
      <CineNav />
      <main className="pt-24 pb-10 sm:pt-28">
        <FounderNote />
      </main>
      <Footer />
    </div>
  )
}
