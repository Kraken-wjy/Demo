'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface BranchGrowthProps {
  connections: Array<{ from: string; to: string; label?: string }>
}

export default function BranchGrowth({ connections }: BranchGrowthProps) {
  const [paths, setPaths] = useState<Array<{ path: string; midX: number; midY: number; label?: string }>>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const updatePaths = useCallback(() => {
    const newPaths: Array<{ path: string; midX: number; midY: number; label?: string }> = []

    connections.forEach(({ from, to, label }) => {
      const fromEl = document.getElementById(from)
      const toEl = document.getElementById(to)
      if (!fromEl || !toEl) return

      const fromRect = fromEl.getBoundingClientRect()
      const toRect = toEl.getBoundingClientRect()

      const x1 = fromRect.left + fromRect.width / 2
      const y1 = fromRect.top + fromRect.height / 2
      const x2 = toRect.left + toRect.width / 2
      const y2 = toRect.top + toRect.height / 2

      const cpX = (x1 + x2) / 2
      const cpY = Math.min(y1, y2) - 80

      const midX = (x1 + x2) / 2
      const midY = (y1 + y2) / 2 - 40

      newPaths.push({
        path: `M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`,
        midX,
        midY,
        label: label || `${from} → ${to}`
      })
    })

    setPaths(newPaths)
  }, [connections])

  useEffect(() => {
    const timer = setTimeout(updatePaths, 500)
    return () => clearTimeout(timer)
  }, [updatePaths])

  useEffect(() => {
    let rafId: number
    const handleUpdate = () => {
      updatePaths()
      rafId = requestAnimationFrame(handleUpdate)
    }
    rafId = requestAnimationFrame(handleUpdate)
    return () => cancelAnimationFrame(rafId)
  }, [updatePaths])

  return (
    <svg
      className="fixed top-0 left-0"
      style={{ width: '100vw', height: '100vh', zIndex: 5, pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.3)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
        </linearGradient>
      </defs>
      {paths.map((item, i) => (
        <g key={i} style={{ pointerEvents: 'auto' }}>
          <motion.path
            d={item.path}
            stroke={hoveredIndex === i ? "rgba(254, 130, 0, 0.8)" : "url(#branchGradient)"}
            strokeWidth={hoveredIndex === i ? "3" : "2"}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: i * 0.1, ease: 'easeInOut' }}
            style={{ pointerEvents: 'none' }}
          />
          <path
            d={item.path}
            stroke="transparent"
            strokeWidth="20"
            fill="none"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
          {hoveredIndex === i && (
            <g>
              <rect
                x={item.midX - 60}
                y={item.midY - 15}
                width="120"
                height="30"
                rx="6"
                fill="rgba(254, 130, 0, 0.95)"
              />
              <text
                x={item.midX}
                y={item.midY + 5}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                {item.label}
              </text>
            </g>
          )}
        </g>
      ))}
    </svg>
  )
}
