import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CineNav } from "@/components/cinematic/nav"
import { Footer } from "@/components/footer"
import { Tools } from "@/components/cinematic/tools"
import { HowItWorks } from "@/components/cinematic/how-it-works"
import { ClosingCta } from "@/components/cinematic/closing-cta"
import { SmoothScroll } from "@/components/cinematic/smooth-scroll"
import { Render } from "@/components/cinematic/render"
import { CONSULT_CTA_LABEL, CONSULT_HREF } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "AI Legal Research, Court Deadline Tracking & Case Organization",
  description:
    "AI legal research with source links, court deadline tracking, case organization, and document preparation for your review. A private AI legal assistant installed on your computer.",
  alternates: { canonical: "/services" },
}

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SmoothScroll />
      <CineNav />
      <main className="flex-grow">
        <section className="relative overflow-hidden bg-ground pt-32 pb-16 sm:pt-40 sm:pb-24">
          <div className="absolute inset-0 opacity-40">
            <Render src="story-02-install.png" className="h-full w-full" imgClassName="object-cover object-[60%_center]" />
            <div className="absolute inset-0 bg-gradient-to-r from-ground via-ground/85 to-ground/40" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ground to-transparent" />
          </div>
          <div className="cine-container relative">
            <p className="cine-label mb-6">What gets installed</p>
            <h1 className="cine-h1 max-w-[14ch] text-cream !text-[clamp(2.4rem,7vw,6rem)]">
              Everything your workspace{" "}
              <br />
              <span className="cine-serif text-accent-light">comes with.</span>
            </h1>
            <p className="cine-body mt-8 max-w-2xl">
              Installed on your computer and configured with you during installation. Here is what your workspace can
              do — and what depends on your installation and outside providers.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href={CONSULT_HREF} className="cine-btn-gold">
                {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/plans" className="cine-btn-ghost">
                See pricing
              </Link>
            </div>
          </div>
        </section>
        <Tools />
        <HowItWorks />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  )
}
