"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useAction } from "convex/react"
import { Check, Loader2, Send } from "lucide-react"
import { api } from "@/convex/_generated/api"
import { pixelTrack } from "@/lib/meta-pixel"
import { SUPPORT_EMAIL } from "@/lib/site-config"

type Status = "idle" | "sending" | "success" | "error"

const INQUIRY_TYPES = {
  consultation: {
    label: "Question before you buy",
    placeholder:
      "What would you like to know? Please don't include confidential case details.",
    button: "Send question",
  },
  chatgpt: {
    label: "Help with ChatGPT or Claude",
    placeholder:
      "Type your question about ChatGPT or Claude. Please don't include confidential case details.",
    button: "Send request",
  },
  support: {
    label: "Technical support",
    placeholder: "Describe what's happening with your installation.",
    button: "Send message",
  },
  billing: {
    label: "Billing",
    placeholder: "Tell us about your billing question.",
    button: "Send message",
  },
  other: {
    label: "Something else",
    placeholder: "How can we help?",
    button: "Send message",
  },
} as const

type InquiryType = keyof typeof INQUIRY_TYPES

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#f3ead8] placeholder:text-[#a9b3c1]/50 focus:border-[#e8c98a]/60 focus:outline-none focus:ring-2 focus:ring-[#e8c98a]/20"

export function ContactForm() {
  const sendContactMessage = useAction(api.contactActions.sendContactMessage)
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)
  const [inquiry, setInquiry] = useState<InquiryType>("consultation")
  const [sentInquiry, setSentInquiry] = useState<InquiryType>("consultation")
  const type = INQUIRY_TYPES[inquiry]

  // Links like /contact?topic=chatgpt open the form with that choice already picked.
  useEffect(() => {
    const topic = new URLSearchParams(window.location.search).get("topic")
    if (topic && topic in INQUIRY_TYPES) {
      setInquiry(topic as InquiryType)
      // On phones the form sits below the contact details, so bring it into view.
      document.getElementById("contact-form")?.scrollIntoView({ block: "start" })
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "sending") return

    const form = event.currentTarget
    const data = new FormData(form)
    const subject = String(data.get("subject") ?? "").trim()

    setStatus("sending")
    setError(null)

    try {
      const result = await sendContactMessage({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        // The inquiry type leads the subject so the inbox can sort requests at a glance.
        subject: subject ? `${type.label}: ${subject}` : type.label,
        message: String(data.get("message") ?? ""),
        company: String(data.get("company") ?? ""),
      })

      if (result.ok) {
        pixelTrack("Lead", { content_category: `contact_${inquiry}` })
        setSentInquiry(inquiry)
        setStatus("success")
        form.reset()
        setInquiry("consultation")
      } else {
        setStatus("error")
        setError(result.error ?? "Something went wrong. Please try again.")
      }
    } catch {
      setStatus("error")
      setError(`Could not send your message. Please email ${SUPPORT_EMAIL} directly.`)
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-2xl border border-[#e8c98a]/35 bg-white/[0.04] p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e8c98a]/15">
          <Check className="h-6 w-6 text-[#e8c98a]" aria-hidden />
        </div>
        <h3 className="mt-4 font-[family-name:var(--font-serif)] text-2xl text-[#f3ead8]">
          {"Message sent"}
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#a9b3c1]">
          {sentInquiry === "chatgpt" ? "Thanks for reaching out. We'll answer by email, usually right back." : "Thanks for reaching out. We'll reply to your email."}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-[#e8c98a] underline-offset-2 hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form id="contact-form" onSubmit={handleSubmit} className="scroll-mt-24 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8">
      {/* Honeypot — hidden from users, no layout/overflow impact on mobile. */}
      <div className="hidden" aria-hidden>
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mb-5">
        <label htmlFor="contact-inquiry" className="mb-1.5 block text-xs font-semibold text-[#f3ead8]">
          What can we help with?
        </label>
        <select
          id="contact-inquiry"
          name="inquiry"
          value={inquiry}
          onChange={(e) => setInquiry(e.target.value as InquiryType)}
          className={`${inputClass} [&>option]:bg-[#0c1929] [&>option]:text-[#faf9f6]`}
        >
          {(Object.keys(INQUIRY_TYPES) as InquiryType[]).map((key) => (
            <option key={key} value={key}>
              {INQUIRY_TYPES[key].label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold text-[#f3ead8]">
            Name <span className="text-[#e8c98a]">*</span>
          </label>
          <input id="contact-name" name="name" type="text" required maxLength={120} autoComplete="name" className={inputClass} placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold text-[#f3ead8]">
            Email <span className="text-[#e8c98a]">*</span>
          </label>
          <input id="contact-email" name="email" type="email" required maxLength={200} autoComplete="email" className={inputClass} placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-xs font-semibold text-[#f3ead8]">
            Phone <span className="font-normal text-[#a9b3c1]/70">(optional)</span>
          </label>
          <input id="contact-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={inputClass} placeholder="(555) 555-5555" />
        </div>
        <div>
          <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-semibold text-[#f3ead8]">
            Subject <span className="font-normal text-[#a9b3c1]/70">(optional)</span>
          </label>
          <input id="contact-subject" name="subject" type="text" maxLength={120} className={inputClass} placeholder="Optional" />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold text-[#f3ead8]">
          {"How can we help?"}{" "}
          <span className="text-[#e8c98a]">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={5000}
          rows={inquiry === "consultation" ? 4 : 6}
          className={`${inputClass} resize-y`}
          placeholder={type.placeholder}
        />
      </div>

      {status === "error" && error && (
        <p role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f3ead8] px-6 py-3.5 text-sm font-semibold text-[#0b131d] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8c98a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            <span>Sending…</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden />
            <span>{type.button}</span>
          </>
        )}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-[#a9b3c1]/80">
        By sending this message you agree we may contact you about your request. You don&apos;t need to share case
        documents to ask a question. This form is not legal advice.
      </p>
    </form>
  )
}
