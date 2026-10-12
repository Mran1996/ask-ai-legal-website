import { en } from "@/lib/i18n/translations/en"

/** Visible homepage FAQ — same source as FaqJsonLd, so the markup always matches what people see. */
export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-20 bg-ground-surface py-24 sm:py-32">
      <div className="cine-container">
        <p className="cine-label mb-6">{en.faq.label}</p>
        <h2 className="cine-h2 text-cream">{en.faq.title}</h2>

        <dl className="mt-14 grid gap-5 md:grid-cols-2">
          {en.faq.items.map((item) => (
            <div key={item.q} className="cine-card p-7 sm:p-8">
              <dt className="cine-h3 !text-xl text-cream">{item.q}</dt>
              <dd className="cine-body mt-3 !text-base">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
