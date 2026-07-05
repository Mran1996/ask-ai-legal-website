import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

type LegalDocumentLayoutProps = {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalDocumentLayout({
  title,
  lastUpdated,
  children,
}: LegalDocumentLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow pt-[7.25rem] sm:pt-[7.75rem]">
        <section className="section-pad bg-cream">
          <article className="container-main max-w-3xl">
            <p className="firm-label text-gold-dark">Legal</p>
            <div className="gold-rule mb-6" />
            <h1 className="firm-title text-navy">{title}</h1>
            <p className="mt-4 text-sm text-gray-500">Last updated: {lastUpdated}</p>
            <div className="legal-prose mt-12">{children}</div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  )
}
