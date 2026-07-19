'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from '../../styles/Hero.module.css'
import CircularGallery from './CircularGallery'
import { supabase } from '../lib/supabaseClient'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Hero() {
  const [galleryItems, setGalleryItems] = useState<{ image: string; text: string }[]>([])
  const [mounted, setMounted] = useState(false)
  const [activeLine, setActiveLine] = useState(0)

  const cinematicLines = [
    "Code is poetry. Infrastructure is art.",
    "Building beautiful things quietly.",
    "I romanticize the future and build pieces of it in the dark.",
    "Machines obey logic. Humans don't. That's why both fascinate me.",
    "Some men inherit empires. I build mine from circuitry and sleepless nights.",
    "Elegant chaos in a black hoodie.",
    "By day, I build systems. By night, I chase impossible ideas.",
    "Not everything I build is code. Some things are meant to be felt.",
    "Too curious for ordinary things.",
    "Built in silence. Driven by obsession.",
    "Somewhere between poetry and machines.",
    "The future has always fascinated me more than the present.",
    "I build things that feel like tomorrow.",
    "A mind too loud for ordinary ambitions.",
    "Every system tells a story.",
    "Luxury isn't gold. It's precision.",
    "I like impossible problems.",
    "Dark rooms. Bright ideas.",
    "Engineering with cinematic intent.",
    "Obsessed with things that shouldn't work.",
    "Quiet people build loud futures.",
    "Ambition dressed as elegance.",
    "The best ideas arrive after midnight.",
    "Disruption is the only constant.",
    "Beautiful things are engineered twice.",
    "Precision is a form of luxury.",
    "I don't chase trends. I chase permanence.",
    "Every empire starts as an idea nobody believed in.",
    "Built from caffeine and impossible standards.",
    "Dreaming in systems and skylines.",
    "I prefer depth over noise.",
    "The aesthetic matters.",
    "Technology should feel cinematic.",
    "I build things I'd want to exist.",
    "Quiet ambition is still ambition.",
    "The mind never really sleeps.",
    "I admire elegant systems.",
    "Art disguised as engineering.",
    "Nothing great was ever built comfortably.",
    "A little obsessed with the future.",
    "Ideas deserve beautiful execution.",
    "The details are everything.",
    "Thinking beyond the obvious.",
    "Built with intent.",
    "Future-first. Always.",
    "There is poetry in precision.",
  ]

  // Fetch gallery images from Supabase (if configured). If Supabase is not
  // available (missing NEXT_PUBLIC_SUPABASE_KEY), fall back to static images
  // bundled with the site so the Hero still renders during development.
  useEffect(() => {
    const staticFallback = [
      { image: '/assets/IMG_4654.jpeg', text: '' },
      { image: '/assets/IMG_6508.jpeg', text: '' },
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
              text: '', // No label text
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

  // Rotating cinematic quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLine((prev) => (prev + 1) % cinematicLines.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [cinematicLines.length])

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
              
            {/* Cinematic Rotating Quote */}
            <div className="glass-card-gold rounded-3xl p-8 md:p-10 w-full max-w-5xl mx-auto overflow-hidden relative border border-yellow-500/10">
              {/* Animated glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,200,0,0.08),transparent_70%)] animate-pulse" />

              {/* Floating blur orb */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 blur-3xl rounded-full" />

              {/* Quote */}
              <div className="relative min-h-[70px] sm:min-h-[90px] flex items-center justify-center">
                <p
                  key={activeLine}
                  className="text-center text-gold italic text-base sm:text-xl md:text-3xl leading-relaxed px-4 animate-cinematicQuote"
                >
                  "{cinematicLines[activeLine]}"
                </p>
              </div>

              {/* Bottom detail */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent"></div>

                <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
                  Always Building
                </span>

                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent"></div>
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
            <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6 lg:gap-8 mt-24 w-full">
              
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

              {/* Circular Gallery - Right Side (60%) */}
              <div 
                className="w-full lg:w-[60%] scroll-animate"
                data-animation="slide-right"
              >
                <div className="mt-0 lg:-mt-20" style={{ height: 'clamp(260px, 60vw, 400px)', position: 'relative' }}>
                  <CircularGallery
                    items={galleryItems}
                    bend={3} 
                    textColor="#ffffff" 
                    borderRadius={0.05} 
                    scrollEase={0.02}
                    autoPlay={true}
                    autoPlaySpeed={0.05}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
