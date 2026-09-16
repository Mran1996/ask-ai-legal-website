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

export const metadata: Metadata = {
  title: "What gets installed — the same class of tools the other side has",
  description:
    "Verified research connections, court-ready drafting, a workspace that remembers your matter, inbox and calendar watch, drafting on your own model — installed on your computer so you can fight your legal matter from home.",
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
              Everything your workspace
              <br />
              <span className="cine-serif text-accent-light">comes with.</span>
            </h1>
            <p className="cine-body mt-8 max-w-2xl">
              Installed on your own computer, configured for your matter, walked through live on your screen and recorded
              for you. Then you run it — from home.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/pay" className="cine-btn-gold">
                Start from home <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="#tools" className="cine-btn-ghost">
                See the tools
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
