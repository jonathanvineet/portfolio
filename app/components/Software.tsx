"use client"

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from '../../styles/Hero.module.css'
import ProjectCard from './ProjectCard'

export default function Software() {
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

  const softwareProjects = [
    { title: 'AI-Powered Chat', description: 'Real-time chat application with AI-driven responses and sentiment analysis', imageUrl: '/assets/iot.svg', links: { github: 'https://github.com/jonathanvineet', demo: '#', twitter: 'https://x.com/jonathan_vineet' } },
    { title: 'Web3 DApp', description: 'Decentralized application for NFT marketplace with smart contracts', imageUrl: '/assets/iot.svg', links: { github: 'https://github.com/jonathanvineet', demo: '#' } },
    { title: 'Cloud Platform', description: 'Full-stack cloud infrastructure management dashboard with analytics', imageUrl: '/assets/iot.svg', links: { github: 'https://github.com/jonathanvineet', demo: '#', twitter: 'https://x.com/jonathan_vineet' } },
    { title: 'ML Analytics', description: 'Machine learning pipeline for data analytics and predictive modeling', imageUrl: '/assets/iot.svg', links: { github: 'https://github.com/jonathanvineet', demo: '#' } },
    { title: 'API Gateway', description: 'Scalable microservices API gateway with load balancing and caching', imageUrl: '/assets/iot.svg', links: { github: 'https://github.com/jonathanvineet', demo: '#', twitter: 'https://x.com/jonathan_vineet' } },
    { title: 'DevOps Suite', description: 'CI/CD automation tools with Docker and Kubernetes orchestration', imageUrl: '/assets/iot.svg', links: { github: 'https://github.com/jonathanvineet', demo: '#' } },
  ]

  return (
    <section
      className={styles.heroContainer + ' bg-dark-bg bg-fixed relative'}
      style={{
        backgroundAttachment: 'fixed',
        backgroundImage: `linear-gradient(rgba(10,10,12,0.55), rgba(10,10,12,0.55)), url(/assets/softwareprojects.jpeg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {mounted && portalRoot ? createPortal(fixedBackgrounds, portalRoot) : fixedBackgrounds}

      <div className="container mx-auto px-6 py-20 relative" style={{ zIndex: 20 }}>
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-12">
            <div className="text-center mb-8">
              <h1 className="font-poppins text-gold mb-4 text-5xl">Software Projects</h1>
              <p className="font-inter text-lg text-gray-400 max-w-2xl mx-auto">Innovative solutions built with cutting-edge technologies - from AI to blockchain, cloud infrastructure to data analytics</p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold to-blood-red"></div>
                <span className="font-inter text-sm text-gray-500">Explore</span>
                <div className="w-20 h-0.5 bg-gradient-to-r from-blood-red via-gold to-transparent"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 xl:gap-10 w-full justify-items-center">
              {softwareProjects.map((project, index) => (
                <ProjectCard key={index} title={project.title} description={project.description} imageUrl={project.imageUrl} links={project.links} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

