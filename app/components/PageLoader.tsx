'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true) // Start with loader visible
  const [fadeOut, setFadeOut] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Hide body content initially
    document.body.style.overflow = 'hidden'
    
    const handlePageLoad = () => {
      // Wait for everything to be ready
      const minDisplayTime = 800 // Minimum time to show loader
      const startTime = Date.now()
      
      const hideLoader = () => {
        const elapsed = Date.now() - startTime
        const remainingTime = Math.max(0, minDisplayTime - elapsed)
        
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(() => {
            setIsLoading(false)
            document.body.style.overflow = ''
          }, 300) // Match CSS transition duration
        }, remainingTime)
      }

      // Wait for document to be fully loaded
      if (document.readyState === 'complete') {
        hideLoader()
      } else {
        window.addEventListener('load', hideLoader)
        return () => window.removeEventListener('load', hideLoader)
      }
    }

    handlePageLoad()
  }, [])

  useEffect(() => {
    // Handle route changes
    if (!isLoading) {
      setIsLoading(true)
      setFadeOut(false)
      document.body.style.overflow = 'hidden'
      
      const timer = setTimeout(() => {
        setFadeOut(true)
        setTimeout(() => {
          setIsLoading(false)
          document.body.style.overflow = ''
        }, 300)
      }, 400)
      
      return () => clearTimeout(timer)
    }
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className={`loader-container ${fadeOut ? 'loader-fade-out' : ''}`}>
      <div className="loader">
        <img src="/assets/loader.png" alt="Loading" className="loader-logo" />
      </div>
    </div>
  )
}
