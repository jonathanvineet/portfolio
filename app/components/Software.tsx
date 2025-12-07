"use client"

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from '../../styles/Hero.module.css'
import ProjectCard from './ProjectCard'
import { supabase } from '../lib/supabaseClient'

interface Project {
  id: string
  title: string
  description: string
  image_name: string
  github_url: string | null
  demo_url: string | null
  twitter_url: string | null
  type: string
  created_at: string
}

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
      if (!supabase) {
        console.error('Supabase client not initialized')
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('type', 'software')
          .order('created_at', { ascending: false })

        if (error) throw error
        setSoftwareProjects(data || [])
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

  const getImageUrl = (imageName: string) => {
    if (!supabase) return '/assets/iot.svg'
    const { data } = supabase.storage.from('projects').getPublicUrl(imageName)
    return data.publicUrl
  }

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
              {loading ? (
                <div className="col-span-full text-center text-gray-400">Loading projects...</div>
              ) : softwareProjects.length === 0 ? (
                <div className="col-span-full text-center text-gray-400">No software projects found.</div>
              ) : (
                softwareProjects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    title={project.title} 
                    description={project.description || ''} 
                    imageUrl={getImageUrl(project.image_name)} 
                    links={{ 
                      github: project.github_url || undefined, 
                      demo: project.demo_url || undefined, 
                      twitter: project.twitter_url || undefined 
                    }} 
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

