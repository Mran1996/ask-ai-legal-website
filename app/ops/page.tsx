"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { OpsAccessGate } from "@/components/ops/ops-access-gate"
import { OpsShell } from "@/components/ops/ops-shell"
import { MattersPanel } from "@/components/ops/matters-panel"
import { InsightsPanel } from "@/components/ops/insights-panel"

function OpsDashboard() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") === "insights" ? "insights" : "matters"

  return (
    <OpsAccessGate>
      {(opsToken) => (
        <OpsShell activeTab={tab}>
          {tab === "insights" ? (
            <InsightsPanel opsToken={opsToken} />
          ) : (
            <MattersPanel opsToken={opsToken} />
          )}
        </OpsShell>
      )}
    </OpsAccessGate>
  )
}

export default function OpsPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Suspense fallback={null}>
        <OpsDashboard />
      </Suspense>
    </main>
  )
}
