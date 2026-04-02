'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import styles from './WorldCard.module.css'

interface WorldCardProps {
  onComplete?: () => void
}

export default function WorldCard({ onComplete }: WorldCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 })
  const [showShine, setShowShine] = useState(false)

  const calcValue = (a: number, b: number, range: number = 20) => {
    return (a / b * range - range / 2)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const yValue = calcValue(y, rect.height)
    const xValue = calcValue(x, rect.width)

    setRotateX(-yValue)
    setRotateY(xValue)
    setBgPosition({ x: xValue * 0.5, y: -yValue * 0.5 })
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setBgPosition({ x: 0, y: 0 })
  }

  const handleClick = () => {
    setShowShine(true)
    setTimeout(() => setShowShine(false), 800)
  }

  return (
    <div style={{ perspective: '1200px' }}>
      <motion.div
        initial={{ scale: 0.3, opacity: 0, y: 50 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
          rotateX: rotateX,
          rotateY: rotateY
        }}
        transition={{
          scale: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
          opacity: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
          y: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
          rotateX: { duration: 0.1, ease: 'easeOut' },
          rotateY: { duration: 0.1, ease: 'easeOut' }
        }}
        onAnimationComplete={onComplete}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="relative w-[567px] rounded-[14px] overflow-hidden cursor-pointer"
        style={{
          backgroundColor: '#353535',
          transformStyle: 'preserve-3d',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}
      >
        {/* 地图图片 */}
      <div className="w-full h-[320px] rounded-t-[14px] overflow-hidden relative">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-100"
          style={{
            backgroundImage: 'url(/westeros.png)',
            backgroundPosition: `${50 + bgPosition.x}% ${50 + bgPosition.y}%`,
            transform: 'translateZ(20px)'
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%)'
          }}
        />
      </div>

      {/* 标题 */}
      <div className="px-[18px] pt-[8px]">
        <h1 className="text-[28px] font-black text-[#f1ece0] leading-none">Westeros</h1>
      </div>

      {/* 标签 */}
      <div className="px-[18px] pt-[6px] flex gap-[7px]">
        <span className="px-[5px] py-[1px] bg-[#e2e4cc] border border-white rounded-[7px] text-[14px] text-[#353535] uppercase leading-[23px]">
          Middle Ages
        </span>
        <span className="px-[5px] py-[1px] bg-[#e2e4cc] border border-white rounded-[7px] text-[14px] text-[#353535] uppercase leading-[23px]">
          Fantasy
        </span>
        <span className="px-[5px] py-[1px] bg-[#e2e4cc] border border-white rounded-[7px] text-[14px] text-[#353535] uppercase leading-[23px]">
          Magic
        </span>
      </div>

      {/* 描述文字 */}
      <div className="px-[18px] pt-[8px] pb-[12px] text-[14px] text-[#f1ece0] leading-[19.5px] opacity-75">
        <p className="mb-[4px]">
          Set across the continents of Westeros and Essos, this world follows a low-magic, realistic tone where magic is scarce and mysterious. It centers on political intrigue, family feuds, and survival crises, embodying the eternal conflict between "Ice" (White Walkers, the Long Winter) and "Fire" (Dragons, Targaryens).
        </p>
        <p>
          The world has irregular seasonal cycles—long summers and winters can last for years—and "Winter is coming" serves as a persistent warning of existential peril.
        </p>
      </div>

      {/* 扫光效果 */}
      {showShine && <div className={styles.shine} />}
    </motion.div>
    </div>
  )
}