import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { DoneForYou } from "@/components/done-for-you"
import { ValueComparison } from "@/components/value-comparison"
import { FourPillarsSection } from "@/components/four-pillars-section"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { FaqSection } from "@/components/faq-section"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <HeroSection />
        <DoneForYou />
        <ValueComparison />
        <FourPillarsSection />
        <HowItWorks />
        <Testimonials />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
