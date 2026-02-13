'use client'

import { useEffect, useState } from 'react'
import heroStyles from '../../styles/Hero.module.css'
import ThreeBackground from '../components/ThreeBackground'

export default function VineePage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    console.log('VineePage mounted')
    setMounted(true)
    return () => {
      console.log('VineePage unmounting')
      setMounted(false)
    }
  }, [])

  return (
    <section
      className={heroStyles.heroContainer + ' relative'}
      style={{ minHeight: '300vh' }}
    >
      {/* Three.js 3D Background - Batcave Scene */}
      {mounted && <ThreeBackground />}
      
      {/* Add some scroll space */}
      <div className="relative z-10 text-white text-center pt-20">
        <h1 className="text-4xl mb-4">Scroll to explore the Batcave</h1>
        <p className="text-gray-400">The camera will orbit as you scroll</p>
      </div>
    </section>
  )
}
