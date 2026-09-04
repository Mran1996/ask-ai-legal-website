"use client"

import { useState, type FormEvent } from "react"
import { useAction } from "convex/react"
import { Check, Loader2, Send } from "lucide-react"
import { api } from "@/convex/_generated/api"
import { pixelTrack } from "@/lib/meta-pixel"
import { SUPPORT_EMAIL } from "@/lib/site-config"

type Status = "idle" | "sending" | "success" | "error"

const inputClass =
  "w-full rounded-sm border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"

export function ContactForm() {
  const sendContactMessage = useAction(api.contactActions.sendContactMessage)
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "sending") return

    const form = event.currentTarget
    const data = new FormData(form)

    setStatus("sending")
    setError(null)

    try {
      const result = await sendContactMessage({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        subject: String(data.get("subject") ?? ""),
        message: String(data.get("message") ?? ""),
        company: String(data.get("company") ?? ""),
      })

      if (result.ok) {
        pixelTrack("Lead", { content_category: "contact_form" })
        setStatus("success")
        form.reset()
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
      <div className="rounded-md border-2 border-gold/40 bg-white p-8 text-center shadow-[0_0_24px_rgba(251,176,52,0.12)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15">
          <Check className="h-6 w-6 text-gold-dark" aria-hidden />
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold text-navy">Message sent</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-600">
          Thanks for reaching out. Our support team will reply to your email as soon as
          possible, typically within one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-gold-dark underline-offset-2 hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border-2 border-navy/10 bg-white p-6 sm:p-8">
      {/* Honeypot — hidden from users, no layout/overflow impact on mobile. */}
      <div className="hidden" aria-hidden>
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold text-navy">
            Name <span className="text-gold-dark">*</span>
          </label>
          <input id="contact-name" name="name" type="text" required maxLength={120} autoComplete="name" className={inputClass} placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold text-navy">
            Email <span className="text-gold-dark">*</span>
          </label>
          <input id="contact-email" name="email" type="email" required maxLength={200} autoComplete="email" className={inputClass} placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-xs font-semibold text-navy">
            Phone <span className="font-normal text-navy/40">(optional)</span>
          </label>
          <input id="contact-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={inputClass} placeholder="(555) 555-5555" />
        </div>
        <div>
          <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-semibold text-navy">
            Subject <span className="font-normal text-navy/40">(optional)</span>
          </label>
          <input id="contact-subject" name="subject" type="text" maxLength={150} className={inputClass} placeholder="What's this about?" />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold text-navy">
          How can we help? <span className="text-gold-dark">*</span>
        </label>
        <textarea id="contact-message" name="message" required maxLength={5000} rows={6} className={`${inputClass} resize-y`} placeholder="Describe your concern or issue and we'll get back to you." />
      </div>

      {status === "error" && error && (
        <p className="mt-4 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-dark px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            <span>Sending…</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden />
            <span>Send message</span>
          </>
        )}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-gray-500">
        By sending this message you agree we may contact you about your request. This form is for
        general questions and support — it is not legal advice.
      </p>
    </form>
  )
}
