export function assertOpsToken(provided: string): void {
  const expected = process.env.OPS_ACCESS_TOKEN
  if (!expected || expected.length < 8) {
    throw new Error("Ops access is not configured (set OPS_ACCESS_TOKEN in Convex env)")
  }
  if (provided !== expected) {
    throw new Error("Unauthorized")
  }
}
