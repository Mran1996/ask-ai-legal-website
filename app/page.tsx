import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { FaqJsonLd } from "@/lib/seo/faq-json-ld"
import { CineNav } from "@/components/cinematic/nav"
import { StoryHero } from "@/components/cinematic/story-hero"
import { InstallStory } from "@/components/cinematic/install-story"
import { PurchaseIncludes } from "@/components/cinematic/purchase-includes"
import { KnowWhatYouBuy } from "@/components/cinematic/know-what-you-buy"
import { ToolsCompact } from "@/components/cinematic/tools"
import { HowItWorks } from "@/components/cinematic/how-it-works"
import { Situations } from "@/components/cinematic/situations"
import { SourcesBand } from "@/components/cinematic/sources-band"
import { Faq } from "@/components/cinematic/faq"
import { ClosingCta } from "@/components/cinematic/closing-cta"
import { SmoothScroll } from "@/components/cinematic/smooth-scroll"
import { SITE_SEO_DESCRIPTION, SITE_SEO_TITLE, SITE_URL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: { absolute: SITE_SEO_TITLE },
  description: SITE_SEO_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_SEO_TITLE,
    description: SITE_SEO_DESCRIPTION,
    url: `${SITE_URL}/`,
  },
  twitter: {
    title: SITE_SEO_TITLE,
    description: SITE_SEO_DESCRIPTION,
  },
}

export default function Home() {
  return (
    <div className="cine min-h-screen">
      <FaqJsonLd />
      <SmoothScroll />
      <CineNav />
      <main>
        <StoryHero />
        <InstallStory />
        <PurchaseIncludes />
        <ToolsCompact />
        <KnowWhatYouBuy />
        <HowItWorks />
        <Situations />
        <SourcesBand />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  )
}
