import type { Metadata } from "next"
import { Clock, Facebook, Instagram, Mail, ShieldCheck } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import {
  SITE_DISCLAIMER,
  SITE_LEGAL_NAME,
  SITE_URL,
  SOCIAL_LINKS,
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
} from "@/lib/site-config"

const TITLE = "Contact us"
const DESCRIPTION =
  "Contact Ask AI Legal with questions, concerns, or support requests. Send us a message and our team will reply by email — typically within one business day."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/contact`,
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow">
        <section className="section-navy section-pad-under-header">
          <div className="container-main max-w-4xl">
            <p className="firm-label text-gold">Contact us</p>
            <div className="gold-rule mb-8" />
            <h1 className="firm-title text-white">We&rsquo;re here to help</h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
              Have a question about your case, a document package, billing, or anything else? Send
              us a message below and our support team will get back to you by email. You can also
              reach us directly at{" "}
              <a className="text-gold underline underline-offset-2" href={SUPPORT_MAILTO}>
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
        </section>

        <section className="section-pad bg-cream">
          <div className="container-main max-w-5xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
              {/* Business information */}
              <div>
                <h2 className="font-display text-2xl font-semibold text-navy">Business information</h2>
                <div className="gold-rule mb-6 mt-3" />

                <dl className="space-y-6">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.15em] text-gold-dark">
                      Company
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-gray-700">{SITE_LEGAL_NAME}</dd>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" aria-hidden />
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-[0.15em] text-gold-dark">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed">
                        <a className="text-navy underline underline-offset-2 hover:text-gold-dark" href={SUPPORT_MAILTO}>
                          {SUPPORT_EMAIL}
                        </a>
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" aria-hidden />
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-[0.15em] text-gold-dark">
                        Response time
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-gray-700">
                        We typically reply within one business day.
                      </dd>
                    </div>
                  </div>

                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.15em] text-gold-dark">
                      Follow us
                    </dt>
                    <dd className="mt-2 flex items-center gap-3">
                      <a
                        href={SOCIAL_LINKS.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors hover:border-gold hover:text-gold-dark"
                      >
                        <Instagram className="h-5 w-5" aria-hidden />
                      </a>
                      <a
                        href={SOCIAL_LINKS.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors hover:border-gold hover:text-gold-dark"
                      >
                        <Facebook className="h-5 w-5" aria-hidden />
                      </a>
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 flex items-start gap-3 rounded-sm border border-navy/10 bg-white px-4 py-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" aria-hidden />
                  <p className="text-xs leading-relaxed text-gray-500">{SITE_DISCLAIMER}</p>
                </div>
              </div>

              {/* Contact form */}
              <div>
                <h2 className="font-display text-2xl font-semibold text-navy">Send us a message</h2>
                <div className="gold-rule mb-6 mt-3" />
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
