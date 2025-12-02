'use client'

import { useEffect, useRef, useState } from 'react'

const skills = [
  { name: 'React', category: 'frontend' },
  { name: 'Next.js', category: 'frontend' },
  { name: 'TypeScript', category: 'language' },
  { name: 'Node.js', category: 'backend' },
  { name: 'Python', category: 'language' },
  { name: 'PostgreSQL', category: 'database' },
  { name: 'MongoDB', category: 'database' },
  { name: 'Docker', category: 'devops' },
  { name: 'AWS', category: 'cloud' },
  { name: 'Git', category: 'tools' },
  { name: 'GraphQL', category: 'backend' },
  { name: 'Tailwind CSS', category: 'frontend' },
]

export default function Skills() {
  const [visibleSkills, setVisibleSkills] = useState<boolean[]>(new Array(skills.length).fill(false))
  const sectionRef = useRef<HTMLElement>(null)
  const skillRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = skillRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleSkills(prev => {
                const newState = [...prev]
                newState[index] = true
                return newState
              })
            }, index * 100) // Stagger the animations
          }
        },
        { threshold: 0.5 }
      )

      if (ref) {
        observer.observe(ref)
      }

      return observer
    })

    return () => {
      observers.forEach((observer, index) => {
        if (skillRefs.current[index]) {
          observer.disconnect()
        }
      })
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center bg-dark-bg px-4 py-20"
    >
      <h2 className="font-poppins text-gold mb-12 text-center">
        Skills & Technologies
      </h2>

      <div className="max-w-5xl w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              ref={el => { skillRefs.current[index] = el }}
              className={`
                glass-panel p-4 rounded-lg text-center cursor-pointer
                transition-all duration-500 transform
                ${visibleSkills[index] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
                }
                hover:scale-105 hover:border-gold hover:shadow-[0_0_15px_rgba(240,192,0,0.6)]
              `}
            >
              <div className="font-poppins text-white font-semibold text-lg">
                {skill.name}
              </div>
              <div className="font-inter text-xs text-gray-400 mt-1 uppercase">
                {skill.category}
              </div>
            </div>
          ))}
        </div>

        {/* Decorative accent */}
        <div className="mt-12 flex justify-center">
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blood-red to-transparent"></div>
        </div>
      </div>
    </section>
  )
}
