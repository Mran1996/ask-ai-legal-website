import { en } from "@/lib/i18n/translations/en"

/** Visible homepage FAQ — same source as FaqJsonLd, so the markup always matches what people see. */
export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-20 bg-ground-surface py-6 sm:py-10">
      <div className="cine-container">
        <p className="cine-label mb-3">{en.faq.label}</p>
        <h2 className="cine-h2 text-cream">{en.faq.title}</h2>

        <dl className="mt-8 grid gap-5 md:grid-cols-2">
          {en.faq.items.map((item) => (
            <div key={item.q} className="cine-card p-5 sm:p-6">
              <dt className="cine-h3 !text-xl text-cream">{item.q}</dt>
              <dd className="cine-body mt-2 !text-lg">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
