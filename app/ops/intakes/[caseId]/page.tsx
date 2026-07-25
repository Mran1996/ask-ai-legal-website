"use client"

import { use } from "react"
import Link from "next/link"
import { OpsAccessGate } from "@/components/ops/ops-access-gate"
import { OpsShell } from "@/components/ops/ops-shell"
import { MatterFile } from "@/components/ops/matter-file"
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
          <OpsShell
            breadcrumb={
              <Link href="/ops" className="hover:text-gold hover:underline">
                ← All matters
              </Link>
            }
          >
            <MatterFile opsToken={opsToken} caseId={caseId as Id<"cases">} />
          </OpsShell>
        )}
      </OpsAccessGate>
    </main>
  )
}
