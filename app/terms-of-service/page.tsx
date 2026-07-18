import type { Metadata } from "next"
import Link from "next/link"
import { LegalDocumentLayout } from "@/components/legal-document-layout"
import { SUPPORT_EMAIL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing use of Ask AI Legal's document preparation services.",
  alternates: { canonical: "/terms-of-service" },
}

const LAST_UPDATED = "June 29, 2026"

export default function TermsOfServicePage() {
  return (
    <LegalDocumentLayout title="Terms of Service" lastUpdated={LAST_UPDATED}>
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the
        website, consultations, and document preparation services offered by Ask AI Legal LLC
        (&ldquo;Ask AI Legal,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
        By accessing our website, requesting a consultation, or purchasing services, you agree
        to these Terms. If you do not agree, do not use our services.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Ask AI Legal is a <strong>document preparation service</strong>. We prepare
        court-ready documents, research materials, and related written work product based on
        information you provide. We are <strong>not a law firm</strong>, and our personnel are{" "}
        <strong>not your attorneys</strong>.
      </p>

      <h2>2. No legal advice or representation</h2>
      <p>
        Our services do <strong>not</strong> include legal advice, legal representation,
        attorney-client privilege, or appearance on your behalf in any court, agency, or
        proceeding. Communications with Ask AI Legal — including phone consultations, email,
        and messaging — do <strong>not</strong> create an attorney-client relationship.
      </p>
      <p>
        You are solely responsible for deciding whether to use any document we prepare, how to
        file it, and whether to seek independent legal counsel. We strongly encourage you to
        consult a licensed attorney in your jurisdiction before relying on any prepared
        materials for a legal matter.
      </p>

      <h2>3. Eligibility</h2>
      <p>You may use our services only if you:</p>
      <ul>
        <li>Are at least 18 years of age (or the age of majority in your jurisdiction);</li>
        <li>Have the legal capacity to enter into a binding agreement;</li>
        <li>Provide accurate and complete information about your matter; and</li>
        <li>Use our services only for lawful purposes.</li>
      </ul>

      <h2>4. Consultations and quotes</h2>
      <p>
        Initial consultations may be offered at no charge at our discretion. During a
        consultation, we may ask questions about your situation to determine whether we can
        assist and to prepare a written quote describing scope, deliverables, timeline, and
        price.
      </p>
      <p>
        A quote is an offer valid for the period stated on it (or, if none is stated, thirty
        (30) days). Work begins only after you accept the quote and satisfy any payment
        requirements we specify. Quotes are based on the facts you provide; material changes
        to those facts may require a revised quote.
      </p>

      <h2>5. Services and deliverables</h2>
      <p>
        Depending on your matter, our services may include case research, document drafting,
        formatting, citation support, and revision rounds within the agreed scope. The specific
        deliverables for your matter will be listed in your accepted quote or written service
        agreement. We generate documents only.
      </p>
      <p>Unless expressly included in your quote, we do not:</p>
      <ul>
        <li>Appear in court or at hearings on your behalf;</li>
        <li>File documents with any court or agency as your representative;</li>
        <li>Negotiate with opposing parties or counsel;</li>
        <li>Provide ongoing representation or monitoring of your case; or</li>
        <li>Guarantee any particular outcome in your matter.</li>
      </ul>

      <h2>6. Your responsibilities</h2>
      <p>You agree to:</p>
      <ul>
        <li>Provide truthful, complete, and timely information and documents;</li>
        <li>Review all deliverables carefully before filing or using them;</li>
        <li>Meet any court deadlines and procedural rules applicable to your case;</li>
        <li>Notify us promptly if facts change in a way that could affect prepared materials;</li>
        <li>
          Obtain independent legal advice when your matter requires it, including for questions
          about strategy, rights, or the law.
        </li>
      </ul>
      <p>
        We are not responsible for errors or adverse results arising from incomplete,
        inaccurate, or withheld information you provide.
      </p>

      <h2>7. Payment, refunds, and cancellations</h2>
      <p>
        Fees are due as stated in your quote or invoice. Unless otherwise agreed in writing,
        payment is required before we begin substantive work or before release of final
        deliverables.
      </p>
      <p>
        Because our services involve custom research and drafting tailored to your matter,
        <strong> all fees are generally non-refundable</strong> once work has begun, except
        where required by applicable law or as we expressly agree in writing. If you cancel
        before work begins, we may refund any prepaid amount minus reasonable administrative
        costs.
      </p>
      <p>
        If you dispute a charge, contact us at{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> within fourteen (14) days of
        the charge.
      </p>

      <h2>8. Revisions</h2>
      <p>
        Revisions included in your quote are limited to corrections and refinements within the
        agreed scope of work. Requests for new documents, new legal theories, additional
        jurisdictions, or material new facts may require a separate quote.
      </p>

      <h2>9. Intellectual property and license</h2>
      <p>
        Upon full payment, you receive a non-exclusive license to use the deliverables we
        prepare for your personal legal matter, including filing with courts or agencies as
        permitted by law. Ask AI Legal retains ownership of its methodologies, templates,
        research systems, and pre-existing materials used to create your deliverables.
      </p>
      <p>
        You may not resell, redistribute, or publish our deliverables as a template service or
        for commercial use unrelated to your matter without our prior written consent.
      </p>

      <h2>10. Confidentiality</h2>
      <p>
        We treat information you provide about your matter as confidential within our
        organization and use it only to perform services, operate our business, and as
        described in our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>. Confidentiality obligations are
        subject to legal compulsion (such as a valid subpoena) and do not create
        attorney-client privilege.
      </p>

      <h2>11. Acceptable use</h2>
      <p>You may not use our website or services to:</p>
      <ul>
        <li>Submit false, misleading, or fraudulent information;</li>
        <li>Harass, threaten, or abuse our staff;</li>
        <li>Attempt unauthorized access to our systems;</li>
        <li>Scrape, reverse engineer, or misuse our website or tools; or</li>
        <li>Violate any applicable law or court order.</li>
      </ul>
      <p>
        We may refuse or terminate service at our discretion if we believe a request is
        unlawful, unethical, outside our scope, or inconsistent with these Terms.
      </p>

      <h2>12. Disclaimers</h2>
      <p>
        OUR SERVICES AND WEBSITE ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
        AVAILABLE,&rdquo; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING
        IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
        NON-INFRINGEMENT. WE DO NOT WARRANT THAT DELIVERABLES WILL ACHIEVE ANY PARTICULAR
        RESULT IN YOUR CASE.
      </p>
      <p>
        See also our <Link href="/disclaimer">Disclaimer</Link>, which is incorporated into
        these Terms by reference.
      </p>

      <h2>13. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, ASK AI LEGAL AND ITS OFFICERS, EMPLOYEES,
        CONTRACTORS, AND AFFILIATES WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
        CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, LOST DATA, OR LOSS OF GOODWILL,
        ARISING FROM OR RELATED TO OUR SERVICES OR THESE TERMS.
      </p>
      <p>
        OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO A SPECIFIC MATTER OR
        THESE TERMS WILL NOT EXCEED THE AMOUNT YOU PAID US FOR THAT MATTER IN THE TWELVE (12)
        MONTHS BEFORE THE CLAIM AROSE, OR ONE HUNDRED U.S. DOLLARS ($100), WHICHEVER IS
        GREATER.
      </p>
      <p>
        Some jurisdictions do not allow certain limitations; in those jurisdictions, our
        liability is limited to the fullest extent permitted by law.
      </p>

      <h2>14. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless Ask AI Legal and its personnel from
        any claims, damages, losses, or expenses (including reasonable attorneys&apos; fees)
        arising from: (a) your use of our deliverables; (b) information you provide; (c) your
        violation of these Terms; or (d) your violation of any law or third-party rights.
      </p>

      <h2>15. Dispute resolution and governing law</h2>
      <p>
        These Terms are governed by the laws of the State of Delaware, United States, without
        regard to conflict-of-law principles, except where mandatory consumer protection laws
        in your state of residence apply.
      </p>
      <p>
        Before filing any formal proceeding, you agree to contact us at{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and attempt to resolve the
        dispute informally for at least thirty (30) days.
      </p>
      <p>
        Except where prohibited by law, any dispute not resolved informally shall be resolved
        by binding arbitration on an individual basis, not as a class or representative action.
        You may also bring qualifying claims in small claims court.
      </p>

      <h2>16. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The &ldquo;Last updated&rdquo; date at the
        top of this page indicates when they were last revised. Material changes will be
        posted on this page. Continued use of our services after changes constitutes acceptance
        of the revised Terms.
      </p>

      <h2>17. Contact</h2>
      <p>
        Questions about these Terms may be directed to:
      </p>
      <p>
        Ask AI Legal LLC
        <br />
        Email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
      </p>
    </LegalDocumentLayout>
  )
}
