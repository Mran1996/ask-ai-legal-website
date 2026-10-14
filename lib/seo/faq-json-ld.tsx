import type { FaqItem } from "@/lib/faq"
import { SITE_URL } from "@/lib/site-config"

/** FAQPage JSON-LD for exactly the questions a page shows. */
export function FaqJsonLd({ items, path }: { items: FaqItem[]; path: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
    url: `${SITE_URL}${path}`,
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
