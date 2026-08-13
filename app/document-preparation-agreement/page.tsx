import type { Metadata } from "next"
import Link from "next/link"
import { SITE_BRAND_NAME, SITE_DISCLAIMER, SUPPORT_EMAIL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `Document Preparation Service Agreement | ${SITE_BRAND_NAME}`,
  description: SITE_DISCLAIMER,
  robots: { index: true, follow: true },
}

export default function DocumentPreparationAgreementPage() {
  return (
    <main className="min-h-screen bg-white text-navy">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/" className="text-sm text-gray-500 hover:text-navy">
          ← {SITE_BRAND_NAME}
        </Link>
        <h1 className="mt-6 font-display text-3xl">Document Preparation Service Agreement</h1>
        <p className="mt-3 text-sm text-gray-600">
          Effective for engagements started by paying an Ask AI Legal invoice or Payment Link.
        </p>

        <div className="prose prose-sm mt-8 max-w-none space-y-4 text-gray-800">
          <p>
            Ask AI Legal™ (operated by <strong>Ask AI Legal LLC</strong>, &ldquo;we,&rdquo;
            &ldquo;us&rdquo;) provides <strong>document preparation</strong> and related
            clerical support only. We are <strong>not a law firm</strong>, we do not practice law,
            we do not create an attorney-client relationship, and we do not appear in court or file
            documents for you unless a separate written service (if ever offered) expressly says so.
          </p>
          <p>
            <strong>Scope.</strong> After you select a priority issue and pay the quoted start fee,
            we prepare documents described in your emailed issues/scope package. Delivery is by
            email. You are responsible for reviewing all drafts for accuracy and for filing/serving
            papers yourself or through your own counsel.
          </p>
          <p>
            <strong>Fees.</strong> The start fee in your invoice / Payment Link (often $499.99 unless
            otherwise stated) covers the initial document-preparation work described in that package.
            Additional documents or retrieval may require a separate quote.
          </p>
          <p>
            <strong>No legal advice.</strong> Information we provide is for document preparation and
            process explanation only. Court deadlines, strategy, and whether to file any particular
            paper are decisions for you (and any attorney you hire).
          </p>
          <p>
            <strong>Your responsibilities.</strong> Provide complete and truthful information;
            return intake forms promptly; keep your file reference (AAL-…) in email subjects; and
            tell us immediately if facts change.
          </p>
          <p>
            <strong>Acceptance.</strong> Paying the invoice or Payment Link constitutes acceptance of
            this agreement for that engagement.
          </p>
          <p>
            Questions:{" "}
            <a className="text-navy underline" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
