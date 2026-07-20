'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import * as SiIcons from 'react-icons/si'

// Lazy load LogoLoop component to reduce initial bundle size
const LogoLoop = dynamic(() => import('./LogoLoop'), {
  ssr: false,
  loading: () => null
})

const skills = [
  // Core Languages
  { name: 'Python', category: 'Core Languages' },
  { name: 'C', category: 'Core Languages' },
  { name: 'C++', category: 'Core Languages' },
  { name: 'Java', category: 'Core Languages' },
  { name: 'JavaScript', category: 'Core Languages' },
  { name: 'ES6+', category: 'Core Languages' },
  { name: 'TypeScript', category: 'Core Languages' },
  { name: 'Solidity', category: 'Core Languages' },

  // Frontend
  { name: 'React', category: 'Frontend Development' },
  { name: 'Vite', category: 'Frontend Development' },
  { name: 'HTML5', category: 'Frontend Development' },
  { name: 'CSS3', category: 'Frontend Development' },
  { name: 'Tailwind CSS', category: 'Frontend Development' },

  // Backend & APIs
  { name: 'Node.js', category: 'Backend & APIs' },
  { name: 'Express.js', category: 'Backend & APIs' },
  { name: 'Flask', category: 'Backend & APIs' },
  { name: 'REST', category: 'Backend & APIs' },
  { name: 'Websockets', category: 'Backend & APIs' },

  // Databases
  { name: 'MySQL', category: 'Databases' },
  { name: 'MongoDB', category: 'Databases' },
  { name: 'PostgreSQL', category: 'Databases' },
  { name: 'Supabase', category: 'Databases' },
  { name: 'Firebase', category: 'Databases' },

  // Blockchain & Web3
  { name: 'Ethereum', category: 'Blockchain & Web3' },
  { name: 'Solana', category: 'Blockchain & Web3' },
  { name: 'Aptos', category: 'Blockchain & Web3' },
  { name: 'OKX', category: 'Blockchain & Web3' },

  // AI & Computer Vision
  { name: 'OpenAI', category: 'AI & Computer Vision' },
  { name: 'OpenCV', category: 'AI & Computer Vision' },
  { name: 'Tesseract.js', category: 'AI & Computer Vision' },
  { name: 'PDF.js', category: 'AI & Computer Vision' },
  { name: 'QR Processing', category: 'AI & Computer Vision' },

  // Embedded & IoT
  { name: 'Arduino', category: 'Embedded & IoT' },
  { name: 'ESP32', category: 'Embedded & IoT' },
  { name: 'Raspberry Pi', category: 'Embedded & IoT' },
  { name: 'Pixhawk', category: 'Embedded & IoT' },
  { name: 'Drones', category: 'Embedded & IoT' },
  { name: 'Aerial', category: 'Embedded & IoT' },

  // DevOps & Tools
  { name: 'Git', category: 'DevOps & Tools' },
  { name: 'Docker', category: 'DevOps & Tools' },
  { name: 'AWS', category: 'DevOps & Tools' },
  { name: 'CI/CD', category: 'DevOps & Tools' },
  { name: 'Monitoring', category: 'DevOps & Tools' },
]

export default function Skills() {
  const [visibleSkills, setVisibleSkills] = useState<boolean[]>(new Array(skills.length).fill(false))
  const [showLogoLoops, setShowLogoLoops] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const skillRefs = useRef<(HTMLDivElement | null)[]>([])

  // Tech logos for background animation - memoized to prevent recreation on re-renders.
  // A much bigger, more varied pool means adjacent rows rarely repeat the same
  // sequence, so the diagonal field reads as dense and organic rather than a
  // handful of icons looping in a visible pattern.
  const techLogos = useMemo(() => [
    { node: <SiIcons.SiReact />, title: "React" },
    { node: <SiIcons.SiNextdotjs />, title: "Next.js" },
    { node: <SiIcons.SiTypescript />, title: "TypeScript" },
    { node: <SiIcons.SiJavascript />, title: "JavaScript" },
    { node: <SiIcons.SiTailwindcss />, title: "Tailwind" },
    { node: <SiIcons.SiHtml5 />, title: "HTML5" },
    { node: <SiIcons.SiCss3 />, title: "CSS3" },
    { node: <SiIcons.SiVite />, title: "Vite" },
    { node: <SiIcons.SiNodedotjs />, title: "Node.js" },
    { node: <SiIcons.SiExpress />, title: "Express" },
    { node: <SiIcons.SiFlask />, title: "Flask" },
    { node: <SiIcons.SiPython />, title: "Python" },
    { node: <SiIcons.SiC />, title: "C" },
    { node: <SiIcons.SiCplusplus />, title: "C++" },
    { node: <SiIcons.SiOpenjdk />, title: "Java" },
    { node: <SiIcons.SiDocker />, title: "Docker" },
    { node: <SiIcons.SiAmazon />, title: "AWS" },
    { node: <SiIcons.SiGithub />, title: "GitHub" },
    { node: <SiIcons.SiGit />, title: "Git" },
    { node: <SiIcons.SiGraphql />, title: "GraphQL" },
    { node: <SiIcons.SiMysql />, title: "MySQL" },
    { node: <SiIcons.SiPostgresql />, title: "PostgreSQL" },
    { node: <SiIcons.SiMongodb />, title: "MongoDB" },
    { node: <SiIcons.SiSupabase />, title: "Supabase" },
    { node: <SiIcons.SiFirebase />, title: "Firebase" },
    { node: <SiIcons.SiEthereum />, title: "Ethereum" },
    { node: <SiIcons.SiSolana />, title: "Solana" },
    { node: <SiIcons.SiSolidity />, title: "Solidity" },
    { node: <SiIcons.SiOpenai />, title: "OpenAI" },
    { node: <SiIcons.SiOpencv />, title: "OpenCV" },
    { node: <SiIcons.SiArduino />, title: "Arduino" },
    { node: <SiIcons.SiEspressif />, title: "ESP32" },
    { node: <SiIcons.SiRaspberrypi />, title: "Raspberry Pi" },
    { node: <SiIcons.SiSocketdotio />, title: "Websockets" },
  ], [])

  // Map skill names to icons for the tech-stack chips - memoized
  const skillIconMap: Record<string, JSX.Element> = useMemo(() => ({
    'React': <SiIcons.SiReact />,
    'Next.js': <SiIcons.SiNextdotjs />,
    'TypeScript': <SiIcons.SiTypescript />,
    'Tailwind CSS': <SiIcons.SiTailwindcss />,
    'Node.js': <SiIcons.SiNodedotjs />,
    'Python': <SiIcons.SiPython />,
    'Docker': <SiIcons.SiDocker />,
    'AWS': <SiIcons.SiAmazon />,
    'GitHub': <SiIcons.SiGithub />,
    'GraphQL': <SiIcons.SiGraphql />,
    'PostgreSQL': <SiIcons.SiPostgresql />,
    'MongoDB': <SiIcons.SiMongodb />,
    'Git': <SiIcons.SiGit />,
    'JavaScript': <SiIcons.SiJavascript />,
    'HTML5': <SiIcons.SiHtml5 />,
    'CSS3': <SiIcons.SiCss3 />,
    'Vite': <SiIcons.SiVite />,
    'MySQL': <SiIcons.SiMysql />,
    'Firebase': <SiIcons.SiFirebase />,
    'Ethereum': <SiIcons.SiEthereum />,
    'Solana': <SiIcons.SiSolana />,
    'OpenAI': <SiIcons.SiOpenai />,
    'OpenCV': <SiIcons.SiOpencv />,
    'Arduino': <SiIcons.SiArduino />,
    'Raspberry Pi': <SiIcons.SiRaspberrypi />,
    'Solidity': <SiIcons.SiEthereum />,
    'CI/CD': <SiIcons.SiGithub />,
    'Monitoring': <SiIcons.SiGithub />,
  }), [])

  useEffect(() => {
    // Delay showing logo loops to improve initial render performance
    const timer = setTimeout(() => setShowLogoLoops(true), 300) // Increased delay slightly
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Use a single observer on the section: when the Skills section becomes
    // visible, reveal all chips at once. This removes many per-chip observers
    // and avoids long staggered load times.
    if (!sectionRef.current) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reveal all skills immediately, but we'll still use CSS transition-delay
          // per-chip so they animate in quickly without long JS timeouts.
          setVisibleSkills(new Array(skills.length).fill(true))
          obs.disconnect()
        }
      },
      { threshold: 0.12 }
    )

    obs.observe(sectionRef.current)

    return () => obs.disconnect()
  }, [])

  // helper: group skills by category
  function groupSkillsByCategory(list: { name: string; category: string }[]) {
    return list.reduce<Record<string, { name: string; category: string }[]>>((acc, s) => {
      if (!acc[s.category]) acc[s.category] = []
      acc[s.category].push(s)
      return acc
    }, {})
  }

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen relative bg-dark-bg"
    >
      {/* Fixed animated diagonal logo background (denser, programmatic offsets) */}
      {showLogoLoops && (
        <div className="skills-bg-logoloop pointer-events-none fixed inset-0 hidden sm:block" aria-hidden style={{ zIndex: 0 }}>
          {(() => {
            const totalTracks = 18 // denser field of icons
            const speedVariants = [120, 100, 140, 110, 90, 130, 80, 105, 95, 125, 98, 135, 115, 88, 142, 102, 128, 92]

            return Array.from({ length: totalTracks }).map((_, trackIdx) => {
              const direction = trackIdx % 2 === 0 ? 'left' : 'right'
              const speed = speedVariants[trackIdx % speedVariants.length]
              // span offsets smoothly from -140% down to +140% so rows cover entire height (and a bit beyond)
              const offsetY = Math.round(-140 + (trackIdx / (totalTracks - 1)) * 280)
              // Rotate each row's slice of the logo pool so neighboring rows
              // don't show the same icons in the same order.
              const rotation = (trackIdx * 7) % techLogos.length
              const rowLogos = [...techLogos.slice(rotation), ...techLogos.slice(0, rotation)]
              // Per-row size/opacity/float variance for a more organic, less
              // uniform-grid feel.
              const logoHeight = 24 + ((trackIdx * 5) % 20)
              const opacity = 0.1 + ((trackIdx * 3) % 10) / 60
              const floatOffset = 8 + ((trackIdx * 11) % 18)
              const floatDuration = 7 + ((trackIdx * 4) % 10)
              const floatDelay = -((trackIdx * 2) % floatDuration)

              return (
                <div
                  key={`logoloop-${trackIdx}`}
                  className="skills-bg-row"
                  style={{
                    position: 'absolute',
                    top: `${offsetY}%`,
                    left: 0,
                    width: '100%',
                    opacity,
                    overflow: 'hidden',
                    ['--float-offset' as string]: `${floatOffset}px`,
                    ['--float-duration' as string]: `${floatDuration}s`,
                    ['--float-delay' as string]: `${floatDelay}s`,
                  }}
                >
                  <LogoLoop
                    logos={rowLogos}
                    speed={speed}
                    direction={direction}
                    logoHeight={logoHeight}
                    gap={40}
                    hoverSpeed={speed}
                    fadeOut={false}
                    ariaLabel={`Tech logos row ${trackIdx + 1}`}
                  />
                </div>
              )
            })
          })()}
        </div>
      )}

      {/* Fixed glass panel background - independent layer */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none px-4 w-full flex justify-center" style={{ zIndex: 1 }}>
        <div className="glass-panel rounded-2xl w-full max-w-5xl h-[85vh]"></div>
      </div>

      {/* Scrollable content - starts at top, visible above glass */}
      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28" style={{ zIndex: 20 }}>
        <h2 className="text-gold mb-6 text-center text-3xl sm:text-4xl">
          Skills & Technologies
        </h2>
        <p className="text-center text-gray-400 italic mb-8">"I collect tools the way some people collect stamps — only shinier."</p>

        <div className="w-full space-y-8 pb-20">
          {Object.entries(groupSkillsByCategory(skills)).map(([category, items]) => (
            <div key={category} className="skill-category">
              <h3 className="text-white text-lg mb-4">
                {category}
              </h3>

              <div className="chips-row flex flex-wrap gap-3">
                {items.map((skill) => {
                  const index = skills.findIndex(s => s.name === skill.name)
                  const IconNode = skillIconMap[skill.name] ?? <SiIcons.SiGithub />

                  return (
                    <div
                      key={skill.name}
                      ref={el => { skillRefs.current[index] = el }}
                      style={{ 
                        transitionDelay: `${index * 30}ms`, // Reduced from 40ms to 30ms for faster reveal
                        willChange: visibleSkills[index] ? 'auto' : 'transform, opacity'
                      }}
                      className={`glass-chip flex items-center gap-3 transition-all duration-500 transform ${
                        visibleSkills[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                      }`}
                    >
                      <div className="chip-icon flex items-center justify-center w-10 h-10 rounded-md bg-[rgba(255,255,255,0.05)] text-xl text-white">
                        {IconNode}
                      </div>
                      <div className="flex flex-col text-left">
                        <div className="font-poppins text-white font-semibold text-sm">{skill.name}</div>
                        <div className="font-inter text-xs text-gray-400 uppercase tracking-wide">{skill.category}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Decorative accent */}
          <div className="mt-12 flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blood-red to-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}