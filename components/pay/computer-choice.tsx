"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useAction } from "convex/react"
import { Apple, Monitor, Check } from "lucide-react"
import { api } from "@/convex/_generated/api"
import { REFERRAL_HREF, SUPPORT_EMAIL } from "@/lib/site-config"

type Computer = "Windows" | "Mac"

/** Right after paying: the buyer picks Windows or Mac and gives the email they paid with, so we send the right
 *  download. It goes to support through the same message system as the contact form. */
export function ComputerChoice({ plan }: { plan: string }) {
  const send = useAction(api.contactActions.sendContactMessage)
  const [computer, setComputer] = useState<Computer | null>(null)
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState("")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!computer || status === "sending") return
    const data = new FormData(event.currentTarget)
    const referredBy = String(data.get("referredBy") ?? "").trim()
    setStatus("sending")
    setError("")
    try {
      const result = await send({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        subject: `New purchase: ${plan} for ${computer}`,
        message: `New Ask AI Legal purchase.\nPlan: ${plan}\nComputer: ${computer}\nReferred by: ${referredBy || "No one named"}\nPlease send the ${computer} download, the walkthrough video, and setup steps.`,
        company: String(data.get("company") ?? ""),
      })
      if (!result.ok) throw new Error(result.error || "Something went wrong.")
      setStatus("sent")
    } catch (e) {
      setStatus("idle")
      setError(e instanceof Error ? e.message : `Something went wrong. Email ${SUPPORT_EMAIL} instead.`)
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-sm border border-gold/40 bg-gold/10 px-5 py-5 text-left">
        <p className="flex items-center gap-2 text-sm font-semibold text-white">
          <Check className="h-4 w-4 text-gold" aria-hidden /> Got it: {computer}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          We will email your {computer} download and setup steps to the address you gave, usually within one business day.
        </p>
      </div>
    )
  }

  const choice = (c: Computer, Icon: typeof Monitor) => (
    <button
      type="button"
      onClick={() => setComputer(c)}
      aria-pressed={computer === c}
      className={`flex flex-1 items-center justify-center gap-2 rounded-sm border px-4 py-4 text-sm font-semibold transition ${
        computer === c ? "border-gold bg-gold/15 text-white" : "border-white/15 bg-white/5 text-white/80 hover:border-white/30"
      }`}
    >
      <Icon className="h-5 w-5" aria-hidden /> {c}
    </button>
  )

  return (
    <form onSubmit={submit} className="rounded-sm border border-white/10 bg-white/5 px-5 py-5 text-left">
      <p className="text-sm font-semibold text-white">Which computer do you use?</p>
      <div className="mt-3 flex gap-3">
        {choice("Windows", Monitor)}
        {choice("Mac", Apple)}
      </div>
      <label className="mt-4 block text-xs text-white/60">
        Your name
        <input name="name" required maxLength={120} className="mt-1 w-full rounded-sm border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white" />
      </label>
      <label className="mt-3 block text-xs text-white/60">
        The email you paid with
        <input name="email" type="email" required maxLength={200} className="mt-1 w-full rounded-sm border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white" />
      </label>
      <label className="mt-3 block text-xs text-white/60">
        Who referred you? (optional)
        <input name="referredBy" maxLength={200} placeholder="Their name and email" className="mt-1 w-full rounded-sm border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/35" />
        <span className="mt-1 block">
          You each get a reward.{" "}
          <Link href={REFERRAL_HREF} target="_blank" className="underline underline-offset-2 hover:text-white">
            See how it works
          </Link>
        </span>
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
      <button
        type="submit"
        disabled={!computer || status === "sending"}
        className="btn-gold mt-4 inline-flex min-h-[46px] w-full items-center justify-center disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : computer ? `Send my ${computer} download` : "Choose Windows or Mac"}
      </button>
    </form>
  )
}
