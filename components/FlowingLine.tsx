'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface FlowingLineProps {
  startId: string
  endId: string
  delay?: number
}

export default function FlowingLine({ startId, endId, delay = 0 }: FlowingLineProps) {
  const [path, setPath] = useState('')

  useEffect(() => {
    const updatePath = () => {
      const startEl = document.getElementById(startId)
      const endEl = document.getElementById(endId)

      if (!startEl || !endEl) return

      // 获取父容器
      const container = startEl.closest('.relative') || startEl.parentElement
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const startRect = startEl.getBoundingClientRect()
      const endRect = endEl.getBoundingClientRect()

      // 计算相对于容器的位置
      const startX = startRect.left - containerRect.left + startRect.width / 2
      const startY = startRect.top - containerRect.top + startRect.height / 2
      const endX = endRect.left - containerRect.left + endRect.width / 2
      const endY = endRect.top - containerRect.top + endRect.height / 2

      const midX = (startX + endX) / 2
      const midY = (startY + endY) / 2 - 80

      setPath(`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`)
    }

    updatePath()
    window.addEventListener('resize', updatePath)

    const interval = setInterval(updatePath, 100)

    return () => {
      window.removeEventListener('resize', updatePath)
      clearInterval(interval)
    }
  }, [startId, endId])

  if (!path) return null

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <defs>
        <linearGradient id={`gradient-${startId}-${endId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          <animate attributeName="x1" values="0%;100%;0%" dur="3s" repeatCount="indefinite" />
          <animate attributeName="x2" values="100%;200%;100%" dur="3s" repeatCount="indefinite" />
        </linearGradient>
      </defs>

      <motion.path
        d={path}
        stroke={`url(#gradient-${startId}-${endId})`}
        strokeWidth="4"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      />
    </svg>
  )
}
