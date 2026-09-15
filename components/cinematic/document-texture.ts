import * as THREE from "three"

/**
 * Draws a court-filing style page (caption block, title, numbered paragraphs,
 * signature line) as unreadable text so the falling sheets look like real documents.
 */
export function makeDocumentTexture(seed = 1): THREE.CanvasTexture {
  const w = 512
  const h = 704
  const c = document.createElement("canvas")
  c.width = w
  c.height = h
  const ctx = c.getContext("2d")!
  let r = seed
  const rand = () => ((r = (r * 9301 + 49297) % 233280) / 233280)

  // paper
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, "#f7f2e6")
  g.addColorStop(1, "#ebe3d0")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  const ink = "rgba(40,38,34,0.85)"
  const faint = "rgba(40,38,34,0.55)"
  const m = 46 // margin

  // caption block (top left) + case number (top right)
  ctx.fillStyle = faint
  for (let i = 0; i < 4; i++) ctx.fillRect(m, 52 + i * 14, 120 + rand() * 80, 5)
  for (let i = 0; i < 3; i++) ctx.fillRect(w - m - 130, 52 + i * 14, 130 - rand() * 30, 5)
  ctx.fillRect(m, 118, w - m * 2, 1.5)

  // court name (centered)
  ctx.fillStyle = ink
  ctx.fillRect(w / 2 - 150, 138, 300, 7)
  ctx.fillRect(w / 2 - 110, 152, 220, 6)

  // title
  ctx.fillRect(w / 2 - 120, 186, 240, 10)

  // numbered paragraphs
  let y = 224
  let para = 1
  while (y < h - 140) {
    const lines = 3 + Math.floor(rand() * 4)
    for (let i = 0; i < lines && y < h - 140; i++) {
      if (i === 0) {
        ctx.fillStyle = ink
        ctx.fillRect(m, y, 10, 6) // paragraph number
        ctx.fillStyle = faint
        ctx.fillRect(m + 22, y, w - m * 2 - 22 - rand() * 40, 5.5)
      } else {
        ctx.fillStyle = faint
        const last = i === lines - 1
        ctx.fillRect(m, y, last ? 120 + rand() * 200 : w - m * 2 - rand() * 12, 5.5)
      }
      y += 13
    }
    y += 10
    para++
  }

  // signature line + date
  ctx.fillStyle = ink
  ctx.fillRect(w - m - 190, h - 92, 190, 1.5)
  ctx.fillStyle = faint
  ctx.fillRect(w - m - 190, h - 82, 110, 5)
  ctx.fillRect(m, h - 82, 90, 5)

  // page number
  ctx.fillRect(w / 2 - 6, h - 40, 12, 5)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}
