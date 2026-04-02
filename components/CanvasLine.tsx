'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface CanvasLineProps {
  startId: string
  endId: string
  delay?: number
}

export default function CanvasLine({ startId, endId, delay = 0 }: CanvasLineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isReady) return

    const draw = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const startEl = document.getElementById(startId)
      const endEl = document.getElementById(endId)
      if (!startEl || !endEl) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const startRect = startEl.getBoundingClientRect()
      const endRect = endEl.getBoundingClientRect()

      const startX = startRect.left + startRect.width / 2
      const startY = startRect.top + startRect.height / 2
      const endX = endRect.left + endRect.width / 2
      const endY = endRect.top + endRect.height / 2

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(startX, startY)

      const midX = (startX + endX) / 2
      const midY = (startY + endY) / 2 - 80
      ctx.quadraticCurveTo(midX, midY, endX, endY)
      ctx.stroke()
    }

    draw()
    const interval = setInterval(draw, 50)
    return () => clearInterval(interval)
  }, [startId, endId, isReady])

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
