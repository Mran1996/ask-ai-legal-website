import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalMutation, internalQuery } from "./_generated/server"
import { findCaseByIdOrReference, resolveCaseReference } from "./lib/caseLookup"
import { formatCaseReference } from "./lib/intakeMapping"
import {
  appointmentCallTypeValidator,
  appointmentStatusValidator,
} from "./lib/validators"

const CALL_TYPE_LABELS: Record<"intake" | "document_planning" | "follow_up_paid", string> = {
  intake: "Intake call",
  document_planning: "Document planning call",
  follow_up_paid: "Follow-up call",
}

const INCLUDED_PLANNING_CALLS = 3

type CalcomWebhookBody = {
  triggerEvent?: string
  payload?: CalcomBookingPayload
}

type CalcomBookingPayload = {
  uid?: string
  bookingId?: number
  title?: string
  startTime?: string
  endTime?: string
  location?: string
  metadata?: Record<string, string>
  responses?: Record<string, unknown>
  attendees?: Array<{ email?: string; name?: string }>
  organizer?: { timeZone?: string }
}

function readString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim()
  return undefined
}

function extractCaseReference(payload: CalcomBookingPayload): string | undefined {
  const metadataRef = payload.metadata?.caseReference ?? payload.metadata?.case_reference
  if (metadataRef) return metadataRef

  const responses = payload.responses ?? {}
  const fromResponses =
    readString(responses.caseReference) ??
    readString(responses.case_reference) ??
    readString(responses["case-reference"]) ??
    readString(responses["Case reference"])

  return fromResponses
}

function extractCaseId(payload: CalcomBookingPayload): string | undefined {
  const metadataId = payload.metadata?.caseId ?? payload.metadata?.case_id
  if (metadataId) return metadataId
  const responses = payload.responses ?? {}
  return readString(responses.caseId) ?? readString(responses.case_id)
}

function inferCallType(payload: CalcomBookingPayload): "intake" | "document_planning" | "follow_up_paid" {
  const metadataType = payload.metadata?.callType ?? payload.metadata?.call_type
  if (metadataType === "document_planning" || metadataType === "follow_up_paid") {
    return metadataType
  }

  const title = (payload.title ?? "").toLowerCase()
  if (title.includes("follow-up") || title.includes("follow up")) return "follow_up_paid"
  if (title.includes("document planning") || title.includes("planning call")) {
    return "document_planning"
  }
  return "intake"
}

function durationMinutes(startIso?: string, endIso?: string): number {
  if (!startIso || !endIso) return 20
  const start = Date.parse(startIso)
  const end = Date.parse(endIso)
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 20
  return Math.max(1, Math.round((end - start) / 60_000))
}

function mapWebhookStatus(triggerEvent?: string): "scheduled" | "cancelled" | "rescheduled" {
  if (triggerEvent === "BOOKING_CANCELLED") return "cancelled"
  if (triggerEvent === "BOOKING_RESCHEDULED") return "rescheduled"
  return "scheduled"
}

export const getEmailContext = internalQuery({
  args: {
    caseId: v.id("cases"),
    appointmentId: v.id("appointments"),
  },
  returns: v.union(
    v.object({
      caseReference: v.string(),
      callTypeLabel: v.string(),
      scheduledAt: v.number(),
      timezone: v.optional(v.string()),
      durationMinutes: v.number(),
      meetLink: v.optional(v.string()),
      attendeeEmail: v.optional(v.string()),
      attendeeName: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get("cases", args.caseId)
    const appointment = await ctx.db.get("appointments", args.appointmentId)
    if (!caseDoc || !appointment || appointment.caseId !== args.caseId) {
      return null
    }

    return {
      caseReference: resolveCaseReference(caseDoc),
      callTypeLabel: CALL_TYPE_LABELS[appointment.callType],
      scheduledAt: appointment.scheduledAt,
      timezone: appointment.timezone,
      durationMinutes: appointment.durationMinutes,
      meetLink: appointment.meetLink,
      attendeeEmail: appointment.attendeeEmail,
      attendeeName: appointment.attendeeName,
    }
  },
})

export const listForCase = internalQuery({
  args: { caseId: v.id("cases") },
  returns: v.array(
    v.object({
      appointmentId: v.id("appointments"),
      callType: appointmentCallTypeValidator,
      scheduledAt: v.number(),
      timezone: v.optional(v.string()),
      durationMinutes: v.number(),
      status: appointmentStatusValidator,
      meetLink: v.optional(v.string()),
      attendeeEmail: v.optional(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("appointments")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .order("desc")
      .collect()

    return rows.map((row) => ({
      appointmentId: row._id,
      callType: row.callType,
      scheduledAt: row.scheduledAt,
      timezone: row.timezone,
      durationMinutes: row.durationMinutes,
      status: row.status,
      meetLink: row.meetLink,
      attendeeEmail: row.attendeeEmail,
    }))
  },
})

export const handleCalcomWebhook = internalMutation({
  args: {
    body: v.any(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const parsed = args.body as CalcomWebhookBody
    const payload = parsed.payload
    if (!payload?.uid) {
      console.warn("Cal.com webhook missing booking uid")
      return null
    }

    const caseReference = extractCaseReference(payload)
    const caseIdRaw = extractCaseId(payload)

    const caseDoc = await findCaseByIdOrReference(ctx, {
      caseId: caseIdRaw as import("./_generated/dataModel").Id<"cases"> | undefined,
      caseReference,
    })

    if (!caseDoc) {
      console.warn("Cal.com webhook: case not found", { caseReference, caseIdRaw })
      return null
    }

    if (!caseDoc.caseReference) {
      await ctx.db.patch("cases", caseDoc._id, {
        caseReference: formatCaseReference(caseDoc._id),
        updatedAt: Date.now(),
      })
    }

    const callType = inferCallType(payload)
    const status = mapWebhookStatus(parsed.triggerEvent)
    const scheduledAt = payload.startTime ? Date.parse(payload.startTime) : Date.now()
    const attendee = payload.attendees?.[0]
    const now = Date.now()

    const existing = await ctx.db
      .query("appointments")
      .withIndex("by_externalEventId", (q) => q.eq("externalEventId", payload.uid!))
      .unique()

    const appointmentFields = {
      caseId: caseDoc._id,
      callType,
      scheduledAt: Number.isNaN(scheduledAt) ? now : scheduledAt,
      timezone: payload.organizer?.timeZone,
      durationMinutes: durationMinutes(payload.startTime, payload.endTime),
      status,
      provider: "cal.com",
      externalEventId: payload.uid!,
      meetLink: readString(payload.location),
      attendeeEmail: attendee?.email,
      attendeeName: attendee?.name,
      updatedAt: now,
    }

    let appointmentId = existing?._id

    if (existing) {
      await ctx.db.patch("appointments", existing._id, appointmentFields)
    } else {
      appointmentId = await ctx.db.insert("appointments", {
        ...appointmentFields,
        createdAt: now,
      })
    }

    if (status === "scheduled" && callType === "document_planning") {
      const used = caseDoc.includedPlanningCallsUsed ?? 0
      await ctx.db.patch("cases", caseDoc._id, {
        includedPlanningCallsUsed: Math.min(INCLUDED_PLANNING_CALLS, used + 1),
        updatedAt: now,
      })
    }

    if (status === "scheduled" && appointmentId) {
      await ctx.scheduler.runAfter(0, internal.emailActions.sendAppointmentBookedEmail, {
        caseId: caseDoc._id,
        appointmentId,
      })
    }

    return null
  },
})
