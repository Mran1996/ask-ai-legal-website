import { NextResponse } from "next/server"
import { RETELL_AGENT_ID } from "@/lib/site-config"

/**
 * Starts a browser voice call with the Ask AI Legal voice agent.
 * The Retell API key never leaves the server. The agent is fixed here,
 * so this route cannot be used to call any other agent or endpoint.
 */

const WINDOW_MS = 10 * 60 * 1000
const MAX_CALLS_PER_WINDOW = 5
const recent = new Map<string, number[]>()

function tooMany(ip: string): boolean {
  const now = Date.now()
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  hits.push(now)
  recent.set(ip, hits)
  if (recent.size > 5000) recent.clear()
  return hits.length > MAX_CALLS_PER_WINDOW
}

export async function POST(req: Request) {
  const key = process.env.RETELL_API_KEY?.trim()
  if (!key) {
    return NextResponse.json({ error: "Voice calls are not set up yet." }, { status: 503 })
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  if (tooMany(ip)) {
    return NextResponse.json({ error: "Too many calls. Please try again in a few minutes." }, { status: 429 })
  }

  const upstream = await fetch("https://api.retellai.com/v3/create-web-call", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      "X-Retell-Client-JS-SDK-Version": req.headers.get("x-retell-client-js-sdk-version") ?? "",
    },
    body: JSON.stringify({ agent_id: RETELL_AGENT_ID, agent_version: "latest_published" }),
    cache: "no-store",
  })

  const headers = new Headers({ "Content-Type": "application/json", "Cache-Control": "no-store" })
  for (const h of ["x-retell-client-js-sdk-min-version", "x-retell-client-js-sdk-recommended-version"]) {
    const v = upstream.headers.get(h)
    if (v) headers.set(h, v)
  }
  return new Response(await upstream.text(), { status: upstream.status, headers })
}
