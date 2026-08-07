"use client"

import { useState } from "react"
import { clearOpsToken, getOpsToken, setOpsToken } from "@/lib/ops/session"

type Props = {
  children: (opsToken: string) => React.ReactNode
}

export function OpsAccessGate({ children }: Props) {
  const [token, setToken] = useState<string | null>(() => getOpsToken())
  const [input, setInput] = useState("")
  const [error, setError] = useState("")

  if (token) {
    return <>{children(token)}</>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-16">
      <div className="w-full max-w-md border border-navy/10 bg-white p-8 shadow-[0_1px_0_rgba(12,25,41,0.04)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-dark">
          Ask AI Legal
        </p>
        <h1 className="mt-2 font-display text-3xl text-navy">Operations</h1>
        <div className="mt-3 h-px w-12 bg-gold" />
        <p className="mt-4 text-sm leading-relaxed text-navy/65">
          Enter your ops access token. Set{" "}
          <code className="rounded-sm bg-cream px-1 text-xs text-navy">OPS_ACCESS_TOKEN</code> in
          Convex environment variables.
        </p>
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (input.trim().length < 8) {
              setError("Token must be at least 8 characters.")
              return
            }
            setError("")
            setOpsToken(input)
            setToken(input.trim())
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-navy/45">
              Access token
            </span>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border border-navy/15 bg-cream/50 px-3 py-2.5 text-sm text-navy focus:border-gold focus:outline-none"
              autoComplete="current-password"
            />
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            className="w-full bg-navy px-4 py-2.5 text-sm font-semibold text-cream hover:bg-navy-light"
          >
            Enter dashboard
          </button>
        </form>
      </div>
    </div>
  )
}

export function OpsSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => {
        clearOpsToken()
        window.location.reload()
      }}
      className="text-xs font-semibold uppercase tracking-wider text-cream/55 underline-offset-2 hover:text-gold hover:underline"
    >
      Sign out
    </button>
  )
}
