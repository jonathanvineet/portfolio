'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from '../../styles/Hero.module.css'
import CircularGallery from './CircularGallery'
import { supabase } from '../lib/supabaseClient'

export default function Hero() {
  const [galleryItems, setGalleryItems] = useState<{ image: string; text: string }[]>([])
  const [mounted, setMounted] = useState(false)

  // Fetch gallery images from Supabase (if configured). If Supabase is not
  // available (missing NEXT_PUBLIC_SUPABASE_KEY), fall back to static images
  // bundled with the site so the Hero still renders during development.
  useEffect(() => {
    const staticFallback = [
      { image: '/assets/IMG_4654.jpeg', text: 'Adventure' },
      { image: '/assets/IMG_4654.jpeg', text: 'Tech Life' },
      { image: '/assets/IMG_4654.jpeg', text: 'Moments' },
    ]

    if (!supabase) {
      // Supabase not configured — use fallback images
      // eslint-disable-next-line no-console
      console.warn('Supabase client not available; using static gallery fallback.')
      setGalleryItems(staticFallback)
      return
    }

    const fetchImages = async () => {
      try {
        const client = supabase
        if (!client) {
          console.warn('Supabase client not available; using static gallery fallback.')
          setGalleryItems(staticFallback)
          return
        }

        console.log('Fetching images from Supabase herogallery bucket...')
        const { data, error } = await client.storage
          .from('herogallery')
          .list('', {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' },
          })

        if (error) {
          console.error('Error loading images from Supabase:', error)
          setGalleryItems(staticFallback)
          return
        }

        console.log(`Supabase returned ${data?.length || 0} images`)

        if (!data || data.length === 0) {
          console.warn('No images found in Supabase bucket — using fallback')
          setGalleryItems(staticFallback)
          return
        }

        const urls = await Promise.all(
          data.map(async (item) => {
            const { data: urlData } = client.storage
              .from('herogallery')
              .getPublicUrl(item.name)

            console.log(`Generated public URL for ${item.name}:`, urlData.publicUrl)

            return {
              image: urlData.publicUrl,
              text: item.name.split('.')[0], // Use filename as label
            }
          })
        )

        console.log(`Gallery loaded with ${urls.length} images`)
        setGalleryItems(urls)
      } catch (err) {
        console.error('Unexpected error fetching images:', err)
        setGalleryItems(staticFallback)
      }
    }

    fetchImages()
  }, [])

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Create portal root for hero fixed backgrounds so they remain fixed to viewport
  useEffect(() => {
    let root = document.getElementById('hero-bg-portal')
    if (!root) {
      root = document.createElement('div')
      root.id = 'hero-bg-portal'
      document.body.appendChild(root)
    }
    return () => {
      // keep element if other pages/components might reuse it; remove only if empty
      const el = document.getElementById('hero-bg-portal')
      if (el && el.childElementCount === 0) el.remove()
    }
  }, [])

  const portalRoot = typeof window !== 'undefined' ? document.getElementById('hero-bg-portal') : null

  const fixedBackgrounds = (
    <>
      {/* Fixed floating glow particles background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className={styles.floatingGlow}></div>
        <div className={styles.floatingGlow}></div>
        <div className={styles.floatingGlow}></div>
        <div className={styles.floatingGlow}></div>
      </div>

      {/* Fixed glass panel background */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none px-6 w-full flex justify-center" style={{ zIndex: 1 }}>
        {/* increased max width and added responsive height for a larger background panel */}
        <div className={styles.heroGlass + ' w-full max-w-7xl h-72 md:h-[520px]'}></div>
      </div>
    </>
  )

  return (
    <section
      className={styles.heroContainer + ' bg-dark-bg bg-fixed relative'}
      // ensure background image stays fixed across browsers
      style={{ backgroundAttachment: 'fixed' }}
    >
      {/* Render fixed backgrounds into body so they stay viewport-fixed */}
      {mounted && portalRoot ? createPortal(fixedBackgrounds, portalRoot) : fixedBackgrounds}

      {/* Scrollable content */}
      <div className="container mx-auto px-6 py-20 relative" style={{ zIndex: 20 }}>
        <div className="w-full max-w-4xl mx-auto"> 
          <div className="flex flex-col items-center space-y-8">
          
            {/* Name & Title */}
            <div className="text-center">
              <h1 className="font-poppins text-white mb-2">
                Vineet Jonathan
              </h1>
              <p className="font-inter text-lg text-gray-400">
                Engineer & Founder
              </p>
            </div>
            
            {/* Profile Image with rings */}
            <div className={styles.profileContainer}>
              <img 
                src="/assets/IMG_4654.jpeg" 
                alt="Profile" 
                className={styles.profileImage}
              />
              {/* Pulsing rings */}
              <span className={styles.pulseRingGold}></span>
              <span className={styles.pulseRingRed}></span>
            </div>
              
            {/* Badass Quote */}
            <div className={styles.quoteCard + ' glass-panel rounded-2xl p-6 border border-white/10 w-full'}>
              <p className="font-poppins text-xl text-gold italic leading-relaxed text-center">
                "Code is poetry, infrastructure is art,<br />
                and disruption is the only constant."
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-gold to-blood-red"></div>
                <span className="font-inter text-sm text-gray-500">Always Shipping</span>
              </div>
            </div>
              
            {/* Social links (GitHub, LinkedIn, X, Email) */}
            <div className="flex gap-4">
              <a href="https://github.com/jonathanvineet" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"></path></svg>
              </a>
              <a href="https://www.linkedin.com/in/jonathanvineet/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://x.com/jonathan_vineet" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="X">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
              </a>
              <a href="mailto:cvineetjonathan@gmail.com" className={styles.socialIcon} aria-label="Email">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11A2.5 2.5 0 0119.5 20h-15A2.5 2.5 0 012 17.5v-11zM4.5 6L12 11l7.5-5"/></svg>
              </a>
            </div>
            
            {/* Circular Gallery - Full Screen Width */}
            <div className="relative w-screen h-[600px] -mx-6">
              <CircularGallery
                items={galleryItems}
                bend={0}
                textColor="#F0C000"
                borderRadius={0.0}
                scrollSpeed={2}
                scrollEase={0.02}
                autoRotate={true}
                autoSpeed={1.2}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
