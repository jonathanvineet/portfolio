'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import styles from '../../styles/ProjectCard.module.css'

interface ProjectCardProps {
  title: string
  description: string
  imageUrl?: string
  links?: {
    github?: string
    demo?: string
    twitter?: string
  }
}

export default function ProjectCard({
  title,
  description,
  imageUrl,
  links = {}
}: ProjectCardProps) {
  const [showModal, setShowModal] = useState(false)

  const modal = showModal && (
    <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={() => setShowModal(false)} aria-label="Close">
          ×
        </button>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className={styles.modalImage}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = '/assets/software.jpg'
            }}
          />
        )}
        <h2 className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalDescription}>{description}</p>
        {(links.github || links.demo || links.twitter) && (
          <div className={styles.modalLinks}>
            {links.github && (
              <a href={links.github} target="_blank" rel="noopener noreferrer" className={styles.modalLink}>
                GitHub
              </a>
            )}
            {links.demo && (
              <a href={links.demo} target="_blank" rel="noopener noreferrer" className={styles.modalLink}>
                Demo
              </a>
            )}
            {links.twitter && (
              <a href={links.twitter} target="_blank" rel="noopener noreferrer" className={styles.modalLink}>
                Twitter
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className={styles.parent}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={`${styles.circle} ${styles.circle1}`}></span>
          <span className={`${styles.circle} ${styles.circle2}`}></span>
          <span className={`${styles.circle} ${styles.circle3}`}></span>
          <span className={`${styles.circle} ${styles.circle4}`}></span>
          <span className={`${styles.circle} ${styles.circle5}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 32" className={styles.svg}>
              <path d="M2,2 L10,2 L18,30 L10,30 Z" fill="currentColor"></path>
              <path d="M20,2 L28,2 Q33,16 28,30 L20,30 Q25,16 20,2 Z" fill="currentColor"></path>
            </svg>
          </span>
        </div>
        
        <div className={styles.cardImage}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className={styles.projectImage}
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = '/assets/software.jpg'
              }}
            />
          )}
        </div>
        
        <div className={styles.glass}></div>
        
        <div className={styles.content}>
          <span className={styles.title}>{title}</span>
          <span className={styles.text}>{description}</span>
        </div>
        
        <div className={styles.bottom}>
          <div className={styles.socialButtonsContainer}>
            {links.github && (
              <button 
                className={styles.socialButton}
                onClick={() => window.open(links.github, '_blank')}
              >
                <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
                  <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                </svg>
              </button>
            )}
            {links.twitter && (
              <button 
                className={styles.socialButton}
                onClick={() => window.open(links.twitter, '_blank')}
              >
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
                  <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                </svg>
              </button>
            )}
            {links.demo && (
              <button 
                className={styles.socialButton}
                onClick={() => window.open(links.demo, '_blank')}
              >
                <svg viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
                  <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"></path>
                </svg>
              </button>
            )}
          </div>
          
          <div className={styles.viewMore}>
            <button
              className={styles.viewMoreButton}
              onClick={(e) => {
                e.stopPropagation()
                setShowModal(true)
              }}
            >
              View more
            </button>
            <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </div>
        </div>
      </div>
      {typeof document !== 'undefined' && modal ? createPortal(modal, document.body) : null}
    </div>
  )
}
