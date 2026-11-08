import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { FaqJsonLd } from "@/lib/seo/faq-json-ld"
import { HOME_FAQ } from "@/lib/faq"
import { CineNav } from "@/components/cinematic/nav"
import { WorkspaceHero } from "@/components/cinematic/workspace-hero"
import { SeeDifference } from "@/components/cinematic/see-difference"
import { SampleDocuments } from "@/components/cinematic/sample-documents"
import { InstallStory } from "@/components/cinematic/install-story"
import { PurchaseIncludes } from "@/components/cinematic/purchase-includes"
import { Ownership } from "@/components/cinematic/ownership"
import { SecondBrain } from "@/components/cinematic/second-brain"
import { PrivacyFlow } from "@/components/cinematic/privacy-flow"
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
      <FaqJsonLd items={HOME_FAQ} path="/#faq" />
      <SmoothScroll />
      <CineNav />
      <main>
        <WorkspaceHero />
        <SeeDifference />
        <SampleDocuments />
        <PurchaseIncludes />
        <HowItWorks />
        <Situations />
        <InstallStory />
        <Ownership />
        <SecondBrain />
        <PrivacyFlow />
        <ToolsCompact />
        <SourcesBand />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  )
}
