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
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-2xl text-navy">Ops access</h1>
      <p className="mt-2 text-sm text-gray-600">
        Enter your ops access token to view intake submissions. Set{" "}
        <code className="rounded bg-gray-100 px-1 text-xs">OPS_ACCESS_TOKEN</code> in Convex
        environment variables.
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
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Access token
          </span>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm"
            autoComplete="current-password"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-sm bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-light"
        >
          Continue
        </button>
      </form>
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
      className="text-sm text-gray-500 underline-offset-2 hover:text-navy hover:underline"
    >
      Sign out
    </button>
  )
}
