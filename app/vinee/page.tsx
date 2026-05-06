'use client'

import { useEffect, useState } from 'react'
import ThreeBackground from '../components/ThreeBackground'

export default function VineePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Lock the body scroll — scrolling is handled by the ghost container inside ThreeBackground
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      setMounted(false)
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {mounted && <ThreeBackground />}
    </div>
  )
}
