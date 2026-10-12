import { ArrowRight } from "lucide-react"
import { NeonButton } from "@/components/neon-button"
import { CONSULT_HREF } from "@/lib/site-config"

export function SituationCta({ label }: { label: string }) {
  return (
    <NeonButton href={CONSULT_HREF}>
      {label}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </NeonButton>
  )
}
