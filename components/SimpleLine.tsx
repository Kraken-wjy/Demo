'use client'
import { motion } from 'framer-motion'

interface SimpleLineProps {
  startId: string
  endId: string
  delay?: number
}

export default function SimpleLine({ startId, endId, delay = 0 }: SimpleLineProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 0.8, delay }}
      className="absolute pointer-events-none"
      style={{
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}
    >
      <svg width="100%" height="100%" style={{ position: 'absolute' }}>
        <line
          x1="50%"
          y1="50%"
          x2="50%"
          y2="10%"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>
    </motion.div>
  )
}
