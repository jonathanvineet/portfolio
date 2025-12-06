"use client"

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from '../../styles/Nav.module.css'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/vinee', label: 'Vinee' },
  { href: '/projects', label: 'Projects' },
  { href: '/skills', label: 'Skills' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const navLinksRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])

  // Get active index based on current pathname
  const activeIndex = LINKS.findIndex(link => link.href === pathname)

  // Track scroll for nav background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update indicator position when active index changes
  useEffect(() => {
    function updateIndicator() {
      const activeLink = linkRefs.current[activeIndex]
      const container = navLinksRef.current
      if (activeLink && container) {
        const containerRect = container.getBoundingClientRect()
        const linkRect = activeLink.getBoundingClientRect()
        setIndicatorStyle({
          left: linkRect.left - containerRect.left,
          width: linkRect.width,
        })
      }
    }

    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [activeIndex])

  const handleLinkClick = () => {
    setOpen(false)
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navInner}>
        
        {/* Desktop Links */}
        <div className={styles.navLinks} ref={navLinksRef}>
          <span 
            className={styles.activeIndicator}
            style={{
              transform: `translateX(${indicatorStyle.left}px)`,
              width: `${indicatorStyle.width}px`,
            }}
          />
          {LINKS.map((link, index) => (
            <Link 
              key={link.href} 
              ref={el => { linkRefs.current[index] = el; }}
              href={link.href} 
              className={`${styles.navLink} ${activeIndex === index ? styles.navLinkActive : ''}`}
              onClick={handleLinkClick}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Theme Toggle */}
        <button 
          className={styles.themeToggle}
          aria-label="Toggle theme"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        {/* Mobile Menu Toggle */}
        <button
          aria-label="Toggle menu"
          className={`${styles.mobileToggle} md:hidden`}
          onClick={() => setOpen(!open)}
        >
          <span className={`${styles.hamburger} ${open ? styles.open : ''}`}></span>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ''}`}>
        {LINKS.map((link, index) => (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`${styles.mobileLink} ${activeIndex === index ? styles.mobileLinkActive : ''}`}
            onClick={handleLinkClick}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
