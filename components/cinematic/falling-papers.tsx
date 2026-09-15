"use client"

import { Suspense, useEffect, useMemo, useRef } from "react"
import { useThree } from "@react-three/fiber"
import { Canvas, useFrame } from "@react-three/fiber"
import { makeDocumentTexture } from "./document-texture"
import * as THREE from "three"

const COUNT = 22
const TOP = 5
const BOTTOM = -5.5

type Sheet = { pos: THREE.Vector3; rot: THREE.Euler; vel: number; sway: number; spin: THREE.Vector3; scale: number }

function reset(s: Sheet, initial = false, halfW = 6) {
  s.pos.set((Math.random() - 0.5) * halfW * 2, initial ? THREE.MathUtils.lerp(BOTTOM, TOP, Math.random()) : TOP + Math.random() * 2, (Math.random() - 0.5) * 4)
  s.rot.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
  s.vel = 0.5 + Math.random() * 0.7
  s.sway = Math.random() * Math.PI * 2
  s.spin.set((Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 0.6)
  s.scale = 0.6 + Math.random() * 0.6
}

function Sheets({ wind }: { wind: React.MutableRefObject<number> }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tex = useMemo(() => makeDocumentTexture(7), [])
  const viewport = useThree((st) => st.viewport)
  const sheets = useMemo(() => {
    const halfW = (viewport.width / 2) * 1.1
    return Array.from({ length: COUNT }, () => {
      const s: Sheet = { pos: new THREE.Vector3(), rot: new THREE.Euler(), vel: 1, sway: 0, spin: new THREE.Vector3(), scale: 1 }
      reset(s, true, halfW)
      return s
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // slight curl so sheets catch light differently as they tumble
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.85, 1.1, 8, 8)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 5) * 0.05)
    g.computeVertexNormals()
    return g
  }, [])

  useFrame((state, delta) => {
    const m = mesh.current
    if (!m) return
    const t = state.clock.elapsedTime
    const w = wind.current
    wind.current *= 0.92 // decay scroll-wind
    const halfW = (state.viewport.width / 2) * 1.1
    sheets.forEach((s, i) => {
      s.pos.y -= (s.vel + Math.abs(w) * 3) * delta
      s.pos.x += Math.sin(t * 0.7 + s.sway) * delta * 0.6 + w * delta * 2
      s.rot.x += s.spin.x * delta
      s.rot.y += s.spin.y * delta
      s.rot.z += s.spin.z * delta
      if (s.pos.y < BOTTOM) reset(s, false, halfW)
      dummy.position.copy(s.pos)
      dummy.rotation.copy(s.rot)
      dummy.scale.setScalar(s.scale)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    })
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[geo, undefined, COUNT]}>
      <meshStandardMaterial
        map={tex}
        emissive="#FBB034"
        emissiveIntensity={0.12}
        roughness={0.9}
        side={THREE.DoubleSide}
        transparent
        opacity={0.85}
      />
    </instancedMesh>
  )
}

function Rig({ wind }: { wind: React.MutableRefObject<number> }) {
  const g = useRef<THREE.Group>(null)
  useFrame((state) => {
    const grp = g.current
    if (!grp) return
    grp.rotation.y += (state.pointer.x * 0.25 - grp.rotation.y) * 0.05
    grp.rotation.x += (-state.pointer.y * 0.15 - grp.rotation.x) * 0.05
    grp.position.x += (state.pointer.x * 0.6 - grp.position.x) * 0.05
  })
  return (
    <group ref={g}>
      <Suspense fallback={null}>
        <Sheets wind={wind} />
      </Suspense>
    </group>
  )
}

/** Paper sheets (textured with the ChatGPT render) falling through the scene. Scrolling adds wind. */
export default function FallingPapers({ className = "" }: { className?: string }) {
  const wind = useRef(0)
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const dy = window.scrollY - last
      last = window.scrollY
      wind.current = THREE.MathUtils.clamp(wind.current + dy / 600, -1.5, 1.5)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} color="#9fb0c8" />
        <directionalLight position={[4, 6, 5]} intensity={2.2} color="#FBB034" />
        <directionalLight position={[-5, 2, 3]} intensity={0.6} color="#c9d3e3" />
        <Rig wind={wind} />
      </Canvas>
    </div>
  )
}
