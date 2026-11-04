import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return <div data-clarity-mask="True">{children}</div>
}
