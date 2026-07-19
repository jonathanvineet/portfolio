"use client"

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from '../../styles/Hero.module.css'
import ProjectCard from './ProjectCard'
import { getSoftwareProjects, type Project } from '../lib/githubClient'

export default function Software() {
  const [mounted, setMounted] = useState(false)
  const [softwareProjects, setSoftwareProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    async function fetchProjects() {
      try {
        // Replace 'jonathanvineet' with your actual GitHub username
        // You can also set NEXT_PUBLIC_GITHUB_USERNAME in your .env file
        const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'jonathanvineet'
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN // Optional: for higher rate limits
        
        const projects = await getSoftwareProjects(username, token)
        setSoftwareProjects(projects)
      } catch (error) {
        console.error('Error fetching software projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
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
              <h1 className="text-gold mb-4 text-5xl">Software Projects</h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">Code-Create-Solve-Build</p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold to-blood-red rounded-full"></div>
                <span className="text-sm text-gray-500">Explore</span>
                <div className="w-20 h-0.5 bg-gradient-to-r from-blood-red via-gold to-transparent rounded-full"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 xl:gap-10 w-full justify-items-center transition-all duration-700 ease-in-out">
              {loading ? (
                <div className="col-span-full text-center text-gray-400 animate-pulse">Loading projects...</div>
              ) : softwareProjects.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 opacity-0 animate-fade-in">No software projects found.</div>
              ) : (
                softwareProjects.map((project, index) => (
                  <div 
                    key={project.id}
                    className="opacity-0 animate-fade-in-up"
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <ProjectCard 
                      title={project.title} 
                      description={project.description || ''} 
                      imageUrl={project.imageUrl} 
                      links={{ 
                        github: project.github_url, 
                        demo: project.demo_url || undefined
                      }} 
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

