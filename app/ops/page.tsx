"use client"

import { OpsAccessGate } from "@/components/ops/ops-access-gate"
import { PipelineBoard } from "@/components/ops/pipeline-board"

export default function OpsPipelinePage() {
  return (
    <main className="min-h-screen bg-cream">
      <OpsAccessGate>{(opsToken) => <PipelineBoard opsToken={opsToken} />}</OpsAccessGate>
    </main>
  )
}
