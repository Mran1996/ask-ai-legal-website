"use client"

import { OpsAccessGate } from "@/components/ops/ops-access-gate"
import { IntakesList } from "@/components/ops/intakes-list"

export default function OpsIntakesPage() {
  return (
    <main className="min-h-screen bg-cream">
      <OpsAccessGate>{(opsToken) => <IntakesList opsToken={opsToken} />}</OpsAccessGate>
    </main>
  )
}
