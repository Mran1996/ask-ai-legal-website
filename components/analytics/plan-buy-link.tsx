"use client"

import type { ComponentProps } from "react"
import { trackBeginCheckout } from "@/lib/analytics"

/** A Buy link to Stripe that records the click in Google Analytics first. */
export function PlanBuyLink({ plan, value, ...props }: { plan: string; value: number } & ComponentProps<"a">) {
  return <a {...props} onClick={() => trackBeginCheckout(plan, value)} />
}
