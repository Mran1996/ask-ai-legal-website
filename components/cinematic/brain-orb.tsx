"use client"

import { useEffect, useRef } from "react"

/** A live copy of the app's Second Brain orb (static/brainmap.js, "3D orb" layout), drawn on a canvas.
 *  The dots are turning on a sphere, routines circle it, and connected tools ride the outer ring.
 *  Only group labels and counts are shown. No file names, case names or people, ever. */

type Node = { ring: "memory" | "skill" | "routine" | "app"; group?: string; color?: string; size: number; label?: string
  x: number; y: number; p: number; z: number }

// Counts and colors match the real map shown on the site (Court papers, Cited cases, Writing lessons).
const GROUPS = [
  { label: "Cited cases", count: 600, color: "#C4B5FD" },
  { label: "Court papers", count: 405, color: "#2F8FEA" },
  { label: "Writing lessons", count: 193, color: "#E2E8F0" },
]
const APPS = ["OP", "PC", "GE", "PE", "CS", "GR", "KI", "CO"]
const RING = { skill: "#22C9D6", memory: "#2F8FEA", routine: "#F5B94D", app: "#8B9CF6" }
const SPIN = 0.35 // same default speed as the app

function rand(seed: number) { const x = Math.sin(seed * 12.9898) * 43758.5453; return x - Math.floor(x) }

function buildNodes() {
  const nodes: Node[] = []
  let i = 0
  GROUPS.forEach((g) => { for (let k = 0; k < g.count; k++) nodes.push({ ring: "memory", group: g.label, color: g.color, size: 0.4 + rand(++i) * (rand(i + 7) > 0.93 ? 2.2 : 0.9), x: 0, y: 0, p: 1, z: 0 }) })
  for (let k = 0; k < 14; k++) nodes.push({ ring: "skill", size: 1, x: 0, y: 0, p: 1, z: 0 })
  for (let k = 0; k < 4; k++) nodes.push({ ring: "routine", size: 1, x: 0, y: 0, p: 1, z: 0 })
  APPS.forEach((label) => nodes.push({ ring: "app", label, size: 1, x: 0, y: 0, p: 1, z: 0 }))
  return nodes
}

export function BrainOrb({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext("2d")
    if (!ctx) return
    const nodes = buildNodes()
    const byRing = (r: Node["ring"]) => nodes.filter((n) => n.ring === r)
    const skills = byRing("skill"), routines = byRing("routine"), apps = byRing("app")
    const total = GROUPS.reduce((a, g) => a + g.count, 0)
    const groupNodes = GROUPS.map((g) => nodes.filter((n) => n.group === g.label))
    const hubs = GROUPS.map((g) => ({ ...g, x: 0, y: 0, z: 0, p: 1 }))
    const mark = new Image()
    mark.src = "/brand/mark.svg"
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches

    const place = (t: number) => {
      const R = 280, tilt = -0.32, yaw = t * SPIN * 0.22, camD = 1100
      const project = (x: number, y: number, z: number, n: { x: number; y: number; p: number; z: number }, div: number) => {
        const x1 = x * Math.cos(yaw) + z * Math.sin(yaw), z1 = -x * Math.sin(yaw) + z * Math.cos(yaw)
        const y2 = y * Math.cos(tilt) - z1 * Math.sin(tilt), z2 = y * Math.sin(tilt) + z1 * Math.cos(tilt)
        const p = camD / (camD - z2); n.x = x1 * p; n.y = y2 * p; n.p = p; n.z = z2 / div
      }
      let lon = 0
      GROUPS.forEach((g, gi) => {
        const span = (g.count / total) * Math.PI * 2, list = groupNodes[gi]
        list.forEach((n, k) => { const y = 1 - (2 * (k + 0.5)) / list.length, r = Math.sqrt(1 - y * y), a = lon + ((k * 0.618034) % 1) * span * 0.94
          project(Math.cos(a) * r * R, y * R, Math.sin(a) * r * R, n, R) })
        const mid = lon + span / 2
        project(Math.cos(mid) * R * 1.12, 0, Math.sin(mid) * R * 1.12, hubs[gi], R)
        lon += span
      })
      skills.forEach((n, i) => { const y = 1 - (2 * (i + 0.5)) / skills.length, r = Math.sqrt(1 - y * y), a = i * 2.39996
        project(Math.cos(a) * r * 70, y * 70, Math.sin(a) * r * 70, n, 70) })
      routines.forEach((n, i) => { const a = (i / routines.length) * Math.PI * 2 - t * SPIN * 0.08; project(Math.cos(a) * 360, 0, Math.sin(a) * 360, n, 360) })
      apps.forEach((n, i) => { const a = (i / apps.length) * Math.PI * 2 - Math.PI / 2 + t * SPIN * 0.03; n.x = Math.cos(a) * 440; n.y = Math.sin(a) * 440; n.p = 1; n.z = 1 })
    }

    const spaced = (text: string, x: number, y: number, sp: number) => {
      const w = ctx.measureText(text).width + sp * (text.length - 1); let cx = x - w / 2; ctx.textAlign = "left"
      for (const ch of text) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + sp }
      ctx.textAlign = "center"
    }
    const star = (x: number, y: number, r: number) => { ctx.fillStyle = RING.skill; ctx.beginPath()
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.32 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) }
      ctx.closePath(); ctx.fill() }
    const hex = (x: number, y: number, r: number) => { ctx.beginPath()
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 - Math.PI / 2; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) }
      ctx.closePath() }

    const draw = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1), W = cv.clientWidth, H = cv.clientHeight
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr) }
      const s = Math.min(W, H) / 960, small = W < 420
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H)
      ctx.setTransform(dpr * s, 0, 0, dpr * s, (dpr * W) / 2, (dpr * H) / 2)
      const g = ctx.createRadialGradient(0, 0, 40, 0, 0, 330); g.addColorStop(0, "rgba(34,201,214,0.22)"); g.addColorStop(0.55, "rgba(47,143,234,0.08)"); g.addColorStop(1, "rgba(47,143,234,0)")
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 340, 0, Math.PI * 2); ctx.fill()
      ctx.lineWidth = 1 / s; ctx.strokeStyle = "rgba(245,185,77,0.22)"; ctx.beginPath(); ctx.ellipse(0, 0, 360, 360 * Math.sin(0.32), 0, 0, Math.PI * 2); ctx.stroke()
      ctx.strokeStyle = "rgba(139,156,246,0.25)"; ctx.beginPath(); ctx.arc(0, 0, 440, 0, Math.PI * 2); ctx.stroke()
      ctx.font = "700 17px Inter, system-ui, sans-serif"
      ctx.fillStyle = RING.app; spaced("APPLICATIONS", 0, -470, 3)
      ctx.fillStyle = RING.memory; spaced("MEMORY", 0, -300, 3)

      const sorted = [...nodes].sort((p, q) => p.z - q.z)
      for (const n of sorted) {
        const depth = 0.22 + 0.78 * (n.z + 1) / 2
        ctx.globalAlpha = n.ring === "app" ? 1 : depth
        if (n.ring === "memory") {
          ctx.fillStyle = n.color!
          if (!small && depth > 0.93) { ctx.shadowColor = n.color!; ctx.shadowBlur = 6 }
          ctx.beginPath(); ctx.arc(n.x, n.y, (2.6 + 1.6 * n.size) * n.p, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0
        } else if (n.ring === "skill") star(n.x, n.y, 7 * n.p)
        else if (n.ring === "routine") {
          ctx.strokeStyle = "rgba(245,185,77,0.85)"; ctx.lineWidth = 1.4 / s; ctx.beginPath(); ctx.arc(n.x, n.y, 12 * n.p, 0, Math.PI * 2); ctx.stroke()
          ctx.fillStyle = RING.routine; ctx.beginPath(); ctx.arc(n.x, n.y, 5 * n.p, 0, Math.PI * 2); ctx.fill()
        } else {
          hex(n.x, n.y, 24); ctx.fillStyle = "#0B1A33"; ctx.fill(); ctx.strokeStyle = "rgba(139,156,246,0.75)"; ctx.lineWidth = 1.3 / s; ctx.stroke()
          ctx.fillStyle = "#EAF1FF"; ctx.font = "700 13px Inter, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(n.label!, n.x, n.y + 0.5); ctx.textBaseline = "alphabetic"
        }
      }
      ctx.globalAlpha = 1
      for (const h of hubs) {
        if (h.z < 0) continue
        ctx.fillStyle = h.color; ctx.shadowColor = h.color; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(h.x, h.y, 16, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0
        ctx.fillStyle = "#07111F"; ctx.font = "800 12px Inter, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(h.count), h.x, h.y + 0.5); ctx.textBaseline = "alphabetic"
        ctx.fillStyle = "#EEF2FF"; ctx.font = "700 15px Inter, system-ui, sans-serif"; spaced(h.label.toUpperCase(), h.x, h.y + 34, 1.4)
      }
      ctx.fillStyle = "#07111F"; ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = RING.skill; ctx.lineWidth = 2.5 / s; ctx.stroke()
      if (mark.complete && mark.naturalWidth) ctx.drawImage(mark, -14, -14, 28, 28)
      ctx.fillStyle = "#F3F5FF"; ctx.font = "700 15px Inter, system-ui, sans-serif"; ctx.textAlign = "center"; spaced("LEGAL BRAIN", 0, 48, 1.6)
    }

    let raf = 0, visible = false, t = 8, last = performance.now()
    const frame = (now: number) => {
      t += Math.min(50, now - last) / 1000; last = now
      place(t); draw()
      raf = visible && !still ? requestAnimationFrame(frame) : 0
    }
    const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame) } }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start() }, { rootMargin: "100px" })
    io.observe(cv)
    mark.onload = () => { if (!raf) { place(t); draw() } }
    const onResize = () => { if (!raf) { place(t); draw() } }
    window.addEventListener("resize", onResize)
    place(t); draw()
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", onResize) }
  }, [])

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="The Second Brain map: the Legal Brain at the center, a turning sphere of dots for court papers, cited cases and writing lessons, gold routines circling it and connected tools on the outer ring"
      className={className}
    />
  )
}
