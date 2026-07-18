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
}

function normalize(name: string) {
  return name
    .replace(/\.[^./]+$/, '')
    .toLowerCase()
    .replace(/\s+/g, '')
}

export default function Hardware() {
  const [mounted, setMounted] = useState(false)
  const [hardwareProjects, setHardwareProjects] = useState<Project[]>([])
  const [imageMap, setImageMap] = useState<Record<string, string>>({})
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
        const res = await fetch('/api/hardware-projects')
        if (!res.ok) throw new Error('Failed to load hardware projects')
        const data = await res.json()
        setHardwareProjects(data || [])
      } catch (error) {
        console.error('Error fetching hardware projects:', error)
      } finally {
        setLoading(false)
      }
    }

    async function fetchImageMap() {
      if (!supabase) return
      try {
        const { data, error } = await supabase.storage.from('hardware_images').list('', { limit: 200 })
        if (error) throw error
        const map: Record<string, string> = {}
        for (const file of data || []) {
          map[normalize(file.name)] = file.name
        }
        setImageMap(map)
      } catch (error) {
        console.error('Error listing hardware images:', error)
      }
    }

    fetchProjects()
    fetchImageMap()
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

  const getImageUrl = (title: string) => {
    if (!supabase) return '/assets/hardware.jpg'
    const fileName = imageMap[normalize(title)]
    if (!fileName) return '/assets/hardware.jpg'
    const { data } = supabase.storage.from('hardware_images').getPublicUrl(fileName)
    return data.publicUrl
  }

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
              <h1 className="text-blood-red mb-4 text-5xl">Hardware Projects</h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">Physical computing innovations - from embedded systems to robotics, IoT devices to custom electronics</p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-blood-red to-gold rounded-full"></div>
                <span className="text-sm text-gray-500">Build</span>
                <div className="w-20 h-0.5 bg-gradient-to-r from-gold via-blood-red to-transparent rounded-full"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 xl:gap-10 w-full justify-items-center">
              {loading ? (
                <div className="col-span-full text-center text-gray-400">Loading projects...</div>
              ) : hardwareProjects.length === 0 ? (
                <div className="col-span-full text-center text-gray-400">No hardware projects found.</div>
              ) : (
                hardwareProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    title={project.title}
                    description={project.description || ''}
                    imageUrl={getImageUrl(project.title)}
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
