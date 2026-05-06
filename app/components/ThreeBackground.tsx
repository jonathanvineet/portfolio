'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import Link from 'next/link'

// ─── Camera path ──────────────────────────────────────────────────────────────
const cameraPath: { pos: THREE.Vector3; target: THREE.Vector3 }[] = [
  {
    pos: new THREE.Vector3(-1.7852, 0.8127, 4.9740),
    target: new THREE.Vector3(-0.1733, -1.2781, 0.6571),
  },
  {
    pos: new THREE.Vector3(0.0961, -0.5934, 2.7973),
    target: new THREE.Vector3(0.0961, -0.8654, 0.0765),
  },
  {
    pos: new THREE.Vector3(1.5234, -1.0055, 3.6341),
    target: new THREE.Vector3(-1.3954, -1.4381, 1.0603),
  },
  {
    pos: new THREE.Vector3(4.9662, -1.2097, 2.2390),
    target: new THREE.Vector3(2.8003, -2.3715, -2.1841),
  },
]

// ─── Story beats (one per camera keyframe) ────────────────────────────────────
const storyBeats = [
  {
    title: "VINEE'S BATCAVE",
    body: "Shadows conceal what the light fears to reveal. Step into my sanctuary—where my interests, visions, and creations reside in the dark.",
    buttonText: null,
    buttonLink: null,
  },
  {
    title: "THE ARCHIVES",
    body: "Every moment captured, every frame analyzed. Nothing escapes the lens.",
    buttonText: "ACCESS PHOTOGRAPHY",
    buttonLink: "/vinee/photography",
  },
  {
    title: "THE ENIGMA FILES",
    body: "Words that cut through the darkness. A mind must stay sharp.",
    buttonText: "DECRYPT POETRY",
    buttonLink: "/vinee/poetry",
  },
  {
    title: "THE MENAGERIE",
    body: "Observing life beyond the concrete jungle. The creatures of the night—and day.",
    buttonText: "VIEW SUBJECTS",
    buttonLink: "/vinee/animals",
  },
]

// ─── Pure-function overlay — no state machine, no timers ─────────────────────
// All cards live in the DOM. Each card's visibility is a direct function of
// scroll progress. CSS `transition` handles smoothing automatically.
function StoryOverlay({ progress }: { progress: number }) {
  const n = cameraPath.length        // 4 keyframes
  const segments = n - 1             // 3 segments

  return (
    // Full-screen container, pointer-events none by default so the ghost
    // scroller still receives wheel events. Cards re-enable per-card.
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 30,
      pointerEvents: 'none',
    }}>
      {storyBeats.map((beat, i) => {
        // Each beat is centred at progress = i / segments (0, 0.33, 0.67, 1)
        const centre = i / segments
        const dist = Math.abs(progress - centre)

        // Visible window: 0.14 either side of the centre.
        // At dist=0 → opacity 1. At dist=0.14 → opacity 0.
        const HALF_WIN = 0.14
        const opacity = Math.max(0, 1 - dist / HALF_WIN)

        // Slide up from +20px when invisible; settle at 0 when visible
        const ty = (1 - opacity) * 20

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: '7%',
              left: '50%',
              // translateX centres the card; translateY provides the slide
              transform: `translateX(-50%) translateY(${ty}px)`,
              opacity,
              // CSS transition is the hero here — it smooths every opacity
              // and transform change that comes from scrolling
              transition: 'opacity 0.45s cubic-bezier(0.4,0,0.2,1), transform 0.45s cubic-bezier(0.4,0,0.2,1)',
              width: '90vw',
              maxWidth: '580px',
              textAlign: 'center',
              // Only receive pointer events when meaningfully visible
              pointerEvents: opacity > 0.25 ? 'auto' : 'none',
            }}
          >
            {/* Misty atmospheric halo — no box, just layered radial fog */}
            <div style={{
              position: 'absolute',
              inset: '-60px -80px',
              background: [
                'radial-gradient(ellipse 80% 55% at 50% 60%, rgba(4,4,14,0.82) 0%, transparent 70%)',
                'radial-gradient(ellipse 60% 35% at 50% 55%, rgba(255,215,0,0.04) 0%, transparent 65%)',
              ].join(', '),
              filter: 'blur(18px)',
              pointerEvents: 'none',
              zIndex: 0,
            }} />

            {/* Content sits above the mist */}
            <div style={{ position: 'relative', zIndex: 1, padding: '10px 12px' }}>
              {/* Eyebrow */}
              <p style={{
                margin: '0 0 10px',
                fontSize: '0.6rem',
                letterSpacing: '0.38em',
                color: 'rgba(255,215,0,0.65)',
                textTransform: 'uppercase',
                fontFamily: '"Raleway", sans-serif',
                fontWeight: 600,
              }}>
                — Vinee's Batcave —
              </p>

              {/* Title */}
              <h2 style={{
                margin: '0 0 14px',
                fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
                fontWeight: 900,
                fontFamily: '"Cinzel", "Georgia", serif',
                color: '#ffffff',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                lineHeight: 1.1,
                textShadow: '0 0 40px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)',
              }}>
                {beat.title}
              </h2>

              {/* Thin gold rule */}
              <div style={{
                width: '36px',
                height: '1px',
                background: 'rgba(255,215,0,0.45)',
                margin: '0 auto 16px',
              }} />

              {/* Body */}
              <p style={{
                margin: beat.buttonLink ? '0 0 22px' : '0',
                fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)',
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.85,
                fontFamily: '"Raleway", sans-serif',
                fontWeight: 300,
                letterSpacing: '0.03em',
                textShadow: '0 1px 6px rgba(0,0,0,0.9)',
              }}>
                {beat.body}
              </p>

              {/* CTA button */}
              {beat.buttonLink && beat.buttonText && (
                <Link
                  href={beat.buttonLink}
                  style={{
                    display: 'inline-block',
                    color: '#ffd700',
                    border: '1px solid rgba(255,215,0,0.45)',
                    padding: '9px 26px',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    fontFamily: '"Raleway", sans-serif',
                    transition: 'background 0.25s, color 0.25s, box-shadow 0.25s',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    background: 'rgba(0,0,0,0.25)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ffd700'
                    e.currentTarget.style.color = '#000'
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(255,215,0,0.45)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.25)'
                    e.currentTarget.style.color = '#ffd700'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {beat.buttonText}
                </Link>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Camera driver ────────────────────────────────────────────────────────────
function CameraDriver({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree()
  const smoothP = useRef(0)

  useFrame(() => {
    smoothP.current += (progressRef.current - smoothP.current) * 0.03

    const p = Math.min(Math.max(smoothP.current, 0), 1)
    const segments = cameraPath.length - 1
    const sp = p * segments
    const idx = Math.min(Math.floor(sp), segments - 1)
    const t = sp - idx
    const st = t * t * (3 - 2 * t) // smooth step

    const pos = new THREE.Vector3().lerpVectors(cameraPath[idx].pos, cameraPath[idx + 1].pos, st)
    const tgt = new THREE.Vector3().lerpVectors(cameraPath[idx].target, cameraPath[idx + 1].target, st)

    camera.position.copy(pos)
    camera.lookAt(tgt)
  })

  return null
}

// ─── Batcave 3-D model ────────────────────────────────────────────────────────
function BatcaveScene() {
  const ref = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/assets/the_batcave/scene.gltf')

  useEffect(() => {
    if (!ref.current) return
    ref.current.scale.setScalar(1)
    ref.current.position.set(0, -0.3, 0)
    ref.current.traverse((c) => {
      if (c instanceof THREE.Mesh) { c.castShadow = true; c.receiveShadow = true }
    })
  }, [scene])

  return <primitive ref={ref} object={scene} />
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ThreeBackground() {
  const progressRef = useRef(0)
  const [displayProgress, setDisplayProgress] = useState(0)
  const ghostRef = useRef<HTMLDivElement>(null)

  // Throttle React state updates to ~60fps with rAF to avoid jank
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const el = ghostRef.current
    if (!el) return

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      const max = scrollHeight - clientHeight
      if (max <= 0) return
      const raw = scrollTop / max
      progressRef.current = raw

      if (rafId.current !== null) return
      rafId.current = requestAnimationFrame(() => {
        setDisplayProgress(progressRef.current)
        rafId.current = null
      })
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      {/* Fonts — injected into head once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Raleway:wght@300;400;600&display=swap');
        .bc-ghost::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── 3 layers, bottom to top ───────────────────────────────────────── */}

      {/* Layer 0 — Three.js canvas */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas
          shadows
          camera={{ position: [-1.7852, 0.8127, 4.9740], fov: 55 }}
          style={{ background: '#080812' }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={1.8} color="#ffffff" />
          <directionalLight position={[10, 20, 10]} intensity={3.5} castShadow />
          <directionalLight position={[-10, 10, -10]} intensity={1.5} color="#a0c0ff" />
          <directionalLight position={[0, 5, 10]} intensity={1.0} color="#ffd700" />
          <pointLight position={[0, 5, 0]} intensity={4} color="#ffffff" distance={25} />
          <pointLight position={[-5, 2, 5]} intensity={3.5} color="#4a90e2" distance={20} />
          <pointLight position={[5, 1, -5]} intensity={3} color="#9333ea" distance={20} />
          <pointLight position={[0, 3, 5]} intensity={3} color="#ffd700" distance={20} />
          <pointLight position={[-3, -0.5, -1]} intensity={2.5} color="#ff6b35" distance={15} />
          <pointLight position={[3, -1, 2]} intensity={2.5} color="#ffffff" distance={15} />
          <fog attach="fog" args={['#080812', 12, 45]} />
          <Suspense fallback={null}>
            <BatcaveScene />
          </Suspense>
          <CameraDriver progressRef={progressRef} />
        </Canvas>
      </div>

      {/* Layer 1 — Ghost scroller (captures wheel/touch scroll, invisible) */}
      <div
        ref={ghostRef}
        className="bc-ghost"
        style={{
          position: 'fixed',
          inset: 0,
          overflowY: 'scroll',
          zIndex: 20,
          scrollbarWidth: 'none',
          // Allow clicks to fall through to the story overlay buttons below
          // by using pointer-events only on the scroll track, not on children.
          // We achieve this by setting the container to pointer-events:none
          // and a transparent inner child to pointer-events:auto for scrolling.
        }}
      >
        {/* This inner div DOES receive pointer events so wheel scrolling works */}
        <div
          style={{
            height: `${cameraPath.length * 180}vh`,
            pointerEvents: 'auto',
          }}
        />
      </div>

      {/* Layer 2 — Story overlay (above ghost scroller) */}
      <StoryOverlay progress={displayProgress} />
    </>
  )
}

useGLTF.preload('/assets/the_batcave/scene.gltf')