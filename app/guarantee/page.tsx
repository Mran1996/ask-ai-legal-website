import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { CineNav } from "@/components/cinematic/nav"
import { Footer } from "@/components/footer"
import {
  CONSULT_CTA_LABEL,
  CONSULT_HREF,
  GUARANTEE_TEXT,
  GUARANTEE_TITLE,
} from "@/lib/site-config"

export const metadata: Metadata = {
  title: "100% Money-Back Guarantee",
  description:
    "During your install, we test Ask AI Legal on your computer against our written checklist. If it doesn't do what the checklist says, you get every dollar back.",
  alternates: { canonical: "/guarantee" },
}

export default function GuaranteePage() {
  return (
    <div className="cine min-h-screen">
      <CineNav />
      <main className="pt-24 pb-10 sm:pt-28">
        <section className="relative bg-ground py-6 sm:py-10">
          <div className="cine-container relative">
            <div className="cine-card mx-auto max-w-3xl border-accent/30 p-6 sm:p-10">
              <ShieldCheck className="h-10 w-10 text-accent-light" aria-hidden />
              <h1 className="cine-h2 mt-4 text-cream">{GUARANTEE_TITLE}</h1>
              <p className="cine-body mt-4">{GUARANTEE_TEXT}</p>

              <div className="mt-8">
                <Link href={CONSULT_HREF} className="cine-btn-gold">
                  {CONSULT_CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
