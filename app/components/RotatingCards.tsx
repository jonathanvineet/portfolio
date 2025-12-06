'use client'

import styles from '../../styles/RotatingCards.module.css'

interface RotatingCardsProps {
  photos: string[]
}


export default function RotatingCards({ photos }: RotatingCardsProps) {
  // Ensure we have a safe photos array (fallback to local image)
  const safePhotos = photos && photos.length > 0 ? photos : ['/assets/IMG_6508.jpeg']

  // Use the number of safe photos as quantity (at least 3 to look good)
  const quantity = Math.max(safePhotos.length, 3)

  // Repeat photos to fill slots
  const filledPhotos = Array.from({ length: quantity }, (_, i) => safePhotos[i % safePhotos.length])

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner} style={{ '--quantity': quantity } as React.CSSProperties}>
        {filledPhotos.map((photo, index) => (
          <div
            key={index}
            className={styles.card}
            style={{ '--index': index } as React.CSSProperties}
          >
            <img
              src={photo}
              alt={`card-${index}`}
              className={styles.img}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
