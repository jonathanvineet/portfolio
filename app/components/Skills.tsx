'use client'

import { useEffect, useRef, useState } from 'react'
import LogoLoop from './LogoLoop'
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, SiPython, SiDocker, SiAmazon, SiGithub, SiGraphql, SiPostgresql, SiMongodb, SiGit } from 'react-icons/si'

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

  // Tech logos for background animation
  const techLogos = [
    { node: <SiReact />, title: "React" },
    { node: <SiNextdotjs />, title: "Next.js" },
    { node: <SiTypescript />, title: "TypeScript" },
    { node: <SiTailwindcss />, title: "Tailwind" },
    { node: <SiNodedotjs />, title: "Node.js" },
    { node: <SiPython />, title: "Python" },
    { node: <SiDocker />, title: "Docker" },
    { node: <SiAmazon />, title: "AWS" },
    { node: <SiGithub />, title: "GitHub" },
    { node: <SiGraphql />, title: "GraphQL" },
    { node: <SiPostgresql />, title: "PostgreSQL" },
    { node: <SiMongodb />, title: "MongoDB" },
    { node: <SiGit />, title: "Git" },
  ]

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
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center bg-dark-bg px-4 py-20"
    >
      {/* Animated diagonal logo loops using LogoLoop component */}
      <div className="skills-bg-logoloop pointer-events-none" aria-hidden>
        {Array.from({ length: 30 }).map((_, trackIdx) => {
          const direction = trackIdx % 2 === 0 ? 'left' : 'right'
          const speed = [120, 100, 140, 110, 90, 130, 80, 105, 95, 125, 98, 135, 75, 115, 88, 145, 82, 108, 122, 102, 92, 128, 85, 112, 96, 124, 86, 138, 78, 106][trackIdx % 30]
          const offsetY = [-120,-112,-104,-96,-88,-80,-72,-64,-56,-48,-40,-32,-24,-16,-8,0,8,16,24,32,40,48,56,64,72,80,88,96,104,112][trackIdx % 30]
          
          return (
            <div
              key={`logoloop-${trackIdx}`}
              style={{
                position: 'absolute',
                top: `${offsetY}%`,
                left: '-10%',
                width: '220%',
                opacity: 0.2
              }}
            >
              <LogoLoop
                logos={techLogos}
                speed={speed}
                direction={direction}
                logoHeight={20}
                gap={24}
                hoverSpeed={0}
                fadeOut={false}
                ariaLabel={`Tech logos row ${trackIdx + 1}`}
              />
            </div>
          )
        })}
      </div>
      <div className="glass-panel p-8 rounded-2xl w-full max-w-5xl relative z-20">
        <h2 className="font-poppins text-gold mb-8 text-center">
          Skills & Technologies
        </h2>

        <div className="w-full">
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
      </div>

        {/* Decorative accent */}
        <div className="mt-12 flex justify-center">
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blood-red to-transparent"></div>
        </div>
      </div>
    </section>
  )
}
