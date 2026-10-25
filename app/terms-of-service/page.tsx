import type { Metadata } from "next"
import Link from "next/link"
import { LegalDocumentLayout } from "@/components/legal-document-layout"
import { SUPPORT_EMAIL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for using Ask AI Legal: your software license, installation and support, refunds, and why Ask AI Legal is not a law firm and gives no legal advice.",
  alternates: { canonical: "/terms-of-service" },
}

const LAST_UPDATED = "October 25, 2026"

export default function TermsOfServicePage() {
  return (
    <LegalDocumentLayout title="Terms of Service" lastUpdated={LAST_UPDATED}>
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the
        website, installation consultations, and the Ask AI Legal software and installation
        services offered by Ask AI Legal LLC (&ldquo;Ask AI Legal,&rdquo; &ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing our website, booking a
        consultation, or purchasing a plan, you agree to these Terms. If you do not agree, do
        not use our services.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Ask AI Legal sells a one-time purchase of <strong>legal workspace software</strong> that
        is installed on your computer, together with the installation, configuration, and
        training services described on our plans page. The installed software drafts documents,
        research materials, and related written work from the information you provide. We are{" "}
        <strong>not a law firm</strong>, and our personnel are <strong>not your attorneys</strong>.
      </p>

      <h2>2. No legal advice or representation</h2>
      <p>
        Our services do <strong>not</strong> include legal advice, legal representation,
        attorney-client privilege, or appearance on your behalf in any court, agency, or
        proceeding. Communications with Ask AI Legal — including phone consultations, email,
        and messaging — do <strong>not</strong> create an attorney-client relationship.
      </p>
      <p>
        You are solely responsible for deciding whether to use any document the software drafts,
        how to file it, and whether to seek independent legal counsel. We strongly encourage you
        to consult a licensed attorney in your jurisdiction before relying on any software output
        for a legal matter.
      </p>

      <h2>3. Eligibility</h2>
      <p>You may use our services only if you:</p>
      <ul>
        <li>Are at least 18 years of age (or the age of majority in your jurisdiction);</li>
        <li>Have the legal capacity to enter into a binding agreement;</li>
        <li>Provide accurate and complete information about yourself and your computer; and</li>
        <li>Use our services only for lawful purposes.</li>
      </ul>

      <h2>4. Consultations and plans</h2>
      <p>
        Installation consultations are offered at no charge at our discretion. During a
        consultation we confirm your computer&apos;s compatibility, explain the included features
        and connected services, and review any additional costs before you purchase.
      </p>
      <p>Ask AI Legal offers two one-time plans:</p>
      <ul>
        <li>
          <strong>Starter</strong> — $1,997, paid once. Includes a live installation on your
          computer and 14 days of installation support after installation.
        </li>
        <li>
          <strong>Complete</strong> — $3,997, paid once. Includes a live installation on your
          computer and 30 days of installation support after installation.
        </li>
      </ul>
      <p>
        Optional maintenance is $125 per month on either plan. The features included with each
        plan are listed on our plans page and confirmed during your consultation.
      </p>

      <h2>5. Software and installation</h2>
      <p>
        Your purchase includes a license to the installed software for your computer, its
        installation and configuration, personal training, and a written getting-started guide.
        Available features depend on your computer, your installation, and the services you
        connect. The installed software drafts documents; you review, edit, and decide what to
        file.
      </p>
      <p>Unless expressly stated in your purchase terms, we do not:</p>
      <ul>
        <li>Appear in court or at hearings on your behalf;</li>
        <li>File documents with any court or agency as your representative;</li>
        <li>Negotiate with opposing parties or counsel;</li>
        <li>Provide ongoing representation or monitoring of your matter; or</li>
        <li>Guarantee any particular outcome in your matter.</li>
      </ul>

      <h2>6. Third-party services and fees</h2>
      <p>
        Third-party AI model usage, API charges, research platform subscriptions, plugin
        services, and other provider costs are separate from your plan price unless expressly
        included in your purchase agreement. They are billed by the provider.
      </p>
      <p>
        Your installed copy does not require maintenance. Optional maintenance provides ongoing
        support, supported software updates, and help maintaining your API and plugin connections
        as services change.
      </p>

      <h2>7. Your responsibilities</h2>
      <p>You agree to:</p>
      <ul>
        <li>Provide truthful, complete, and timely information;</li>
        <li>Review all software output carefully before filing or using it;</li>
        <li>Meet any court deadlines and procedural rules applicable to your matter;</li>
        <li>Keep your computer, accounts, and API credentials secure;</li>
        <li>
          Obtain independent legal advice when your matter requires it, including for questions
          about strategy, rights, or the law.
        </li>
      </ul>
      <p>
        We are not responsible for errors or adverse results arising from incomplete, inaccurate,
        or withheld information you provide, or from output you use without review.
      </p>

      <h2>8. Payment and refunds</h2>
      <p>
        Plan prices are as stated on our plans page and in your purchase terms. Refunds are
        governed by our <Link href="/guarantee">100% money-back guarantee</Link>. Where the
        guarantee does not apply, refunds are handled as required by applicable law. Once your
        install passes the checklist test, your plan purchase is final, because the installed
        software stays on your computer.
      </p>
      <p>
        If you dispute a charge, contact us at{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> within fourteen (14) days of the
        charge.
      </p>

      <h2>9. Support and maintenance</h2>
      <p>
        Installation support is included for 14 days (Starter) or 30 days (Complete), counted from
        the date your installation is completed. Maintenance at $125 per month is optional and
        may be cancelled as described in your purchase terms.
      </p>

      <h2>10. Intellectual property and license</h2>
      <p>
        Upon full payment, you receive a license to use the Ask AI Legal software installed on
        your computer for your personal use, subject to the third-party licenses that apply to
        its components. Ask AI Legal retains ownership of its software, methodologies, templates,
        and pre-existing materials.
      </p>
      <p>
        Third-party AI models, APIs, libraries, and other components remain subject to their
        providers&apos; ownership rights and license terms. You may not resell, redistribute, or
        publish the software or its output as a template service or for commercial use without
        our prior written consent.
      </p>

      <h2>11. Confidentiality</h2>
      <p>
        We treat information you provide as confidential within our organization and use it only
        to provide services, operate our business, and as described in our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>. Confidentiality obligations are
        subject to legal compulsion (such as a valid subpoena) and do not create attorney-client
        privilege.
      </p>

      <h2>12. Acceptable use</h2>
      <p>You may not use our website or services to:</p>
      <ul>
        <li>Submit false, misleading, or fraudulent information;</li>
        <li>Harass, threaten, or abuse our staff;</li>
        <li>Attempt unauthorized access to our systems;</li>
        <li>Scrape, reverse engineer, or misuse our website or software; or</li>
        <li>Violate any applicable law or court order.</li>
      </ul>
      <p>
        We may refuse or terminate service at our discretion if we believe a request is
        unlawful, unethical, outside our scope, or inconsistent with these Terms.
      </p>

      <h2>13. Disclaimers</h2>
      <p>
        OUR SERVICES, SOFTWARE, AND WEBSITE ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
        AVAILABLE,&rdquo; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING
        IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
        NON-INFRINGEMENT. WE DO NOT WARRANT THAT SOFTWARE OUTPUT WILL ACHIEVE ANY PARTICULAR
        RESULT IN YOUR CASE.
      </p>
      <p>
        See also our <Link href="/disclaimer">Disclaimer</Link>, which is incorporated into these
        Terms by reference.
      </p>

      <h2>14. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, ASK AI LEGAL AND ITS OFFICERS, EMPLOYEES,
        CONTRACTORS, AND AFFILIATES WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
        CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, LOST DATA, OR LOSS OF GOODWILL,
        ARISING FROM OR RELATED TO OUR SERVICES OR THESE TERMS.
      </p>
      <p>
        OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO YOUR PURCHASE OR THESE
        TERMS WILL NOT EXCEED THE AMOUNT YOU PAID US FOR THAT PURCHASE, OR ONE HUNDRED U.S.
        DOLLARS ($100), WHICHEVER IS GREATER.
      </p>
      <p>
        Some jurisdictions do not allow certain limitations; in those jurisdictions, our
        liability is limited to the fullest extent permitted by law.
      </p>

      <h2>15. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless Ask AI Legal and its personnel from any
        claims, damages, losses, or expenses (including reasonable attorneys&apos; fees) arising
        from: (a) your use of the software or its output; (b) information you provide; (c) your
        violation of these Terms; or (d) your violation of any law or third-party rights.
      </p>

      <h2>16. Dispute resolution and governing law</h2>
      <p>
        These Terms are governed by the laws of the State of Delaware, United States, without
        regard to conflict-of-law principles, except where mandatory consumer protection laws in
        your state of residence apply.
      </p>
      <p>
        Before filing any formal proceeding, you agree to contact us at{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and attempt to resolve the dispute
        informally for at least thirty (30) days.
      </p>
      <p>
        Except where prohibited by law, any dispute not resolved informally shall be resolved by
        binding arbitration on an individual basis, not as a class or representative action. You
        may also bring qualifying claims in small claims court.
      </p>

      <h2>17. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The &ldquo;Last updated&rdquo; date at the top
        of this page indicates when they were last revised. Material changes will be posted on
        this page. Continued use of our services after changes constitutes acceptance of the
        revised Terms.
      </p>

      <h2>18. Contact</h2>
      <p>Questions about these Terms may be directed to:</p>
      <p>
        Ask AI Legal LLC
        <br />
        Email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
      </p>
    </LegalDocumentLayout>
  )
}
