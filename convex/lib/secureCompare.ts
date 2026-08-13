/**
 * Constant-time string comparison to reduce timing side channels on secrets.
 * Does not short-circuit on length mismatch.
 */
export function secureCompare(a: string, b: string): boolean {
  const maxLen = Math.max(a.length, b.length)
  let diff = a.length ^ b.length
  for (let i = 0; i < maxLen; i++) {
    const ca = i < a.length ? a.charCodeAt(i) : 0
    const cb = i < b.length ? b.charCodeAt(i) : 0
    diff |= ca ^ cb
  }
  return diff === 0
}
