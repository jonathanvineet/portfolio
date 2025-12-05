"use client"

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from '../../styles/Hero.module.css'
import ProjectCard from './ProjectCard'

export default function Hardware() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

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

  const fixedBackgrounds = (
    <>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className={styles.floatingGlow}></div>
        <div className={styles.floatingGlow}></div>
        <div className={styles.floatingGlow}></div>
        <div className={styles.floatingGlow}></div>
      </div>
    </>
  )

  const hardwareProjects = [
    { title: 'Autonomous Drone', description: 'Self-navigating drone with computer vision and obstacle avoidance', imageUrl: '/assets/iot.svg', links: { github: 'https://github.com/jonathanvineet', demo: '#', twitter: 'https://x.com/jonathan_vineet' } },
    { title: 'IoT Smart Home', description: 'Integrated home automation system with ESP32 and sensors', imageUrl: '/assets/iot.svg', links: { github: 'https://github.com/jonathanvineet', demo: '#' } },
    { title: 'Robotics Arm', description: 'Precision 6-axis robotic arm with inverse kinematics control', imageUrl: '/assets/iot.svg', links: { github: 'https://github.com/jonathanvineet', demo: '#', twitter: 'https://x.com/jonathan_vineet' } },
    { title: 'Weather Station', description: 'Arduino-based weather monitoring with cloud data logging', imageUrl: '/assets/iot.svg', links: { github: 'https://github.com/jonathanvineet', demo: '#' } },
    { title: 'RFID Access', description: 'Secure access control system with biometric authentication', imageUrl: '/assets/iot.svg', links: { github: 'https://github.com/jonathanvineet', demo: '#', twitter: 'https://x.com/jonathan_vineet' } },
    { title: '3D Printer', description: 'Custom-built FDM 3D printer with auto-bed leveling', imageUrl: '/assets/iot.svg', links: { github: 'https://github.com/jonathanvineet', demo: '#' } },
  ]

  return (
    <section
      className={styles.heroContainer + ' bg-dark-bg bg-fixed relative'}
      style={{
        backgroundAttachment: 'fixed',
        backgroundImage: `linear-gradient(rgba(10,10,12,0.55), rgba(10,10,12,0.55)), url(/assets/hardwareprojects.jpeg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {mounted && portalRoot ? createPortal(fixedBackgrounds, portalRoot) : fixedBackgrounds}

      <div className="container mx-auto px-6 py-20 relative" style={{ zIndex: 20 }}>
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-12">
            <div className="text-center mb-8">
              <h1 className="font-poppins text-blood-red mb-4 text-5xl">Hardware Projects</h1>
              <p className="font-inter text-lg text-gray-400 max-w-2xl mx-auto">Physical computing innovations - from embedded systems to robotics, IoT devices to custom electronics</p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-blood-red to-gold"></div>
                <span className="font-inter text-sm text-gray-500">Build</span>
                <div className="w-20 h-0.5 bg-gradient-to-r from-gold via-blood-red to-transparent"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 xl:gap-10 w-full justify-items-center">
              {hardwareProjects.map((project, index) => (
                <ProjectCard key={index} title={project.title} description={project.description} imageUrl={project.imageUrl} links={project.links} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
