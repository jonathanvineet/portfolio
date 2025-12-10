'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import PageLoader from '../components/PageLoader'

// Lazy load the entire Skills component
const Skills = dynamic(() => import('../components/Skills'), {
  ssr: false
})

export default function SkillsPage() {
  return (
    <main className="min-h-screen">
      <PageLoader />
      <Suspense fallback={null}>
        <Skills />
      </Suspense>
    </main>
  )
}
