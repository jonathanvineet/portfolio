'use client'

import { useState } from 'react'
import styles from '../../styles/Works.module.css'

export default function Works() {
  const [hoveredSide, setHoveredSide] = useState<'hardware' | 'software' | null>(null)

  return (
    <section className={styles.worksContainer}>
      <div className={styles.titleContainer}>
        <h2 className="font-poppins text-gold">
          PROJECTS
        </h2>
      </div>

      <div className={styles.splitContainer}>
        {/* Hardware & Electronics Projects - Left */}
        <div 
          className={`${styles.projectPanel} ${hoveredSide === 'hardware' ? styles.hovered : ''}`}
          onMouseEnter={() => setHoveredSide('hardware')}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <div 
            className={styles.panelImage}
            style={{
              backgroundImage: `url('/assets/hardware.jpg')`
            }}
          >
            <div className={styles.overlay}></div>
            <div className={styles.textContent}>
              <div className={styles.iconWrapper}>
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className={styles.categoryTitle}>Hardware & Electronics</h3>
              <div className={styles.dividerLine}></div>
              <p className={styles.categorySubtitle}>Building the physical future</p>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className={styles.centerDivider}></div>

        {/* Software & Web3 Projects - Right */}
        <div 
          className={`${styles.projectPanel} ${hoveredSide === 'software' ? styles.hovered : ''}`}
          onMouseEnter={() => setHoveredSide('software')}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <div 
            className={styles.panelImage}
            style={{
              backgroundImage: `url('/assets/software.jpg')`
            }}
          >
            <div className={styles.overlay}></div>
            <div className={styles.textContent}>
              <div className={styles.iconWrapper}>
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className={styles.categoryTitle}>Software & Web3</h3>
              <div className={styles.dividerLine}></div>
              <p className={styles.categorySubtitle}>Crafting digital experiences</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
