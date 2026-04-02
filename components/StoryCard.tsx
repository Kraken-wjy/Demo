'use client'
import { motion } from 'framer-motion'

interface StoryCardProps {
  title: string
  description: string
  image: string
  delay?: number
}

export default function StoryCard({ title, description, image, delay = 0 }: StoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className="relative w-[180px] h-[240px] bg-[#eeefe2] rounded-[10px] cursor-pointer overflow-hidden"
      style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}
    >
      <div className="w-full h-[140px] overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="p-3">
        <h4 className="text-[#353535] text-[14px] font-bold mb-1 line-clamp-2">{title}</h4>
        <p className="text-[#666] text-[11px] leading-tight line-clamp-3">{description}</p>
      </div>
    </motion.div>
  )
}
