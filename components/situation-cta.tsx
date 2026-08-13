import { ArrowRight } from "lucide-react"
import { NeonButton } from "@/components/neon-button"

export function SituationCta({ label }: { label: string }) {
  return (
    <NeonButton href="/pay">
      {label}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </NeonButton>
  )
}
