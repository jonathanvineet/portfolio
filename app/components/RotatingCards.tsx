'use client'

import styles from '../../styles/RotatingCards.module.css'

interface RotatingCardsProps {
  photos: string[]
}


export default function RotatingCards({ photos }: RotatingCardsProps) {
  // Use the number of photos as quantity, or default to 10
  const quantity = photos.length || 10
  
  // Repeat photos if fewer than 10 to fill all cards
  const filledPhotos = Array(quantity)
    .fill(null)
    .map((_, i) => photos[i % photos.length] || photos[0])

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
