'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Masonry from '../../components/Masonry'

interface Photo {
  id: string
  img: string
  url: string
}

export default function Photography() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPhotos() {
      if (!supabase) {
        console.error('Supabase client not initialized')
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.storage
          .from('photography')
          .list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' }
          })

        if (error) throw error

        // Filter only image files
        const imageFiles = (data || []).filter(file => {
          const ext = file.name.toLowerCase()
          return /\.(jpg|jpeg|png|webp|gif)$/i.test(ext) && !file.name.startsWith('.')
        })

        // Masonry lays out images by their natural aspect ratio (CSS columns),
        // so we only need URLs here — no pre-fetching each image just to
        // measure it before the grid can render.
        setPhotos(
          imageFiles.map(file => {
            const { data: urlData } = supabase!.storage.from('photography').getPublicUrl(file.name)
            return {
              id: file.id || file.name,
              img: urlData.publicUrl,
              url: urlData.publicUrl
            }
          })
        )
      } catch (error) {
        console.error('Error fetching photos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  return (
    <main className="min-h-screen bg-dark-bg pt-28 pb-16 px-6">
      <div className="container mx-auto max-w-[1800px]">
        <div className="text-center mb-12">
          <h1 className="font-poppins text-gold text-5xl mb-4">Photography</h1>
          <p className="font-inter text-lg text-gray-400 max-w-2xl mx-auto">
            Capturing moments through the lens
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold to-blood-red rounded-full"></div>
            <span className="font-inter text-sm text-gray-500">Gallery</span>
            <div className="w-20 h-0.5 bg-gradient-to-r from-blood-red via-gold to-transparent rounded-full"></div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading photos...</div>
        ) : photos.length === 0 ? (
          <div className="text-center text-gray-400 py-20">No photos found yet.</div>
        ) : (
          <div className="w-full" style={{ minHeight: '600px' }}>
            <Masonry items={photos} scaleOnHover hoverScale={0.97} />
          </div>
        )}
      </div>
    </main>
  )
}
