"use client"

import { ArrowRight } from "lucide-react"
import { NeonButton } from "@/components/neon-button"
import { openChatWidget } from "@/lib/chat/open-chat"

export function SituationCta({ label }: { label: string }) {
  return (
    <NeonButton onClick={() => openChatWidget("quote")}>
      {label}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </NeonButton>
  )
}
