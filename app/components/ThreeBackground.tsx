'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Tour points of interest in the batcave
const tourPoints = [
  { position: [5, 1, 5], lookAt: [0, 0, 0], name: 'Overview' },
  { position: [-3, 2, 6], lookAt: [2, 0, -2], name: 'Desk Area' },
  { position: [6, 1, -2], lookAt: [-3, 0, 2], name: 'Computer' },
  { position: [0, 3, 8], lookAt: [0, 0, -3], name: 'Upper View' },
  { position: [-5, 1, -3], lookAt: [3, 0, 1], name: 'Batmobile' },
  { position: [2, 4, 3], lookAt: [0, -1, 0], name: 'Cave Ceiling' }
]

// Simple loading fallback
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#9333ea" emissive="#9333ea" emissiveIntensity={0.5} />
    </mesh>
  )
}

// Batcave scene component
function BatcaveScene() {
  const modelRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/assets/the_batcave/scene.gltf')
  
  useEffect(() => {
    if (modelRef.current) {
      console.log('Batcave scene loaded and mounted')
      modelRef.current.scale.setScalar(1)
      modelRef.current.position.set(0, -2, 0)
      
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

// Scroll-based camera animation
function ScrollCameraTour({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const { camera } = useThree()
  const scrollRef = useRef(0)
  const targetPosition = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  useFrame(() => {
    // Calculate which tour point we're at based on scroll
    const scrollProgress = scrollRef.current / 2000 // Adjust scroll speed
    const totalPoints = tourPoints.length
    const currentIndex = Math.floor(scrollProgress * (totalPoints - 1))
    const nextIndex = Math.min(currentIndex + 1, totalPoints - 1)
    const localProgress = (scrollProgress * (totalPoints - 1)) % 1
    
    // Interpolate between current and next point
    const current = tourPoints[currentIndex]
    const next = tourPoints[nextIndex]
    
    targetPosition.current.lerpVectors(
      new THREE.Vector3(...current.position),
      new THREE.Vector3(...next.position),
      localProgress
    )
    
    targetLookAt.current.lerpVectors(
      new THREE.Vector3(...current.lookAt),
      new THREE.Vector3(...next.lookAt),
      localProgress
    )
    
    // Smoothly move camera
    camera.position.lerp(targetPosition.current, 0.05)
    
    // Update OrbitControls target
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, 0.05)
      controlsRef.current.update()
    }
  })
  
  return null
}

// Main component
export default function ThreeBackground() {
  const controlsRef = useRef<any>(null)
  
  return (
    <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        shadows
        camera={{ position: [5, 1, 5], fov: 60 }}
        style={{ background: '#000000' }}
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.5} 
          castShadow
        />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#4a90e2" />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#9333ea" />
        <pointLight position={[5, 2, -3]} intensity={0.6} color="#ffd700" />
        
        {/* 3D Model */}
        <Suspense fallback={<LoadingFallback />}>
          <BatcaveScene />
        </Suspense>
        
        {/* Scroll-based camera tour */}
        <ScrollCameraTour controlsRef={controlsRef} />
        
        {/* Mouse Controls - Can still drag to look around */}
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
        />
        
        {/* Fog */}
        <fog attach="fog" args={['#000000', 5, 30]} />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/assets/the_batcave/scene.gltf')
