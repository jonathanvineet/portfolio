"use client"

import { useState, useEffect } from 'react'
import styles from '../../styles/Nav.module.css'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { href: '#home', label: 'About' },
    { href: '#about', label: 'Blog' },
    { href: '#works', label: 'Projects' },
    { href: '#skills', label: 'Photos' },
  ]

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navInner}>
        
        {/* Desktop Links */}
        <div className={styles.navLinks}>
          {links.map(link => (
            <a 
              key={link.href} 
              href={link.href} 
              className={styles.navLink}
            >
              {link.label}
            </a>
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
        {links.map(link => (
          <a 
            key={link.href} 
            href={link.href} 
            className={styles.mobileLink}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
