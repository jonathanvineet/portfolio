'use client'

import styles from '../../styles/Hero.module.css'
import CircularGallery from './CircularGallery'

export default function Hero() {
  const galleryItems = [
    { image: '/assets/0AC2FC8E-39F9-4EAD-9458-2D1B5FECD0DC.jpeg', text: 'Adventure' },
    { image: 'https://picsum.photos/seed/2/800/600', text: 'Tech Life' },
    { image: 'https://picsum.photos/seed/3/800/600', text: 'Events' },
    { image: 'https://picsum.photos/seed/4/800/600', text: 'Moments' },
    { image: 'https://picsum.photos/seed/5/800/600', text: 'Journey' },
    { image: 'https://picsum.photos/seed/6/800/600', text: 'Innovation' },
  ]

  return (
    <section className={`${styles.heroContainer} bg-dark-bg relative overflow-hidden`}>
      {/* Floating glow particles */}
      <div className={styles.floatingGlow}></div>
      <div className={styles.floatingGlow}></div>
      <div className={styles.floatingGlow}></div>
      <div className={styles.floatingGlow}></div>
      
      <div className="container mx-auto px-6 h-full flex items-center">
        <div className={`${styles.heroGlass} w-full`}> 
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">
          
          {/* Left Side - Profile Info */}
          <div className="space-y-8">
            {/* Profile Image with rings */}
            <div className="flex items-start gap-6">
              <div className={styles.profileContainer}>
                <img 
                  src="/assets/0AC2FC8E-39F9-4EAD-9458-2D1B5FECD0DC.jpeg" 
                  alt="Profile" 
                  className={styles.profileImage}
                />
                {/* Pulsing rings */}
                <span className={styles.pulseRingGold}></span>
                <span className={styles.pulseRingRed}></span>
              </div>
              
              <div>
                <h1 className="font-poppins text-white mb-2">
                  Vineet Jonathan
                </h1>
                <p className="font-inter text-lg text-gray-400">
                  Engineer & Founder
                </p>
              </div>
            </div>
            
            {/* Badass Quote */}
            <div className={`${styles.quoteCard} glass-panel rounded-2xl p-6 border border-white/10`}>
              <p className="font-poppins text-xl text-gold italic leading-relaxed">
                "Code is poetry, infrastructure is art,<br />
                and disruption is the only constant."
              </p>
              <div className="mt-4 flex items-center gap-2">
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
          </div>
          
          {/* Right Side - Circular Gallery */}
          <div className="relative h-[600px] hidden lg:block">
              <CircularGallery 
                items={galleryItems}
                bend={0} /* straight movement, no curve */
                textColor="#F0C000"
                borderRadius={0.0} /* no rounded label boxes */
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
