import type { Metadata } from "next"
import { ArrowRight, Facebook, Instagram, Mail, Phone, ShieldCheck, Youtube } from "lucide-react"
import { Footer } from "@/components/footer"
import { ALT_BG, Eyebrow, gold, H1, ink, muted, PAGE_BG, PRIMARY_BTN, SiteHeader } from "@/components/site/ui"
import { ContactForm } from "@/components/contact-form"
import {
  SITE_DISCLAIMER,
  SITE_LEGAL_NAME,
  SITE_URL,
  SOCIAL_LINKS,
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
  VOICE_PHONE_DISPLAY,
  VOICE_PHONE_TEL,
  OG_IMAGE,
} from "@/lib/site-config"

const TITLE = "Contact Ask AI Legal"
const DESCRIPTION =
  "Ask a question before you buy, get extra help with ChatGPT or Claude, or contact us about support or billing."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/contact`,
    images: [OG_IMAGE],
  },
}

const LABEL = "font-mono text-[11px] uppercase tracking-[0.16em] text-[#e8c98a]/80"
const SOCIAL_BTN =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#f3ead8] transition-colors hover:border-[#e8c98a]/60 hover:text-[#e8c98a]"

export default function ContactPage() {
  return (
    <div className={PAGE_BG}>
      <SiteHeader />

      <main>
        {/* 1. Intro */}
        <section className="relative overflow-hidden pb-16 pt-16 lg:pt-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,201,138,0.08),transparent_60%)]" />
          <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
            <Eyebrow>Contact us</Eyebrow>
            <H1>
              Ask us anything, <em className={gold}>before or after you buy.</em>
            </H1>
            {/* Plain <a> (full page load) so the form reads ?topic=chatgpt and scrolls to itself. */}
            <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-[#e8c98a]/25 bg-white/[0.025] p-6 text-left sm:flex-row sm:justify-between">
              <div>
                <p className={`font-semibold ${ink}`}>Want extra help with ChatGPT or Claude?</p>
                <p className={`mt-1 text-sm ${muted}`}>
                  Write your question and we answer by email. You usually get a reply right back.
                </p>
              </div>
              <a href="/contact?topic=chatgpt" className={`${PRIMARY_BTN} shrink-0`}>
                Get extra help <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        {/* 2. Details and form */}
        <section className={`border-t border-white/[0.06] ${ALT_BG} py-20`}>
          <div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <dl className="space-y-8">
                <div>
                  <dt className={LABEL}>Call</dt>
                  <dd className="mt-2">
                    <a href={`tel:${VOICE_PHONE_TEL}`} className={`inline-flex items-center gap-2 text-lg font-semibold ${ink} hover:text-[#e8c98a]`}>
                      <Phone className="h-4 w-4 text-[#e8c98a]" aria-hidden /> {VOICE_PHONE_DISPLAY}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className={LABEL}>Email</dt>
                  <dd className="mt-2">
                    <a href={SUPPORT_MAILTO} className={`inline-flex items-center gap-2 text-lg font-semibold ${ink} hover:text-[#e8c98a]`}>
                      <Mail className="h-4 w-4 text-[#e8c98a]" aria-hidden /> {SUPPORT_EMAIL}
                    </a>
                    <p className={`mt-1 text-sm ${muted}`}>For support or billing, pick that option in the form.</p>
                  </dd>
                </div>
                <div>
                  <dt className={LABEL}>Company</dt>
                  <dd className={`mt-2 text-sm ${ink}`}>{SITE_LEGAL_NAME}</dd>
                </div>
                <div>
                  <dt className={LABEL}>Follow us</dt>
                  <dd className="mt-3 flex items-center gap-3">
                    <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={SOCIAL_BTN}>
                      <Instagram className="h-5 w-5" aria-hidden />
                    </a>
                    <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={SOCIAL_BTN}>
                      <Facebook className="h-5 w-5" aria-hidden />
                    </a>
                    <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={SOCIAL_BTN}>
                      <Youtube className="h-5 w-5" aria-hidden />
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className={LABEL}>Already a customer?</dt>
                  <dd className="mt-2 text-sm">
                    <a href={SOCIAL_LINKS.facebookReviews} target="_blank" rel="noopener noreferrer" className={`${ink} underline underline-offset-4 hover:text-[#e8c98a]`}>
                      Leave us a review on Facebook
                    </a>
                  </dd>
                </div>
              </dl>

              <div className="mt-10 flex items-start gap-3 border-t border-white/10 pt-6">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#e8c98a]" aria-hidden />
                <p className={`text-xs leading-relaxed ${muted}`}>{SITE_DISCLAIMER}</p>
              </div>
            </div>

            <div>
              <h2 className={`font-[family-name:var(--font-serif)] text-3xl ${ink}`}>Send us a message</h2>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
