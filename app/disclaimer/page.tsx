import type { Metadata } from "next"
import Link from "next/link"
import { LegalDocumentLayout } from "@/components/legal-document-layout"
import { SUPPORT_EMAIL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Important disclaimers regarding Ask AI Legal's document preparation services.",
  alternates: { canonical: "/disclaimer" },
}

const LAST_UPDATED = "July 26, 2026"

export default function DisclaimerPage() {
  return (
    <LegalDocumentLayout title="Disclaimer" lastUpdated={LAST_UPDATED}>
      <p>
        Please read this Disclaimer carefully before using the website or services of Ask AI
        Legal LLC (&ldquo;Ask AI Legal,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;). By using our website or services, you acknowledge that you have
        read, understood, and agree to this Disclaimer.
      </p>

      <h2>1. Not a law firm</h2>
      <p>
        Ask AI Legal is a <strong>document generation service</strong>. We are{" "}
        <strong>not a law firm</strong>, and our team members are <strong>not attorneys</strong>{" "}
        acting as your legal counsel unless explicitly stated otherwise in a separate written
        agreement signed by a licensed attorney (which we do not offer through this service).
      </p>
      <p>
        We generate documents. We do <strong>not</strong> appear in court, file documents on
        your behalf, or represent you in any proceeding.
      </p>

      <h2>2. No legal advice</h2>
      <p>
        Information on our website — including articles, FAQs, consultation summaries, research
        summaries, and prepared documents — is provided for <strong>general informational and
        document-preparation purposes only</strong>. It is <strong>not legal advice</strong>{" "}
        and is not tailored to your specific legal rights, obligations, or strategy unless
        expressly described in a written quote or deliverable scope you have accepted.
      </p>
      <p>
        You should not rely on our website, consultations, or deliverables as a substitute for
        advice from a licensed attorney in your jurisdiction. Laws vary by state and locality
        and change over time.
      </p>

      <h2>3. No guarantee of results</h2>
      <p>
        Legal outcomes depend on many factors outside our control, including facts, law,
        judges, opposing parties, procedural compliance, and timing. We do{" "}
        <strong>not guarantee</strong> that any document we prepare will be accepted by a
        court, that any motion will be granted, or that you will achieve any particular result
        in your matter.
      </p>
      <p>
        Any references on our website to research depth, matter matching, outcome likelihood
        analysis, or similar analyses describe preparation methods and informational insights —
        not promises or predictions about your outcome.
      </p>

      <h2>4. Your responsibility</h2>
      <p>You are solely responsible for:</p>
      <ul>
        <li>Reviewing all prepared materials before filing or using them;</li>
        <li>Ensuring accuracy of facts you provide to us;</li>
        <li>Meeting filing deadlines and court rules in your jurisdiction;</li>
        <li>Deciding whether to proceed with any legal action; and</li>
        <li>Seeking independent legal counsel when appropriate.</li>
      </ul>
      <p>
        Filing or using a document without understanding its content, effect, or procedural
        requirements is at your own risk.
      </p>

      <h2>5. Unauthorized practice of law</h2>
      <p>
        We prepare documents based on information you supply and within the scope of permitted
        document preparation and self-help services. We do not advise you as to what you
        should do in your legal matter, what legal rights you have, or what outcome you should
        expect. If your jurisdiction restricts or regulates document preparation services, you
        are responsible for ensuring that your use of our services complies with local rules.
      </p>

      <h2>6. Technology-assisted preparation</h2>
      <p>
        Our preparation process may use software, automation, and research tools to assist with
        drafting, formatting, and analysis. All deliverables are reviewed in the ordinary course
        of our service workflow. Technology assists our team; it does not replace your
        obligation to review materials and make your own informed decisions.
      </p>
      <p>
        Automated or software-generated outputs may contain errors. You must verify citations,
        facts, names, dates, and jurisdictional requirements before use.
      </p>

      <h2>7. Third-party resources</h2>
      <p>
        Our website or deliverables may reference or link to court websites, statutes, cases, or
        third-party resources. We do not control and are not responsible for the accuracy,
        completeness, or availability of third-party content. Links are provided for
        convenience only and do not imply endorsement.
      </p>

      <h2>8. Testimonials and examples</h2>
      <p>
        Illustrative scenarios on our homepage — including names, portraits, and quoted text in
        the carousel — are <strong>composite marketing examples</strong>. They do not depict
        real clients, verified reviews, or actual outcomes. They are shown to explain common
        situations we may help with, not to represent specific people or guaranteed results.
      </p>
      <p>
        If we publish genuine client feedback in the future, it will be clearly labeled and
        shared only with appropriate consent. Nothing on this website is a guarantee that you
        will have the same experience or outcome. Results vary.
      </p>

      <h2>9. Emergency and time-sensitive matters</h2>
      <p>
        Our services are not designed for emergency legal situations. If you face an imminent
        deadline, arrest, hearing, or other urgent matter, contact a licensed attorney or
        appropriate emergency services immediately. Do not rely solely on our response times for
        time-critical decisions.
      </p>

      <h2>10. Payment and refunds</h2>
      <p>
        Fees are due as stated in your quote or invoice. Because our services involve custom
        research and drafting tailored to your matter,{" "}
        <strong>all fees are non-refundable once paid</strong>, including if you cancel, change your
        mind, do not use prepared documents, miss a deadline, or are dissatisfied with outcomes
        that depend on facts, courts, opposing parties, or your own filing choices. Exceptions apply
        only where required by applicable law or if we expressly agree in a signed writing.
      </p>
      <p>
        Full payment terms are in our{" "}
        <Link href="/terms-of-service">Terms of Service</Link>. Questions about charges may be
        directed to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Ask AI Legal disclaims liability for any
        damages arising from your use of or reliance on our website, consultations, or
        deliverables, including direct, indirect, incidental, or consequential damages. Our
        total liability is further limited as set forth in our{" "}
        <Link href="/terms-of-service">Terms of Service</Link>.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update this Disclaimer at any time. The &ldquo;Last updated&rdquo; date at the
        top indicates the latest version. Continued use of our website or services after
        changes constitutes acceptance.
      </p>

      <h2>13. Contact</h2>
      <p>Questions about this Disclaimer may be directed to:</p>
      <p>
        Ask AI Legal LLC
        <br />
        Email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
      </p>
      <p>
        See also our <Link href="/terms-of-service">Terms of Service</Link> and{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
    </LegalDocumentLayout>
  )
}
