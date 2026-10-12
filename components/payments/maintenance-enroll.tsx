"use client"

import { useId, useState } from "react"
import { StripeBuyButton } from "./stripe-buy-button"

/** Maintenance checkout stays hidden until the customer explicitly opts in. Never preselected. */
export function MaintenanceEnroll({ buyButtonId }: { buyButtonId: string }) {
  const [agreed, setAgreed] = useState(false)
  const id = useId()

  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-white/80">
        <input
          id={id}
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-gold"
        />
        <span>
          I have received the maintenance terms and choose to enroll in optional maintenance at $125.00 USD per month,
          billed monthly. This is separate from the one-time purchase.
        </span>
      </label>
      {agreed && (
        <div className="mt-6 flex justify-center">
          <StripeBuyButton buyButtonId={buyButtonId} />
        </div>
      )}
    </div>
  )
}
