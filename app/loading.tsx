'use client'

import { useEffect, useState } from 'react'

export default function Loading() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Detect if this is a reload by checking if we're navigating
    const handleComplete = () => setShow(false)
    
    // Hide loader after a minimum display time for smooth UX
    const timer = setTimeout(() => {
      setShow(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="loader-container">
      <div className="loader">
        <img src="/assets/loader.png" alt="Loading" className="loader-logo" />
      </div>
    </div>
  )
}
