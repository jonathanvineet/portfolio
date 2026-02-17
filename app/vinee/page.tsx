'use client'

import { useEffect, useState } from 'react'
import heroStyles from '../../styles/Hero.module.css'
import ThreeBackground from '../components/ThreeBackground'

export default function VineePage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Prevent page scroll so wheel events go to the 3D canvas only
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      setMounted(false)
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <section
      className={heroStyles.heroContainer + ' relative'}
      style={{ minHeight: '100vh' }}
    >
      {/* Three.js 3D Background - Batcave Scene */}
      {mounted && <ThreeBackground />}
    </section>
  )
}
