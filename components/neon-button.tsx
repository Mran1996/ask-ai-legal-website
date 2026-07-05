import Link from "next/link"
import type { ComponentPropsWithoutRef } from "react"

type NeonButtonProps = {
  href: string
  children: React.ReactNode
  className?: string
  size?: "sm" | "md"
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">

export function NeonButton({
  href,
  children,
  className = "",
  size = "md",
  ...props
}: NeonButtonProps) {
  return (
    <Link
      href={href}
      className={`btn-neon inline-flex flex-row items-center justify-center gap-2 ${size === "sm" ? "btn-neon-sm" : ""} ${className}`}
      {...props}
    >
      {children}
    </Link>
  )
}
