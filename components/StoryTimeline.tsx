'use client'
import { motion } from 'framer-motion'
import StoryCard from './StoryCard'

export default function StoryTimeline() {
  const stories = [
    { title: "The Night's Watch", description: "Jon Snow takes the black and joins the ancient order", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=180&h=140&fit=crop" },
    { title: "Dragons Born", description: "Daenerys emerges from fire with three dragon eggs hatched", image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=180&h=140&fit=crop" },
    { title: "Battle of Blackwater", description: "Tyrion defends King's Landing with wildfire", image: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=180&h=140&fit=crop" },
    { title: "Red Wedding", description: "The Starks face betrayal at the Twins", image: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=180&h=140&fit=crop" },
    { title: "Purple Wedding", description: "Joffrey's reign comes to an end", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=180&h=140&fit=crop" }
  ]

  return (
    <div className="absolute top-[-1600px] left-1/2 -translate-x-1/2 w-[3000px] h-[1500px]">
      {/* 大椭圆弧线 SVG - 使用stroke-dasharray实现绘制动画 */}
      <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
          </linearGradient>
        </defs>
        <motion.ellipse
          cx="1500"
          cy="1500"
          rx="1350"
          ry="900"
          stroke="url(#arcGradient)"
          strokeWidth="20"
          fill="none"
          strokeDasharray="7500"
          strokeDashoffset="7500"
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
      </svg>

      {/* 故事卡片沿椭圆弧分布 */}
      <div className="relative" style={{ zIndex: 2 }}>
        {stories.map((story, i) => {
          const angle = Math.PI + (i / (stories.length - 1)) * Math.PI
          const x = 1500 + Math.cos(angle) * 1350
          const y = 1500 + Math.sin(angle) * 900

          return (
            <motion.div
              key={i}
              id={`story-${i}`}
              className="absolute"
              style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
            >
              <StoryCard {...story} delay={i * 0.5 + 1.5} />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
