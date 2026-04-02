'use client'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

interface LocationCardProps {
  name: string
  description: string
  image: string
  rotation?: number
  delay?: number
  fromDirection?: 'left' | 'right' | 'top'
}

export default function LocationCard({
  name,
  description,
  image,
  rotation = 0,
  delay = 0,
  fromDirection = 'top'
}: LocationCardProps) {
  const [fontSize, setFontSize] = useState(22)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const getInitialPosition = () => {
    switch (fromDirection) {
      case 'left': return { x: -500, y: 0 }
      case 'right': return { x: 500, y: 0 }
      case 'top': return { x: 0, y: -500 }
    }
  }

  useEffect(() => {
    const adjustFontSize = () => {
      if (nameRef.current) {
        let size = 22
        nameRef.current.style.fontSize = `${size}px`
        nameRef.current.style.whiteSpace = 'nowrap'

        while (nameRef.current.scrollWidth > nameRef.current.clientWidth && size > 12) {
          size -= 1
          nameRef.current.style.fontSize = `${size}px`
        }
        setFontSize(size)
      }
    }

    adjustFontSize()
    const timer = setTimeout(adjustFontSize, 100)
    return () => clearTimeout(timer)
  }, [name])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateXValue = ((y - centerY) / centerY) * -10
    const rotateYValue = ((x - centerX) / centerX) * 10
    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div style={{ perspective: '1000px' }}>
        <motion.div
          ref={cardRef}
          initial={{ ...getInitialPosition(), opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotateX,
            rotateY,
            rotateZ: rotation
          }}
          transition={{
            opacity: { duration: 0.6, delay, ease: 'easeOut' },
            scale: { duration: 0.6, delay, ease: 'easeOut' },
            x: { duration: 1, delay, ease: 'easeOut' },
            y: { duration: 1, delay, ease: 'easeOut' },
            rotateX: { duration: 0.3, ease: 'easeOut' },
            rotateY: { duration: 0.3, ease: 'easeOut' }
          }}
          className="relative w-[228px] h-[358px] bg-[#eeefe2] rounded-[12px] cursor-pointer overflow-hidden"
          style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 20px rgba(0, 0, 0, 0.2)' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
        <div className="w-full h-[240px] overflow-hidden">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>

        <div className="px-[12px] pt-[8px]">
          <h3
            ref={nameRef}
            className="m-0 font-black text-[#353535] text-center leading-[28px] tracking-[-0.44px] line-clamp-1"
            style={{ fontSize: `${fontSize}px` }}
          >
            {name}
          </h3>
        </div>

        <div className="px-[12px] pt-[2px]">
          <p className="text-[14px] font-medium text-[#353535] leading-[16px] text-center tracking-[-0.56px] line-clamp-3">
            {description}
          </p>
        </div>

        <div className="absolute bottom-[8px] left-[12px]">
          <span className="text-[12px] font-black text-[#c7720a] uppercase tracking-[-0.24px] leading-[16px]" style={{ fontWeight: 900 }}>Location</span>
        </div>
      </motion.div>
    </div>
  )
}
