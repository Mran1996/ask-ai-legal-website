"use client"

type Props = {
  src: string
  title?: string
}

export function CalcomEmbed({ src, title = "Book a call" }: Props) {
  return (
    <iframe
      src={src}
      title={title}
      className="h-[min(720px,75vh)] w-full rounded-md border border-white/15 bg-navy"
      allow="payment"
    />
  )
}
