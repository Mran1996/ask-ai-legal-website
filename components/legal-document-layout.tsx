import Link from "next/link"
import { Footer } from "@/components/footer"
import { ALT_BG, Eyebrow, H1, muted, PAGE_BG, SiteHeader } from "@/components/site/ui"

type LegalDocumentLayoutProps = {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

const LEGAL_PAGES = [
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
]

/** Dark prose styles for the legal text. The text itself lives in each page and is not changed here. */
const PROSE = [
  "text-base leading-[1.75] text-[#a9b3c1]",
  "[&_p]:mb-4",
  "[&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:font-[family-name:var(--font-serif)] [&_h2]:text-2xl [&_h2]:font-normal [&_h2]:leading-tight [&_h2]:text-[#f3ead8] sm:[&_h2]:text-[1.75rem]",
  "[&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#f3ead8]",
  "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_li]:marker:text-[#e8c98a]/70",
  "[&_strong]:font-semibold [&_strong]:text-[#f3ead8]",
  "[&_a]:text-[#e8c98a] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-[#f3ead8]",
  "[&>*:first-child]:mt-0",
].join(" ")

export function LegalDocumentLayout({ title, lastUpdated, children }: LegalDocumentLayoutProps) {
  return (
    <div className={PAGE_BG}>
      <SiteHeader />
      <main>
        {/* 1. Intro */}
        <section className="relative overflow-hidden pb-12 pt-16 lg:pt-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,201,138,0.08),transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Eyebrow>Legal</Eyebrow>
            <H1>{title}</H1>
            <p className={`mt-5 text-sm ${muted}`}>Last updated: {lastUpdated}</p>
            <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Legal pages">
              {LEGAL_PAGES.map((p) => {
                const active = p.label === title
                return (
                  <Link
                    key={p.href}
                    href={p.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "border-[#e8c98a]/70 bg-[#e8c98a]/10 text-[#e8c98a]"
                        : "border-white/15 text-[#f3ead8] hover:border-[#e8c98a]/60 hover:text-[#e8c98a]"
                    }`}
                  >
                    {p.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </section>

        {/* 2. Document text */}
        <section className={`border-t border-white/[0.06] ${ALT_BG} pb-20 pt-14`}>
          <article className={`mx-auto max-w-3xl px-4 sm:px-6 ${PROSE}`}>{children}</article>
        </section>
      </main>
      <Footer />
    </div>
  )
}
