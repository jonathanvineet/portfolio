'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface StackProps {
  cards: React.ReactNode[]
  randomRotation?: boolean
  sensitivity?: number
  sendToBackOnClick?: boolean
  autoplay?: boolean
  autoplayDelay?: number
  pauseOnHover?: boolean
}

export default function Stack({
  cards,
  randomRotation = true,
  sensitivity = 200,
  sendToBackOnClick = true,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = true
}: StackProps) {
  const [stack, setStack] = useState(cards)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-play functionality
  useEffect(() => {
    if (!autoplay || (pauseOnHover && isHovered)) return

    const interval = setInterval(() => {
      setStack((prev) => {
        const newStack = [...prev]
        const topCard = newStack.shift()
        if (topCard) {
          newStack.push(topCard)
        }
        return newStack
      })
    }, autoplayDelay)

    return () => clearInterval(interval)
  }, [autoplay, autoplayDelay, pauseOnHover, isHovered])

  const handleCardClick = (index: number) => {
    if (!sendToBackOnClick) return

    setStack((prev) => {
      const newStack = [...prev]
      const clickedCard = newStack.splice(index, 1)[0]
      newStack.push(clickedCard)
      return newStack
    })
  }

  const getRandomRotation = () => {
    return randomRotation ? Math.random() * 20 - 10 : 0
  }

  return (
    <div 
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {stack.map((card, index) => (
        <motion.div
          key={`card-${index}`}
          className="absolute inset-0 cursor-pointer rounded-2xl overflow-hidden shadow-lg"
          style={{
            zIndex: stack.length - index,
          }}
          initial={{
            scale: 1 - index * 0.05,
            rotate: getRandomRotation(),
            y: index * 6,
            x: index * 3,
          }}
          animate={{
            scale: 1 - index * 0.05,
            rotate: getRandomRotation(),
            y: index * 6,
            x: index * 3,
          }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
          onClick={() => handleCardClick(index)}
          whileHover={{
            scale: 1 - index * 0.05 + 0.02,
            transition: { duration: 0.2 }
          }}
        >
          {card}
        </motion.div>
      ))}
    </div>
  )
}