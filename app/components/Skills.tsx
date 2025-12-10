'use client'

import { useEffect, useRef, useState, useMemo, memo } from 'react'
import dynamic from 'next/dynamic'
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, SiPython, SiDocker, SiAmazon, SiGithub, SiGraphql, SiPostgresql, SiMongodb, SiGit, SiJavascript, SiHtml5, SiCss3, SiVite, SiMysql, SiFirebase, SiEthereum, SiSolana, SiOpenai, SiOpencv, SiArduino, SiRaspberrypi } from 'react-icons/si'

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

  // Tech logos for background animation - memoized to prevent recreation on re-renders
  const techLogos = useMemo(() => [
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
  ], [])

  // Map skill names to icons for the tech-stack chips - memoized
  const skillIconMap: Record<string, JSX.Element> = useMemo(() => ({
    'React': <SiReact />,
    'Next.js': <SiNextdotjs />,
    'TypeScript': <SiTypescript />,
    'Tailwind CSS': <SiTailwindcss />,
    'Node.js': <SiNodedotjs />,
    'Python': <SiPython />,
    'Docker': <SiDocker />,
    'AWS': <SiAmazon />,
    'GitHub': <SiGithub />,
    'GraphQL': <SiGraphql />,
    'PostgreSQL': <SiPostgresql />,
    'MongoDB': <SiMongodb />,
    'Git': <SiGit />,
    'JavaScript': <SiJavascript />,
    'HTML5': <SiHtml5 />,
    'CSS3': <SiCss3 />,
    'Vite': <SiVite />,
    'MySQL': <SiMysql />,
    'Firebase': <SiFirebase />,
    'Ethereum': <SiEthereum />,
    'Solana': <SiSolana />,
    'OpenAI': <SiOpenai />,
    'OpenCV': <SiOpencv />,
    'Arduino': <SiArduino />,
    'Raspberry Pi': <SiRaspberrypi />,
    'Solidity': <SiEthereum />,
    'CI/CD': <SiGithub />,
    'Monitoring': <SiGithub />,
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

  // helper: small emoji/icon per category to match the screenshot feel
  function categoryEmoji(category: string) {
    if (category.toLowerCase().includes('language')) return '💻'
    if (category.toLowerCase().includes('frontend')) return '🎨'
    if (category.toLowerCase().includes('backend')) return '⚙️'
    if (category.toLowerCase().includes('database')) return '🗄️'
    if (category.toLowerCase().includes('blockchain')) return '🔗'
    if (category.toLowerCase().includes('ai') || category.toLowerCase().includes('computer')) return '🤖'
    if (category.toLowerCase().includes('embedded') || category.toLowerCase().includes('iot')) return '🛰️'
    if (category.toLowerCase().includes('devops')) return '🛠️'
    return '🔹'
  }

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen relative bg-dark-bg"
    >
      {/* Fixed animated diagonal logo background (denser, programmatic offsets) */}
      {showLogoLoops && (
        <div className="skills-bg-logoloop pointer-events-none fixed inset-0" aria-hidden style={{ zIndex: 0 }}>
          {(() => {
            const totalTracks = 12 // Further reduced from 20 to 12 for faster compilation
            const speedVariants = [120, 100, 140, 110, 90, 130, 80, 105, 95, 125, 98, 135]

            return Array.from({ length: totalTracks }).map((_, trackIdx) => {
              const direction = trackIdx % 2 === 0 ? 'left' : 'right'
              const speed = speedVariants[trackIdx % speedVariants.length]
              // span offsets smoothly from -140% down to +140% so rows cover entire height (and a bit beyond)
              const offsetY = Math.round(-140 + (trackIdx / (totalTracks - 1)) * 280)

              return (
                <div
                  key={`logoloop-${trackIdx}`}
                  style={{
                    position: 'absolute',
                    top: `${offsetY}%`,
                    left: 0,
                    width: '100%',
                    opacity: 0.15,
                    overflow: 'hidden',
                  }}
                >
                  <LogoLoop
                    logos={techLogos}
                    speed={speed}
                    direction={direction}
                    logoHeight={32}
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
      <div className="relative w-full max-w-5xl mx-auto px-8 py-28" style={{ zIndex: 20 }}>
        <h2 className="font-poppins text-gold mb-6 text-center text-4xl">
          Skills & Technologies
        </h2>
        <p className="text-center text-gray-400 italic mb-8">"I collect tools the way some people collect stamps — only shinier."</p>

        <div className="w-full space-y-8 pb-20">
          {Object.entries(groupSkillsByCategory(skills)).map(([category, items]) => (
            <div key={category} className="skill-category">
              <h3 className="font-poppins text-white text-lg mb-4 flex items-center gap-3">
                <span className="category-emoji">{categoryEmoji(category)}</span>
                {category}
              </h3>

              <div className="chips-row flex flex-wrap gap-3">
                {items.map((skill) => {
                  const index = skills.findIndex(s => s.name === skill.name)
                  const IconNode = skillIconMap[skill.name] ?? <SiGithub />

                  return (
                    <div
                      key={skill.name}
                      ref={el => { skillRefs.current[index] = el }}
                      style={{ 
                        transitionDelay: `${index * 30}ms`, // Reduced from 40ms to 30ms for faster reveal
                        willChange: visibleSkills[index] ? 'auto' : 'transform, opacity'
                      }}
                      className={`tech-chip flex items-center gap-3 p-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] cursor-pointer transition-all duration-500 transform ${
                        visibleSkills[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                      } hover:scale-105 hover:shadow-[0_6px_18px_rgba(0,0,0,0.6)]`}
                    >
                      <div className="chip-icon flex items-center justify-center w-10 h-10 rounded-md bg-[rgba(255,255,255,0.03)] text-xl text-white">
                        {IconNode}
                      </div>
                      <div className="flex flex-col text-left">
                        <div className="font-poppins text-white font-semibold text-sm">{skill.name}</div>
                        <div className="font-inter text-xs text-gray-400 uppercase">{skill.category}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Decorative accent */}
          <div className="mt-12 flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blood-red to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  )
}