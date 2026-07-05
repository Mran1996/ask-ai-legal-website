"use client"

import { use } from "react"
import { OpsAccessGate } from "@/components/ops/ops-access-gate"
import { CaseDetailView } from "@/components/ops/case-detail"
import type { Id } from "@/convex/_generated/dataModel"

type PageProps = {
  params: Promise<{ caseId: string }>
}

export default function OpsCaseDetailPage({ params }: PageProps) {
  const { caseId } = use(params)

  return (
    <main className="min-h-screen bg-cream">
      <OpsAccessGate>
        {(opsToken) => (
          <CaseDetailView opsToken={opsToken} caseId={caseId as Id<"cases">} />
        )}
      </OpsAccessGate>
    </main>
  )
}
