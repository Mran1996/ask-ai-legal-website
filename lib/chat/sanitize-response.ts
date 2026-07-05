function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_\n]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
}

function normalizeListItem(raw: string): string {
  let item = raw.replace(/^[-*•]\s+/, "").replace(/^\d+[.)]\s+/, "")
  item = stripInlineMarkdown(item.trim())

  const labelMatch = item.match(/^([^:]+):\s*(.+)$/)
  if (labelMatch && labelMatch[1].length <= 48) {
    return `${labelMatch[1].trim()} — ${labelMatch[2].trim()}`
  }

  return item
}

function listItemsToProse(items: string[]): string {
  if (items.length === 0) return ""
  if (items.length === 1) return items[0] ?? ""

  return items
    .map((item, index) => {
      if (index < items.length - 1 && !/[.!?]$/.test(item)) {
        return `${item}.`
      }
      return item
    })
    .join(" ")
}

/** Plain-text cleanup for chat bubbles (no markdown rendering in UI). */
export function stripMarkdownForChat(text: string): string {
  const lines = text.split("\n")
  const output: string[] = []
  let bulletBuffer: string[] = []

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return
    output.push(listItemsToProse(bulletBuffer.map(normalizeListItem)))
    bulletBuffer = []
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      flushBullets()
      continue
    }

    if (/^[-*•]\s+/.test(trimmed) || /^\d+[.)]\s+/.test(trimmed)) {
      bulletBuffer.push(trimmed)
      continue
    }

    flushBullets()
    output.push(stripInlineMarkdown(trimmed))
  }

  flushBullets()

  return output
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}
