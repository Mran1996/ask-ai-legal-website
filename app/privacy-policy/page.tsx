import type { Metadata } from "next"
import Link from "next/link"
import { LegalDocumentLayout } from "@/components/legal-document-layout"
import { SUPPORT_EMAIL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Ask AI Legal collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
}

const LAST_UPDATED = "June 29, 2026"

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <p>
        Ask AI Legal (&ldquo;Ask AI Legal,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;) respects your privacy. This Privacy Policy explains how we collect,
        use, disclose, and protect information when you visit our website, request a
        consultation, or use our document preparation services (collectively, the
        &ldquo;Services&rdquo;).
      </p>
      <p>
        By using the Services, you agree to the practices described here. If you do not agree,
        please do not use the Services.
      </p>

      <h2>1. Information we collect</h2>
      <h3>Information you provide</h3>
      <p>We may collect information you voluntarily provide, including:</p>
      <ul>
        <li>Name, email address, phone number, and mailing address;</li>
        <li>
          Details about your legal matter, including case type, jurisdiction, parties,
          deadlines, and narrative descriptions;
        </li>
        <li>Documents, filings, correspondence, and other materials you upload or send us;</li>
        <li>Payment and billing information (processed by our payment providers); and</li>
        <li>Communications with our team (calls, emails, messages, and consultation notes).</li>
      </ul>

      <h3>Information collected automatically</h3>
      <p>When you use our website, we may automatically collect:</p>
      <ul>
        <li>Device type, browser type, and operating system;</li>
        <li>IP address and approximate location derived from IP;</li>
        <li>Pages viewed, links clicked, and time spent on our site;</li>
        <li>Referring URL and search terms used to find our site; and</li>
        <li>Cookies and similar technologies (see Section 8).</li>
      </ul>

      <h2>2. How we use information</h2>
      <p>We use information we collect to:</p>
      <ul>
        <li>Respond to inquiries and schedule consultations;</li>
        <li>Prepare quotes and perform document preparation services you request;</li>
        <li>Communicate with you about your matter, deliverables, and account status;</li>
        <li>Process payments and prevent fraud;</li>
        <li>Improve our website, services, and internal research tools;</li>
        <li>Comply with legal obligations and enforce our Terms; and</li>
        <li>
          Send service-related notices. We do not sell your personal information for
          third-party marketing.
        </li>
      </ul>

      <h2>3. Sensitive information</h2>
      <p>
        Information about legal matters may be sensitive. We handle case-related information
        with care and restrict internal access to personnel who need it to perform the
        Services. Because we are a document preparation service — not a law firm — information
        you share with us is <strong>not protected by attorney-client privilege</strong>.
        Please do not send information you are not comfortable sharing in that context.
      </p>

      <h2>4. How we share information</h2>
      <p>We may share information with:</p>
      <ul>
        <li>
          <strong>Service providers</strong> who assist with hosting, email, telephony,
          payment processing, analytics, and document storage, under contractual obligations
          to protect data;
        </li>
        <li>
          <strong>Professional advisors</strong> (such as accountants or insurers) when
          necessary for our business operations;
        </li>
        <li>
          <strong>Legal and regulatory authorities</strong> when required by law, subpoena,
          court order, or to protect rights, safety, and security; and
        </li>
        <li>
          <strong>Successors</strong> in connection with a merger, acquisition, or sale of
          assets, subject to this Privacy Policy.
        </li>
      </ul>
      <p>We do not sell or rent your personal information to third parties for their marketing.</p>

      <h2>5. Data retention</h2>
      <p>
        We retain information for as long as needed to provide the Services, fulfill our
        contractual obligations, resolve disputes, and comply with legal and recordkeeping
        requirements. Matter files may be retained for a period after your engagement ends so
        we can respond to revision requests or legal inquiries, unless you request deletion
        where we are not required to retain data.
      </p>

      <h2>6. Security</h2>
      <p>
        We implement reasonable administrative, technical, and organizational measures
        designed to protect information against unauthorized access, loss, or misuse. No
        method of transmission or storage is completely secure; we cannot guarantee absolute
        security.
      </p>
      <p>
        You are responsible for maintaining the confidentiality of any credentials associated
        with your use of our Services and for ensuring that information you send us is
        transmitted through channels you accept.
      </p>

      <h2>7. Your choices and rights</h2>
      <p>Depending on where you live, you may have rights to:</p>
      <ul>
        <li>Access personal information we hold about you;</li>
        <li>Request correction of inaccurate information;</li>
        <li>Request deletion of certain information;</li>
        <li>Opt out of marketing communications (we send few, if any); and</li>
        <li>Obtain a copy of your data in a portable format where applicable.</li>
      </ul>
      <p>
        <strong>California residents:</strong> Under the California Consumer Privacy Act (CCPA),
        as amended, you may have additional rights, including the right to know categories of
        personal information collected, to delete personal information subject to exceptions,
        and to opt out of the sale or sharing of personal information. We do not sell personal
        information as defined under the CCPA.
      </p>
      <p>
        To exercise privacy rights, email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with the subject line
        &ldquo;Privacy Request.&rdquo; We may verify your identity before responding. We will
        not discriminate against you for exercising your rights.
      </p>

      <h2>8. Cookies and analytics</h2>
      <p>
        We and our service providers may use cookies, pixels, and similar technologies to
        operate the website, remember preferences, and understand usage patterns. You can
        control cookies through your browser settings. Disabling cookies may affect site
        functionality.
      </p>

      <h2>9. Third-party links</h2>
      <p>
        Our website may link to third-party sites. We are not responsible for the privacy
        practices of those sites. We encourage you to review their policies before providing
        personal information.
      </p>

      <h2>10. Children&apos;s privacy</h2>
      <p>
        Our Services are not directed to individuals under 18. We do not knowingly collect
        personal information from children. If you believe we have collected information from a
        child, contact us and we will take appropriate steps to delete it.
      </p>

      <h2>11. International users</h2>
      <p>
        Our Services are intended primarily for users in the United States. If you access the
        Services from outside the U.S., you understand that information may be processed and
        stored in the United States, where laws may differ from those in your country.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo;
        date at the top reflects the most recent revision. Material changes will be posted on
        this page. Your continued use of the Services after changes constitutes acceptance of
        the updated policy.
      </p>

      <h2>13. Contact</h2>
      <p>Privacy questions or requests may be sent to:</p>
      <p>
        Ask AI Legal — Privacy
        <br />
        Email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
      </p>
      <p>
        For terms governing use of our Services, see our{" "}
        <Link href="/terms-of-service">Terms of Service</Link>.
      </p>
    </LegalDocumentLayout>
  )
}
