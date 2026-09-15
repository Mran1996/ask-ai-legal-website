import { Footer } from "@/components/footer"
import { FaqJsonLd } from "@/lib/seo/faq-json-ld"
import { CineNav } from "@/components/cinematic/nav"
import { StoryHero } from "@/components/cinematic/story-hero"
import { InstallStory } from "@/components/cinematic/install-story"
import { RetainerTrap } from "@/components/cinematic/retainer-trap"
import { HowItWorks } from "@/components/cinematic/how-it-works"
import { Situations } from "@/components/cinematic/situations"
import { SourcesBand } from "@/components/cinematic/sources-band"
import { ClosingCta } from "@/components/cinematic/closing-cta"
import { SmoothScroll } from "@/components/cinematic/smooth-scroll"

export default function Home() {
  return (
    <div className="cine min-h-screen">
      <FaqJsonLd />
      <SmoothScroll />
      <CineNav />
      <main>
        <StoryHero />
        <InstallStory />
        <RetainerTrap />
        <HowItWorks />
        <Situations />
        <SourcesBand />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  )
}
