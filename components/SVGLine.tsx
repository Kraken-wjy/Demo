'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface SVGLineProps {
  startId: string
  endId: string
  delay?: number
}

export default function SVGLine({ startId, endId, delay = 0 }: SVGLineProps) {
  const [path, setPath] = useState('')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isReady) return

    const updatePath = () => {
      const startEl = document.getElementById(startId)
      const endEl = document.getElementById(endId)
      const container = document.getElementById('scaled-container')

      if (!startEl || !endEl || !container) return

      const containerRect = container.getBoundingClientRect()
      const startRect = startEl.getBoundingClientRect()
      const endRect = endEl.getBoundingClientRect()

      const startX = startRect.left - containerRect.left + startRect.width / 2
      const startY = startRect.top - containerRect.top + startRect.height / 2
      const endX = endRect.left - containerRect.left + endRect.width / 2
      const endY = endRect.top - containerRect.top + endRect.height / 2

      const midX = (startX + endX) / 2
      const midY = (startY + endY) / 2 - 80

      setPath(`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`)
    }

    updatePath()
    const interval = setInterval(updatePath, 50)
    return () => clearInterval(interval)
  }, [startId, endId, isReady])

  if (!isReady || !path) return null

  return (
    <motion.path
      d={path}
      stroke="rgba(255, 255, 255, 0.3)"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  )
}
