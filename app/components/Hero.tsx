'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from '../../styles/Hero.module.css'
import Stack from './Stack'
import { supabase } from '../lib/supabaseClient'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Hero() {
  const [galleryItems, setGalleryItems] = useState<{ image: string; text: string }[]>([])
  const [mounted, setMounted] = useState(false)
  const [stackImages, setStackImages] = useState<string[][]>([[], [], [], []])

  // Fetch gallery images from Supabase (if configured). If Supabase is not
  // available (missing NEXT_PUBLIC_SUPABASE_KEY), fall back to static images
  // bundled with the site so the Hero still renders during development.
  useEffect(() => {
    const staticFallback = [
      { image: '/assets/IMG_4654.jpeg', text: 'Adventure' },
      { image: '/assets/IMG_6508.jpeg', text: 'Tech Life' },
    ]

    if (!supabase) {
      // Supabase not configured — use fallback images
      // eslint-disable-next-line no-console
      console.warn('Supabase client not available; using static gallery fallback.')
      setGalleryItems(staticFallback)
      distributeImages(staticFallback.map(item => item.image))
      return
    }

    const fetchImages = async () => {
      try {
        const client = supabase
        if (!client) {
          console.warn('Supabase client not available; using static gallery fallback.')
          setGalleryItems(staticFallback)
          distributeImages(staticFallback.map(item => item.image))
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
          distributeImages(staticFallback.map(item => item.image))
          return
        }

        console.log(`Supabase returned ${data?.length || 0} images`)

        if (!data || data.length === 0) {
          console.warn('No images found in Supabase bucket — using fallback')
          setGalleryItems(staticFallback)
          distributeImages(staticFallback.map(item => item.image))
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
        distributeImages(urls.map(item => item.image))
      } catch (err) {
        console.error('Unexpected error fetching images:', err)
        setGalleryItems(staticFallback)
        distributeImages(staticFallback.map(item => item.image))
      }
    }

    fetchImages()
  }, [])

  // Distribute images across 4 stacks ensuring no duplicates
  const distributeImages = (images: string[]) => {
    const minImagesPerStack = 4
    const totalNeeded = minImagesPerStack * 4

    // Ensure we have enough images
    if (images.length < totalNeeded) {
      console.warn(`Not enough images (${images.length}), need at least ${totalNeeded}`)
      // If not enough images, repeat the available ones
      while (images.length < totalNeeded) {
        images = [...images, ...images].slice(0, totalNeeded)
      }
    }

    // Shuffle images to randomize distribution
    const shuffled = [...images].sort(() => Math.random() - 0.5)
    
    // Distribute evenly across 4 stacks
    const stacks: string[][] = [[], [], [], []]
    shuffled.forEach((img, index) => {
      stacks[index % 4].push(img)
    })

    setStackImages(stacks)
  }

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (!mounted) return

    // Set initial states with less extreme offsets
    gsap.set('.scroll-animate[data-animation="slide-right"]', {
      x: 150,
      opacity: 0.3,
      scale: 0.9
    })
    
    gsap.set('.scroll-animate[data-animation="slide-left"]', {
      x: -150, 
      opacity: 0.3,
      scale: 0.9
    })

    // Create scroll-triggered animations
    gsap.utils.toArray('.scroll-animate').forEach((element: any) => {
      const animation = element.getAttribute('data-animation')
      
      let animationProps = {}
      
      switch (animation) {
        case 'slide-right':
          animationProps = { 
            x: 0, 
            opacity: 1, 
            scale: 1,
            ease: "power2.out"
          }
          break
        case 'slide-left':
          animationProps = { 
            x: 0, 
            opacity: 1, 
            scale: 1,
            ease: "power2.out"
          }
          break
        default:
          animationProps = { 
            x: 0, 
            opacity: 1, 
            scale: 1,
            ease: "power2.out"
          }
      }
      
      gsap.to(element, {
        ...animationProps,
        duration: 1.2,
        scrollTrigger: {
          trigger: element,
          start: "top bottom", // Start as soon as element enters viewport
          end: "top center", // Complete by the time element is centered
          scrub: 1, 
          toggleActions: "play reverse play reverse"
        }
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [mounted])

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-0 relative" style={{ zIndex: 20 }}>
        <div className="w-full mx-auto"> 
          <div className="flex flex-col items-center space-y-8">
          
            {/* Name & Title */}
            <div className="text-center">
              <h1 className="text-white mb-2">
                Vineet Jonathan
              </h1>
              <p className="text-lg text-gray-400">
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
            <div className="glass-card-gold rounded-2xl p-6 w-full max-w-4xl mx-auto">
              <p className="text-xl text-gold italic leading-relaxed text-center">
                "Code is poetry, infrastructure is art,<br />
                and disruption is the only constant."
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-gold to-blood-red"></div>
                <span className="text-sm text-gray-400">Always Shipping</span>
              </div>
            </div>
              
            {/* Social links (GitHub, LinkedIn, X, Email) */}
            <div className="flex gap-4">
              <a href="https://github.com/jonathanvineet" target="_blank" rel="noopener noreferrer" className="glass-icon-button text-white hover:scale-110 transition-transform" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"></path></svg>
              </a>
              <a href="https://www.linkedin.com/in/jonathanvineet/" target="_blank" rel="noopener noreferrer" className="glass-icon-button text-white hover:scale-110 transition-transform" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://x.com/jonathan_vineet" target="_blank" rel="noopener noreferrer" className="glass-icon-button text-white hover:scale-110 transition-transform" aria-label="X">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
              </a>
              <a href="mailto:cvineetjonathan@gmail.com" className="glass-icon-button text-white hover:scale-110 transition-transform" aria-label="Email">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11A2.5 2.5 0 0119.5 20h-15A2.5 2.5 0 012 17.5v-11zM4.5 6L12 11l7.5-5"/></svg>
              </a>
            </div>
            
            {/* New Layout: About Me (Left) + 4 Stacks (Right) */}
            <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6 lg:gap-8 mt-12 w-full">
              
              {/* About Me Section - Left Side (40%) */}
              <div 
                className="w-full lg:w-[40%] scroll-animate"
                data-animation="slide-left"
              >
                <div className="glass-card rounded-3xl p-6 sm:p-8">
                  <div className="text-center lg:text-left">
                    <h2 className="text-3xl text-gold mb-6 font-semibold">Me?</h2>
                    <div className="mb-6">

                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                      I'm a passionate engineer and founder who thrives at the intersection of technology and innovation. 
                      With expertise spanning from hardware design to software architecture, I build solutions that make a difference.
                    </p>
                    <p className="text-gray-400 leading-relaxed mb-6">
                      Half engineer.
Half insomniac dream stitched together with ambition.
                    </p>
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                      <div className="w-12 h-0.5 bg-gradient-to-r from-gold to-blood-red"></div>
                      <span className="text-sm text-gray-400">Always Learning</span>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-blood-red to-gold"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Stack Components - Right Side (60%) in 2x2 Grid */}
              <div 
                className="w-full lg:w-[60%] scroll-animate"
                data-animation="slide-right"
              >
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  {/* Stack 1 - Top Left */}
                  <div className="w-full" style={{ height: 'clamp(200px, 25vw, 320px)' }}>
                    {stackImages[0].length > 0 && (
                      <Stack
                        randomRotation
                        sensitivity={200}
                        sendToBackOnClick={true}
                        cards={stackImages[0].map((src, i) => (
                          <img 
                            key={i} 
                            src={src} 
                            alt={`stack1-card-${i + 1}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ))}
                        autoplay
                        autoplayDelay={3000}
                        pauseOnHover={false}
                      />
                    )}
                  </div>

                  {/* Stack 2 - Top Right */}
                  <div className="w-full" style={{ height: 'clamp(200px, 25vw, 320px)' }}>
                    {stackImages[1].length > 0 && (
                      <Stack
                        randomRotation
                        sensitivity={200}
                        sendToBackOnClick={true}
                        cards={stackImages[1].map((src, i) => (
                          <img 
                            key={i} 
                            src={src} 
                            alt={`stack2-card-${i + 1}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ))}
                        autoplay
                        autoplayDelay={3200}
                        pauseOnHover={false}
                      />
                    )}
                  </div>

                  {/* Stack 3 - Bottom Left */}
                  <div className="w-full" style={{ height: 'clamp(200px, 25vw, 320px)' }}>
                    {stackImages[2].length > 0 && (
                      <Stack
                        randomRotation
                        sensitivity={200}
                        sendToBackOnClick={true}
                        cards={stackImages[2].map((src, i) => (
                          <img 
                            key={i} 
                            src={src} 
                            alt={`stack3-card-${i + 1}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ))}
                        autoplay
                        autoplayDelay={3400}
                        pauseOnHover={false}
                      />
                    )}
                  </div>

                  {/* Stack 4 - Bottom Right */}
                  <div className="w-full" style={{ height: 'clamp(200px, 25vw, 320px)' }}>
                    {stackImages[3].length > 0 && (
                      <Stack
                        randomRotation
                        sensitivity={200}
                        sendToBackOnClick={true}
                        cards={stackImages[3].map((src, i) => (
                          <img 
                            key={i} 
                            src={src} 
                            alt={`stack4-card-${i + 1}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ))}
                        autoplay
                        autoplayDelay={3600}
                        pauseOnHover={false}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
