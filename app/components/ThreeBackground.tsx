'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// ─── User defined camera path ───────────────────────────────────────────────
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

// ─── Smooth camera driver (reads a shared progress ref) ──────────────────────
function CameraDriver({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree()
  const smoothProgress = useRef(0)

  useFrame(() => {
    // Ease toward the target progress (0.03 gives a VERY smooth, delayed glide)
    smoothProgress.current += (progressRef.current - smoothProgress.current) * 0.03

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

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ThreeBackground() {
  const progressRef = useRef(0)
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
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Tall scrollable ghost container — gives us natural scroll progress */}
      <div
        ref={scrollContainerRef}
        style={{
          position: 'fixed',
          inset: 0,
          overflowY: 'scroll',
          zIndex: 10,
          // Scrollbar invisible but functional
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Generous height for plenty of smooth scrolling time */}
        <div style={{ height: `${cameraPath.length * 150}vh` }} />
      </div>

      {/* Canvas — fixed behind everything */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Canvas
          shadows
          style={{ background: '#080812' }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
        >
          {/* BRIGHTER LIGHTING OVERALL */}
          <ambientLight intensity={1.8} color="#ffffff" />
          
          <directionalLight position={[10, 20, 10]} intensity={3.5} castShadow color="#ffffff" />
          <directionalLight position={[-10, 10, -10]} intensity={1.5} color="#a0c0ff" />
          <directionalLight position={[0, 5, 10]} intensity={1.0} color="#ffd700" />
          
          {/* Multiple point lights to fill dark areas */}
          <pointLight position={[0, 5, 0]} intensity={4} color="#ffffff" distance={25} />
          <pointLight position={[-5, 2, 5]} intensity={3.5} color="#4a90e2" distance={20} />
          <pointLight position={[5, 1, -5]} intensity={3} color="#9333ea" distance={20} />
          <pointLight position={[0, 3, 5]} intensity={3} color="#ffd700" distance={20} />
          <pointLight position={[-3, -0.5, -1]} intensity={2.5} color="#ff6b35" distance={15} />
          <pointLight position={[3, -1, 2]} intensity={2.5} color="#ffffff" distance={15} />

          {/* Lighter, pushed-back fog so you can see more of the model */}
          <fog attach="fog" args={['#080812', 12, 45]} />

          <Suspense fallback={null}>
            <BatcaveScene />
          </Suspense>

          <CameraDriver progressRef={progressRef} />
        </Canvas>
      </div>
    </>
  )
}

useGLTF.preload('/assets/the_batcave/scene.gltf')