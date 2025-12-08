'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface Poem {
  id: string
  title: string
  content: string
  image_name: string | null
  created_at: string
}

export default function Poetry() {
  const [poems, setPoems] = useState<Poem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null)

  useEffect(() => {
    async function fetchPoems() {
      if (!supabase) {
        console.error('Supabase client not initialized')
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('poems')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setPoems(data || [])
      } catch (error) {
        console.error('Error fetching poems:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPoems()
  }, [])

  const getImageUrl = (imageName: string | null) => {
    if (!imageName || !supabase) {
      console.log('No image or supabase:', { imageName, hasSupabase: !!supabase })
      return null
    }
    const { data } = supabase.storage.from('poem').getPublicUrl(imageName)
    console.log('Image URL generated:', data.publicUrl)
    return data.publicUrl
  }

  const getExcerpt = (content: string, maxLength: number = 60) => {
    const words = content.split(' ')
    const excerpt = words.slice(0, Math.min(8, words.length)).join(' ')
    return excerpt.length > maxLength ? excerpt.substring(0, maxLength) + '...' : excerpt + '...'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.getFullYear()
  }

  return (
    <main className="min-h-screen bg-dark-bg py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="font-poppins text-gold text-5xl mb-4">Poetry</h1>
          <p className="font-inter text-lg text-gray-400 max-w-2xl mx-auto">
            Words woven into emotions, thoughts captured in verse
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold to-purple-500"></div>
            <span className="font-inter text-sm text-gray-500">Explore</span>
            <div className="w-20 h-0.5 bg-gradient-to-r from-purple-500 via-gold to-transparent"></div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading poems...</div>
        ) : poems.length === 0 ? (
          <div className="text-center text-gray-400 py-20">No poems found yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
            {poems.map((poem) => {
              const imageUrl = getImageUrl(poem.image_name)
              console.log('Poem:', poem.title, 'Image Name:', poem.image_name, 'URL:', imageUrl)
              
              return (
                <div
                  key={poem.id}
                  className="w-[200px] h-[300px] relative rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-white/20"
                  onClick={() => setSelectedPoem(poem)}
                >
                  {/* Debug info */}
                  {!imageUrl && (
                    <div className="absolute top-2 left-2 text-xs text-red-500 bg-black/70 p-1 rounded z-50">
                      No image: {poem.image_name || 'null'}
                    </div>
                  )}
                  
                  {/* Main background image - full card */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: imageUrl ? `url("${imageUrl}")` : 'none',
                      backgroundColor: !imageUrl ? '#2d2d2d' : 'transparent',
                      filter: imageUrl ? 'grayscale(100%)' : 'none'
                    }}
                  ></div>

                  {/* Spinning gradient circle - only show when no image */}
                  {!imageUrl && (
                    <div className="w-full h-full flex items-center justify-center absolute">
                      <div
                        className="w-32 h-32 rounded-full bg-gradient-to-tr from-gray-500 to-gray-300 animate-spin opacity-40"
                        style={{ animationDuration: '12s' }}
                      ></div>
                    </div>
                  )}

                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50"></div>

                  {/* Content overlay */}
                  <div className="w-full h-full p-2 flex justify-between relative z-10">
                    <div className="w-3/5 p-2 pt-3 pb-1.5 flex flex-col rounded-xl backdrop-blur-md bg-black/30 text-white font-medium font-mono shadow-lg border border-white/10">
                      <span className="text-xl font-medium truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" title={poem.title}>
                        {poem.title}
                      </span>
                      <span className="text-xs text-gray-100 line-clamp-3 mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {getExcerpt(poem.content)}
                      </span>
                      <div className="w-full mt-auto flex items-center justify-center">
                        <span className="text-xs text-gray-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{formatDate(poem.created_at)}</span>
                      </div>
                    </div>
                    <div className="h-full pt-2 flex flex-col items-end text-white">
                      <span className="text-[10px] leading-[12px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Poetry</span>
                      <span className="text-[10px] leading-[13px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">by Vinee</span>
                      <div className="w-8 h-8 mt-auto flex items-center justify-center rounded-full backdrop-blur-md bg-black/40 cursor-pointer transition-all duration-300 hover:bg-black/60 group-hover:bg-black/50 shadow-lg border border-white/20">
                        <span className="font-serif text-white/80">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 12 12"
                            className="w-4 h-4"
                          >
                            <g fill="none">
                              <path
                                d="M4.646 2.146a.5.5 0 0 0 0 .708L7.793 6L4.646 9.146a.5.5 0 1 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"
                                fill="currentColor"
                              ></path>
                            </g>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal for full poem */}
      {selectedPoem && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedPoem(null)}
        >
          <div
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto p-8 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white z-10"
              onClick={() => setSelectedPoem(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Poem content */}
            <h2 className="font-poppins text-gold text-4xl mb-3 drop-shadow-lg">{selectedPoem.title}</h2>
            <p className="text-gray-300 text-sm mb-8 drop-shadow">
              {new Date(selectedPoem.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <div className="font-inter text-white text-lg leading-relaxed whitespace-pre-wrap drop-shadow">
              {selectedPoem.content}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
