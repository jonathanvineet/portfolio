'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Camera path keyframes (position + lookAt)
const cameraPath = [
  { pos: new THREE.Vector3(-0.03, -0.23, 4.29), target: new THREE.Vector3(0, 0, 0) },
  { pos: new THREE.Vector3(1.17,  0.17, 2.76), target: new THREE.Vector3(0, 0, 0) },
  { pos: new THREE.Vector3(-0.09, -0.32, 2.98), target: new THREE.Vector3(0, 0, 0) },
  { pos: new THREE.Vector3(1.51, -0.24, 2.58), target: new THREE.Vector3(0, 0, 0) },
  { pos: new THREE.Vector3(-0.19, -0.29, 3.66), target: new THREE.Vector3(0, 0, 0) },
]

// Invisible loading fallback
function LoadingFallback() {
  return null
}

// Batcave scene component
function BatcaveScene() {
  const modelRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/assets/the_batcave/scene.gltf')

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.scale.setScalar(1)
      modelRef.current.position.set(0, -0.3, 0)
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [scene])

  return <primitive ref={modelRef} object={scene} />
}

// Smooth camera tour driven by wheel events
function CameraTour() {
  const { camera, gl } = useThree()
  // virtualScroll accumulates raw wheel delta
  const virtualScroll = useRef(0)
  // smoothScroll is the eased value we actually use
  const smoothScroll = useRef(0)

  useEffect(() => {
    const canvas = gl.domElement

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      // Accumulate scroll, clamp between 0 and max
      const maxScroll = 3000
      virtualScroll.current = Math.min(
        Math.max(virtualScroll.current + e.deltaY, 0),
        maxScroll
      )
    }
    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', onWheel)
  }, [gl])

  useFrame(() => {
    // Ease smoothScroll toward virtualScroll (0.06 = nice smooth glide)
    smoothScroll.current += (virtualScroll.current - smoothScroll.current) * 0.06

    // Map smoothScroll 0-3000 to progress 0-1
    const progress = Math.min(Math.max(smoothScroll.current / 3000, 0), 1)

    // Figure out which two keyframes we sit between
    const segments = cameraPath.length - 1          // 4 segments
    const scaledProgress = progress * segments       // 0 → 4
    const segIndex = Math.min(Math.floor(scaledProgress), segments - 1) // 0-3
    const t = scaledProgress - segIndex              // local 0-1 within segment

    const from = cameraPath[segIndex]
    const to   = cameraPath[segIndex + 1]

    // Interpolate position & lookAt
    const pos = new THREE.Vector3().lerpVectors(from.pos, to.pos, t)
    const lookTarget = new THREE.Vector3().lerpVectors(from.target, to.target, t)

    camera.position.copy(pos)
    camera.lookAt(lookTarget)
  })

  return null
}

// Main component
export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        shadows
        camera={{ position: [-0.03, -0.23, 4.29], fov: 60 }}
        style={{ background: '#000000' }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#4a90e2" />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#9333ea" />
        <pointLight position={[5, 2, -3]} intensity={0.6} color="#ffd700" />

        {/* 3D Model */}
        <Suspense fallback={<LoadingFallback />}>
          <BatcaveScene />
        </Suspense>

        {/* Smooth scroll-driven camera */}
        <CameraTour />

        {/* Fog */}
        <fog attach="fog" args={['#000000', 5, 30]} />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/assets/the_batcave/scene.gltf')

useGLTF.preload('/assets/the_batcave/scene.gltf')