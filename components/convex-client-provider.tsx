"use client"

import { ConvexProvider, ConvexReactClient } from "convex/react"
import { type ReactNode, useMemo } from "react"

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    // Falls back to the documented local Convex dev address so components can
    // always call useMutation/useQuery under a real ConvexProvider, even when
    // NEXT_PUBLIC_CONVEX_URL isn't configured yet (see .env.example).
    const url = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210"
    return new ConvexReactClient(url)
  }, [])

  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
