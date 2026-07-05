import {
  BookMarked,
  ClipboardCheck,
  FileText,
  FolderSearch,
  LineChart,
  Map,
  PenLine,
  Search,
  Send,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

/** Icons aligned with services.items order (9 services). */
export const SERVICE_ICONS: LucideIcon[] = [
  Search,
  Map,
  FolderSearch,
  BookMarked,
  LineChart,
  ClipboardCheck,
  PenLine,
  FileText,
  Send,
]

export function serviceSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}
