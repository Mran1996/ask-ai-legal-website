/** Simple per-visitor limits for POST /api/chat so one person or bot cannot burn the model quota.
 *  Counts live in memory on each server instance, which is enough to stop a single abuser. */
const PER_10_MIN = 15
const PER_DAY = 60
const ALL_VISITORS_PER_DAY = 2000

const TEN_MIN = 10 * 60 * 1000
const DAY = 24 * 60 * 60 * 1000

const hits = new Map<string, number[]>()
let dayStart = Date.now()
let dayTotal = 0

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
}

/** Records one chat message; returns false when this visitor (or the whole site) is over the limit. */
export function allowChatRequest(ip: string, now = Date.now()): boolean {
  if (now - dayStart > DAY) {
    dayStart = now
    dayTotal = 0
    hits.clear()
  }
  if (dayTotal >= ALL_VISITORS_PER_DAY) return false

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < DAY)
  const lastTen = recent.filter((t) => now - t < TEN_MIN).length
  if (recent.length >= PER_DAY || lastTen >= PER_10_MIN) {
    hits.set(ip, recent)
    return false
  }

  recent.push(now)
  hits.set(ip, recent)
  dayTotal++
  return true
}
