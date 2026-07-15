'use client'

import './Masonry.css'

interface MasonryItem {
  id: string
  img: string
  url?: string
  /** @deprecated no longer needed — layout now uses each image's natural aspect ratio */
  height?: number
}

interface MasonryProps {
  items: MasonryItem[]
  scaleOnHover?: boolean
  hoverScale?: number
}

// CSS multi-column masonry: the browser lays out variable-height images
// natively, so there's no JS position/height bookkeeping and nothing to
// re-animate every time an image finishes loading. Each tile fades/rises in
// once, staggered by its position, then settles — no flying-in-from-off-
// screen, no repeated reflow jitter as images trickle in.
const Masonry = ({ items, scaleOnHover = true, hoverScale = 0.97 }: MasonryProps) => {
  return (
    <div
      className="masonry-columns"
      style={{ ['--masonry-hover-scale' as string]: hoverScale }}
    >
      {items.map((item, index) => {
        const content = (
          <div className={`masonry-tile ${scaleOnHover ? 'masonry-tile--hoverable' : ''}`}>
            <img
              src={item.img}
              alt=""
              loading="lazy"
              decoding="async"
              onLoad={e => e.currentTarget.classList.add('loaded')}
            />
          </div>
        )

        return (
          <div
            key={item.id}
            className="masonry-item"
            style={{ animationDelay: `${Math.min(index, 20) * 45}ms` }}
          >
            {item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              content
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Masonry
