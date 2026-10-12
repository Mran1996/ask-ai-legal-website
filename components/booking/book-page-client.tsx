"use client"

import Link from "next/link"
import { CineNav } from "@/components/cinematic/nav"
import { BookingBanner } from "@/components/brand/booking-banner"
import {
  BOOKING_DISCLAIMER,
  INTAKE_BOOKING_ENABLED,
  INTAKE_CALL_DESCRIPTION,
  buildCalcomEmbedSrc,
  buildCalcomPublicUrl,
  calcomIntakeSlug,
  type BookCallType,
} from "@/lib/booking"
import { CalcomEmbed } from "@/components/booking/calcom-embed"
import { SITE_BRAND_NAME, FILE_REVIEW_DEPOSIT_LABEL } from "@/lib/site-config"

type Props = {
  callType: string
  caseId: string
  caseReference: string
  email: string
  name: string
}

function callTitle(callType: string): string {
  if (callType === "document_planning") return "Document planning call"
  if (callType === "follow_up_paid") return "Follow-up call"
  return "Installation consultation"
}

function callDescription(callType: string): string {
  if (callType === "document_planning") {
    return `Included with your paid ${FILE_REVIEW_DEPOSIT_LABEL.toLowerCase()} — discuss next documents and timeline.`
  }
  if (callType === "follow_up_paid") {
    return "30-minute follow-up call ($50) — available after included planning calls are used."
  }
  return INTAKE_CALL_DESCRIPTION
}

export function BookPageClient({
  callType,
  caseId,
  caseReference,
  email,
  name,
}: Props) {
  const normalizedType = (callType || "intake") as BookCallType
  const embedSrc =
    caseId && caseReference && email
      ? buildCalcomEmbedSrc({
          email,
          name,
          caseReference,
          caseId,
          callType: normalizedType,
        })
      : null

  const publicCalUrl =
    caseId && caseReference && email
      ? buildCalcomPublicUrl({ email, name, caseReference, caseId })
      : null

  const slugConfigured = Boolean(calcomIntakeSlug())

  return (
    <main className="min-h-screen bg-ground text-white">
      <CineNav />
      <div className="container-main section-pad-under-header">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-sm text-white/50 hover:text-gold">
            ← {SITE_BRAND_NAME}
          </Link>

          <BookingBanner className="mt-8" />

          <p className="firm-label mt-8 text-gold">Book a call</p>
          <h1 className="firm-title mt-3 text-white">{callTitle(normalizedType)}</h1>
          <p className="mt-4 text-white/70">{callDescription(normalizedType)}</p>

          {caseReference && (
            <p className="mt-3 font-mono text-sm text-gold">Reference: {caseReference}</p>
          )}

          <p className="mt-4 text-xs leading-relaxed text-white/45">{BOOKING_DISCLAIMER}</p>

          <div className="mt-8">
            {!INTAKE_BOOKING_ENABLED || !slugConfigured || !caseId || !caseReference || !email ? (
              <div className="rounded-md border border-white/15 bg-white/5 px-4 py-6 text-sm text-white/75">
                <p className="font-semibold text-white">Book through our contact page.</p>
                <p className="mt-2">
                  Send us a message on the{" "}
                  <Link href="/contact" className="text-gold underline">
                    contact page
                  </Link>{" "}
                  with the best times to reach you, or email{" "}
                  <a href="mailto:support@askailegal.com" className="text-gold underline">
                    support@askailegal.com
                  </a>
                  . We&apos;ll reply by email to arrange your consultation.
                </p>
              </div>
            ) : embedSrc ? (
              <>
                <CalcomEmbed src={embedSrc} title={callTitle(normalizedType)} />
                {publicCalUrl && (
                  <p className="mt-4 text-center text-sm text-white/55">
                    Calendar not loading?{" "}
                    <a
                      href={publicCalUrl}
                      className="font-semibold text-gold underline-offset-2 hover:underline"
                      rel="noopener noreferrer"
                    >
                      Open the scheduling page
                    </a>
                  </p>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}
