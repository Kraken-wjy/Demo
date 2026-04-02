'use client'
import { motion } from 'framer-motion'

export default function FloatingCards() {
  const cards = [
    { id: 1, x: -200, y: -150, rotation: -15, delay: 0 },
    { id: 2, x: 180, y: -180, rotation: 12, delay: 0.5 },
    { id: 3, x: -180, y: 120, rotation: 8, delay: 1 },
    { id: 4, x: 220, y: 140, rotation: -10, delay: 1.5 },
    { id: 5, x: 0, y: -220, rotation: 5, delay: 2 },
    { id: 6, x: -250, y: 50, rotation: -8, delay: 2.5 }
  ]

  return (
    <>
      {cards.map((card) => (
        <motion.div
          key={card.id}
          className="absolute"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            y: [0, -20, 0],
            rotateZ: [card.rotation, card.rotation + 5, card.rotation]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: card.delay
          }}
          style={{
            left: `calc(50% + ${card.x}px)`,
            top: `calc(50% + ${card.y}px)`,
            filter: 'blur(1px)'
          }}
        >
          <div
            className="w-[120px] h-[160px] rounded-[8px] bg-gradient-to-b from-[#eeefe2] to-[#e2e4cc]"
            style={{
              boxShadow: '0 4px 20px rgba(199, 114, 10, 0.3)',
              border: '1px solid rgba(199, 114, 10, 0.2)'
            }}
          />
        </motion.div>
      ))}
    </>
  )
}
