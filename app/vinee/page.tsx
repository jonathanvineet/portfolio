'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import heroStyles from '../../styles/Hero.module.css'
import RotatingCards from '../components/RotatingCards'
import styles from '../../styles/VineeButton.module.css'
import { supabase } from '../lib/supabaseClient'

export default function VineePage() {
  const [mounted, setMounted] = useState(false)
  const [photos, setPhotos] = useState<string[]>(['/assets/IMG_6508.jpeg'])
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Reuse the hero fixed glass via portal
  useEffect(() => {
    let root = document.getElementById('hero-bg-portal')
    if (!root) {
      root = document.createElement('div')
      root.id = 'hero-bg-portal'
      document.body.appendChild(root)
    }
    return () => {
      const el = document.getElementById('hero-bg-portal')
      if (el && el.childElementCount === 0) el.remove()
    }
  }, [])

  const portalRoot = typeof window !== 'undefined' ? document.getElementById('hero-bg-portal') : null

  const fixedGlass = (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none px-6 w-full flex justify-center" style={{ zIndex: 1 }}>
      <div className={heroStyles.heroGlass + ' w-full max-w-7xl h-72 md:h-[520px]'}></div>
    </div>
  )

  // Fetch images from Supabase `vinee` bucket when available (client-side only)
  useEffect(() => {
    let mounted = true
    const staticFallback = ['/assets/IMG_6508.jpeg']

    const fetchPhotos = async () => {
      if (!supabase) {
        // Supabase not configured — keep fallback
        // eslint-disable-next-line no-console
        console.warn('Supabase client not available in Vinee page; using fallback photos')
        return
      }

      try {
        const { data, error } = await supabase.storage
          .from('vinee')
          .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })

        if (error) {
          console.error('Error listing vinee bucket:', error)
          return
        }

        if (!data || data.length === 0) {
          console.warn('No files in vinee bucket, using fallback')
          return
        }

        const urls = await Promise.all(
          data.map(async (item) => {
            if (!supabase) return ''
            const { data: urlData } = supabase.storage.from('vinee').getPublicUrl(item.name)
            return urlData.publicUrl
          })
        )

        if (mounted && urls && urls.length > 0) setPhotos(urls)
      } catch (err) {
        console.error('Failed fetching vinee images:', err)
      }
    }

    fetchPhotos()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section
      className={heroStyles.heroContainer + ' bg-fixed relative'}
      style={{ backgroundImage: "url('/assets/vinee.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
    >
      {mounted && portalRoot ? createPortal(fixedGlass, portalRoot) : fixedGlass}

      <div className="container mx-auto px-6 py-16 relative" style={{ zIndex: 20 }}>
        {/* Header name */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-300 mb-2">You've entered the batcave</p>
          <h1 className="font-poppins text-white text-4xl">Vinee</h1>
        </div>

        {/* Profile image - Rotating Cards */}
          <div className="flex justify-center mb-20 h-96">
            {/* Rotating cards will fetch from Supabase `vinee` bucket when available */}
            <RotatingCards photos={photos} />
          </div>

        {/* Three interest paragraphs - stacked full width */}
        <div className="w-full max-w-4xl mx-auto space-y-16">
          <div className="glass-panel rounded-2xl p-8 border border-white/10">
            <h2 className="text-white font-semibold text-2xl mb-4">Loyals</h2>
            <p className="text-gray-200 text-base leading-7">
              Poetry lets me distill feelings into rhythm and imagery. 
              It's where emotion finds structure, and a single line can echo far beyond the page. Words become weapons of truth. 
              Writing poems allows me to express the things I often find hard to say out loud. It’s my way of sharing my inner world.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/vinee/poetry">
                <button className={styles.button}>
                  <span>See more</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-8 border border-white/10">
            <h2 className="text-white font-semibold text-2xl mb-4">Beasts</h2>
            <p className="text-gray-200 text-base leading-7">
              Photography is how I hold onto moments — light, texture, and emotion. 
              I love framing stories in a single shot and finding beauty in everyday scenes. The lens never lies. 
              Capturing the essence of a fleeting moment gives me a sense of connection to the world around me.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/vinee/photography">
                <button className={styles.button}>
                  <span>See more</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
