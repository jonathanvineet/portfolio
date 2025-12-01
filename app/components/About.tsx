'use client'

import { useEffect, useRef, useState } from 'react'

export default function About() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section 
      id="about"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-dark-bg px-4 py-20"
    >
      <div 
        className={`glass-panel max-w-4xl p-8 md:p-12 rounded-lg transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="font-poppins text-gold mb-6 text-center">
          About Me
        </h2>
        
        <div className="space-y-4">
          <p className="font-inter text-gray-300 leading-relaxed">
            I'm a passionate <span className="text-gold font-semibold">full-stack developer</span> specializing 
            in building exceptional digital experiences. With expertise in modern web technologies, I craft 
            solutions that are not only visually stunning but also highly functional and performant.
          </p>
          
          <p className="font-inter text-gray-300 leading-relaxed">
            My approach combines <span className="text-blood-red font-semibold">technical excellence</span> with 
            creative problem-solving, ensuring every project I undertake pushes the boundaries of what's possible 
            on the web.
          </p>
          
          <p className="font-inter text-gray-300 leading-relaxed">
            When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, 
            and staying ahead of the curve in the ever-evolving world of web development.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="mt-8 flex justify-center space-x-8">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blood-red to-transparent"></div>
        </div>
      </div>
    </section>
  )
}
