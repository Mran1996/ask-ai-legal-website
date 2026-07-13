import type { Metadata } from "next"
import { BookPageClient } from "@/components/booking/book-page-client"
import { BOOKING_DISCLAIMER } from "@/lib/booking"

export const metadata: Metadata = {
  title: "Book a call | Ask AI Legal",
  description: BOOKING_DISCLAIMER,
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ""
  return value ?? ""
}

export default async function BookPage({ searchParams }: PageProps) {
  const params = await searchParams

  return (
    <BookPageClient
      callType={first(params.type) || "intake"}
      caseId={first(params.caseId)}
      caseReference={first(params.ref)}
      email={first(params.email)}
      name={first(params.name)}
    />
  )
}
