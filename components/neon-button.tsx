import Link from "next/link"
import type { ComponentPropsWithoutRef } from "react"

type NeonButtonBaseProps = {
  children: React.ReactNode
  className?: string
  size?: "sm" | "md"
}

type NeonButtonLinkProps = NeonButtonBaseProps & { href: string; onClick?: undefined } & Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href" | "className" | "children" | "onClick"
>

type NeonButtonButtonProps = NeonButtonBaseProps & { href?: undefined; onClick: () => void }

type NeonButtonProps = NeonButtonLinkProps | NeonButtonButtonProps

/** Renders a Link when `href` is given, or a button when `onClick` is given — same neon styling either way. */
export function NeonButton({ children, className = "", size = "md", ...props }: NeonButtonProps) {
  const classes = `btn-neon inline-flex flex-row items-center justify-center gap-2 ${size === "sm" ? "btn-neon-sm" : ""} ${className}`

  if (props.href !== undefined) {
    const { href, onClick: _onClick, ...rest } = props
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" onClick={props.onClick} className={classes}>
      {children}
    </button>
  )
}
