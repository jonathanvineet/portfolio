'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// ─── Cinematic camera keyframes ───────────────────────────────────────────────
// Each keyframe: camera world position + look-at target
// Tuned to actually tour different parts of the Batcave model space.
// The model sits at y≈-0.3, roughly –2 to +2 on X and Z.
const cameraPath: { pos: THREE.Vector3; target: THREE.Vector3 }[] = [
  // 0 – Wide establishing shot – hovering back, looking inward
  {
    pos: new THREE.Vector3(0, 0.5, 5.5),
    target: new THREE.Vector3(0, -0.2, 0),
  },
  // 1 – Sweeping left arc – see the whole left wing
  {
    pos: new THREE.Vector3(-3.2, 0.3, 3.0),
    target: new THREE.Vector3(0, -0.1, 0),
  },
  // 2 – Low approach – ground level tracking toward center
  {
    pos: new THREE.Vector3(-1.0, -0.15, 2.2),
    target: new THREE.Vector3(0.3, -0.2, -0.5),
  },
  // 3 – Batmobile close-up – right side, slightly below hood
  {
    pos: new THREE.Vector3(1.8, -0.05, 1.6),
    target: new THREE.Vector3(0, -0.25, -0.3),
  },
  // 4 – TV monitor wall – pull back center, look at screens
  {
    pos: new THREE.Vector3(0.1, 0.55, 0.9),
    target: new THREE.Vector3(0, 0.4, -1.8),
  },
  // 5 – Dramatic overhead sweep – ceiling POV looking down
  {
    pos: new THREE.Vector3(0.4, 1.6, 0.5),
    target: new THREE.Vector3(0, -0.3, 0),
  },
  // 6 – Final pull-out – back to wide, slight Dutch angle
  {
    pos: new THREE.Vector3(2.2, 0.6, 4.2),
    target: new THREE.Vector3(-0.3, -0.1, 0),
  },
]

// Story text shown at each keyframe
const storyBeats: { title: string; body: string }[] = [
  {
    title: 'The Batcave',
    body: 'Hidden beneath Gotham, a sanctuary carved from stone and shadow.',
  },
  {
    title: 'The Arsenal',
    body: 'Every gadget. Every contingency. Nothing left to chance.',
  },
  {
    title: 'Into the Dark',
    body: "He doesn't just prepare for the night — he becomes it.",
  },
  {
    title: 'The Batmobile',
    body: 'More than a vehicle. It is fury made mechanical.',
  },
  {
    title: 'The Watch Room',
    body: 'Every camera. Every frequency. Gotham has no secrets here.',
  },
  {
    title: 'The Vow',
    body: 'From above, the city looks fragile. That is why he never stops.',
  },
  {
    title: 'Always Ready',
    body: 'The cave sleeps. The man never does.',
  },
]

// ─── Smooth camera driver (reads a shared progress ref) ──────────────────────
function CameraDriver({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree()
  const smoothProgress = useRef(0)

  useFrame(() => {
    // Ease toward the target progress (higher = snappier; 0.04 = very smooth)
    smoothProgress.current += (progressRef.current - smoothProgress.current) * 0.04

    const p = Math.min(Math.max(smoothProgress.current, 0), 1)
    const segments = cameraPath.length - 1
    const scaledP = p * segments
    const segIdx = Math.min(Math.floor(scaledP), segments - 1)
    const t = scaledP - segIdx

    // Smooth step for extra cinematic easing within each segment
    const st = t * t * (3 - 2 * t)

    const from = cameraPath[segIdx]
    const to = cameraPath[segIdx + 1]

    const newPos = new THREE.Vector3().lerpVectors(from.pos, to.pos, st)
    const newTarget = new THREE.Vector3().lerpVectors(from.target, to.target, st)

    camera.position.copy(newPos)
    camera.lookAt(newTarget)
  })

  return null
}

// ─── 3D Model ────────────────────────────────────────────────────────────────
function BatcaveScene() {
  const modelRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/assets/the_batcave/scene.gltf')

  useEffect(() => {
    if (!modelRef.current) return
    modelRef.current.scale.setScalar(1)
    modelRef.current.position.set(0, -0.3, 0)
    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  return <primitive ref={modelRef} object={scene} />
}

// ─── Overlay story text panel ─────────────────────────────────────────────────
function StoryOverlay({ progress }: { progress: number }) {
  const segments = cameraPath.length - 1
  const rawIdx = progress * segments
  const beatIdx = Math.min(Math.round(rawIdx), storyBeats.length - 1)

  // Opacity: fade out near segment boundaries, full at center
  const localT = rawIdx - Math.floor(rawIdx)
  const center = localT < 0.5 ? localT * 2 : (1 - localT) * 2
  const opacity = Math.min(center * 2, 1)

  const beat = storyBeats[beatIdx]

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 10,
        opacity,
        transition: 'opacity 0.3s ease',
        maxWidth: '600px',
        width: '90%',
      }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,215,0,0.25)',
          borderRadius: '16px',
          padding: '20px 32px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,215,0,0.08)',
        }}
      >
        <h2
          style={{
            margin: '0 0 8px',
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffd700, #ff6b35)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.04em',
            fontFamily: '"Inter", "Outfit", sans-serif',
          }}
        >
          {beat.title}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.6,
            fontFamily: '"Inter", "Outfit", sans-serif',
          }}
        >
          {beat.body}
        </p>
      </div>
    </div>
  )
}

// ─── Progress dots ─────────────────────────────────────────────────────────────
function ProgressDots({ progress }: { progress: number }) {
  const segments = cameraPath.length - 1
  const activeIdx = Math.min(Math.round(progress * segments), segments)

  return (
    <div
      style={{
        position: 'absolute',
        right: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {cameraPath.map((_, i) => (
        <div
          key={i}
          style={{
            width: i === activeIdx ? '10px' : '6px',
            height: i === activeIdx ? '10px' : '6px',
            borderRadius: '50%',
            background: i === activeIdx ? '#ffd700' : 'rgba(255,255,255,0.3)',
            border: i === activeIdx ? '1px solid rgba(255,215,0,0.6)' : '1px solid rgba(255,255,255,0.15)',
            boxShadow: i === activeIdx ? '0 0 8px rgba(255,215,0,0.8)' : 'none',
            transition: 'all 0.4s ease',
          }}
        />
      ))}
    </div>
  )
}

// ─── Scroll hint arrow ─────────────────────────────────────────────────────────
function ScrollHint({ visible }: { visible: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.75rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontFamily: '"Inter", sans-serif',
        }}
      >
        scroll to explore
      </span>
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRight: '2px solid rgba(255,215,0,0.6)',
          borderBottom: '2px solid rgba(255,215,0,0.6)',
          transform: 'rotate(45deg)',
          animation: 'bounce 1.4s infinite',
        }}
      />
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ThreeBackground() {
  // Raw scroll progress 0-1 shared between DOM and R3F world
  const progressRef = useRef(0)
  const [displayProgress, setDisplayProgress] = useState(0)
  const [showHint, setShowHint] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const maxScroll = scrollHeight - clientHeight
      if (maxScroll <= 0) return

      const raw = scrollTop / maxScroll
      progressRef.current = raw
      setDisplayProgress(raw)

      if (raw > 0.01) setShowHint(false)
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Bounce keyframe injected once */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: rotate(45deg) translateY(0); }
          50% { transform: rotate(45deg) translateY(6px); }
        }
      `}</style>

      {/* Tall scrollable ghost container — gives us natural scroll progress */}
      <div
        ref={scrollContainerRef}
        style={{
          position: 'fixed',
          inset: 0,
          overflowY: 'scroll',
          zIndex: 1,
          // Scrollbar invisible but functional
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Phantom height: 600vh gives 6 full scrolls = 6 segments */}
        <div style={{ height: `${cameraPath.length * 100}vh` }} />
      </div>

      {/* Canvas — fixed behind everything */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas
          shadows
          camera={{ position: [0, 0.5, 5.5], fov: 55 }}
          style={{ background: '#04040a' }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
        >
          {/* Moody cinematic lighting */}
          <ambientLight intensity={0.25} />
          <directionalLight position={[4, 8, 4]} intensity={1.2} castShadow color="#ffffff" />
          <pointLight position={[-2, 2, 2]} intensity={1.2} color="#4a90e2" distance={10} />
          <pointLight position={[3, 1, -3]} intensity={0.8} color="#9333ea" distance={8} />
          <pointLight position={[0, 3, 0]} intensity={0.6} color="#ffd700" distance={6} />
          <pointLight position={[-3, -0.5, -1]} intensity={0.4} color="#ff6b35" distance={6} />

          {/* Fog for cinematic depth */}
          <fog attach="fog" args={['#04040a', 6, 22]} />

          <Suspense fallback={null}>
            <BatcaveScene />
          </Suspense>

          <CameraDriver progressRef={progressRef} />
        </Canvas>
      </div>

      {/* HUD overlays — above canvas, pointer-events off */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        <StoryOverlay progress={displayProgress} />
        <ProgressDots progress={displayProgress} />
        <ScrollHint visible={showHint} />
      </div>
    </>
  )
}

useGLTF.preload('/assets/the_batcave/scene.gltf')