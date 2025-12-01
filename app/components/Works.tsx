'use client'

import { useState } from 'react'
import styles from '../../styles/Works.module.css'

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce solution with real-time inventory management, secure payment processing, and advanced analytics dashboard.',
    tags: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
    column: 'left'
  },
  {
    id: 2,
    title: 'AI-Powered Analytics',
    description: 'Machine learning platform for predictive analytics with interactive data visualization and automated reporting capabilities.',
    tags: ['Python', 'TensorFlow', 'React', 'D3.js'],
    column: 'left'
  },
  {
    id: 3,
    title: 'Social Media Dashboard',
    description: 'Comprehensive social media management tool with post scheduling, analytics tracking, and multi-platform integration.',
    tags: ['React', 'Firebase', 'Node.js', 'OAuth'],
    column: 'right'
  },
  {
    id: 4,
    title: 'Real-Time Collaboration',
    description: 'WebRTC-based collaboration platform with video conferencing, screen sharing, and synchronized document editing.',
    tags: ['WebRTC', 'Socket.io', 'Vue.js', 'MongoDB'],
    column: 'right'
  },
]

export default function Works() {
  const [expandedColumn, setExpandedColumn] = useState<'left' | 'right' | null>(null)

  const leftProjects = projects.filter(p => p.column === 'left')
  const rightProjects = projects.filter(p => p.column === 'right')

  return (
    <section id="works" className={`${styles.worksContainer} bg-dark-bg`}>
      <h2 className="font-poppins text-gold text-center mb-12">
        Featured Works
      </h2>

      <div className={styles.splitContainer}>
        {/* Left Column */}
        <div 
          className={`${styles.projectColumn} ${
            expandedColumn === 'left' ? styles.expanded : 
            expandedColumn === 'right' ? styles.collapsed : ''
          }`}
          onMouseEnter={() => setExpandedColumn('left')}
          onMouseLeave={() => setExpandedColumn(null)}
        >
          {leftProjects.map(project => (
            <div key={project.id} className={styles.projectCard}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
              <div className={styles.projectTags}>
                {project.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Animated Divider */}
        <div 
          className={`${styles.divider} ${
            expandedColumn === 'left' ? styles.movedRight :
            expandedColumn === 'right' ? styles.movedLeft : ''
          }`}
        ></div>

        {/* Right Column */}
        <div 
          className={`${styles.projectColumn} ${
            expandedColumn === 'right' ? styles.expanded : 
            expandedColumn === 'left' ? styles.collapsed : ''
          }`}
          onMouseEnter={() => setExpandedColumn('right')}
          onMouseLeave={() => setExpandedColumn(null)}
        >
          {rightProjects.map(project => (
            <div key={project.id} className={styles.projectCard}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
              <div className={styles.projectTags}>
                {project.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
