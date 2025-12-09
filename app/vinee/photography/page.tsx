'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Masonry from '../../components/Masonry'

interface Photo {
  id: string
  name: string
  height: number
  width: number
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

        // Get dimensions for each image
        const photosWithDimensions = await Promise.all(
          imageFiles.map(async (file) => {
            const { data } = supabase!.storage.from('photography').getPublicUrl(file.name)
            const imageUrl = data.publicUrl

            // Load image to get dimensions
            const dimensions = await getImageDimensions(imageUrl)

            return {
              id: file.id || file.name,
              name: file.name,
              width: dimensions.width,
              height: dimensions.height
            }
          })
        )

        setPhotos(photosWithDimensions)
      } catch (error) {
        console.error('Error fetching photos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => {
        // Fallback if image fails to load
        resolve({ width: 600, height: 400 })
      }
      img.src = src
    })
  }

  const getImageUrl = (imageName: string) => {
    if (!supabase) return ''
    const { data } = supabase!.storage.from('photography').getPublicUrl(imageName)
    return data.publicUrl
  }

  // Calculate dynamic height based on aspect ratio
  // For masonry: use height to determine how tall the card should be relative to width
  const masonryItems = photos.map(photo => {
    // Calculate aspect ratio
    const aspectRatio = photo.width / photo.height
    
    // Base height in pixels for the masonry layout
    let displayHeight = 400

    // Adjust height based on aspect ratio
    if (aspectRatio > 1.5) {
      // Horizontal images (landscape) - make them wider/shorter
      displayHeight = 250
    } else if (aspectRatio < 0.67) {
      // Vertical images (portrait) - make them taller
      displayHeight = 600
    } else {
      // Square-ish images
      displayHeight = 400
    }

    return {
      id: photo.id,
      img: getImageUrl(photo.name),
      url: getImageUrl(photo.name),
      height: displayHeight
    }
  })

  return (
    <main className="min-h-screen bg-dark-bg py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="font-poppins text-gold text-5xl mb-4">Photography</h1>
          <p className="font-inter text-lg text-gray-400 max-w-2xl mx-auto">
            Capturing moments through the lens
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold to-blood-red"></div>
            <span className="font-inter text-sm text-gray-500">Gallery</span>
            <div className="w-20 h-0.5 bg-gradient-to-r from-blood-red via-gold to-transparent"></div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading photos...</div>
        ) : photos.length === 0 ? (
          <div className="text-center text-gray-400 py-20">No photos found yet.</div>
        ) : (
          <div className="w-full" style={{ minHeight: '600px' }}>
            <Masonry
              items={masonryItems}
              ease="power3.out"
              duration={0.6}
              stagger={0.05}
              animateFrom="bottom"
              scaleOnHover={true}
              hoverScale={0.95}
              blurToFocus={true}
              colorShiftOnHover={false}
            />
          </div>
        )}
      </div>
    </main>
  )
}
