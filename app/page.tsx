'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import SmallPixelFire from '@/components/SmallPixelFire'
import WorldCard from '@/components/WorldCard'
import CharacterCard from '@/components/CharacterCard'
import FlowingLine from '@/components/FlowingLine'
import LocationCard from '@/components/LocationCard'
import StoryTimeline from '@/components/StoryTimeline'
import BranchGrowth from '@/components/BranchGrowth'

const PixelFire = dynamic(() => import('@/components/PixelFire'), { ssr: false })
const FloatingCards3D = dynamic(() => import('@/components/FloatingCards3D'), { ssr: false })

export default function Home() {
  const [showCard, setShowCard] = useState(false)
  const [hideBigFire, setHideBigFire] = useState(false)
  const [showSmallFire, setShowSmallFire] = useState(false)
  const [showForgeText, setShowForgeText] = useState(false)
  const [showCharacters, setShowCharacters] = useState(false)
  const [scaleDown, setScaleDown] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null)
  const [sparks, setSparks] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [showSecondaryCharacters, setShowSecondaryCharacters] = useState(false)
  const [showLocations, setShowLocations] = useState(false)
  const [showStories, setShowStories] = useState(false)
  const [showBranches, setShowBranches] = useState(false)

  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleForgeClick = () => {
    const newSparks = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50
    }))
    setSparks(newSparks)
    setTimeout(() => setSparks([]), 1000)

    if (!showCharacters) {
      setScaleDown(true)
      setTimeout(() => setShowCharacters(true), 300)
    } else if (!showSecondaryCharacters) {
      setShowSecondaryCharacters(true)
    } else if (!showLocations) {
      setShowLocations(true)
    } else if (!showStories) {
      setShowStories(true)
      setTimeout(() => setShowBranches(true), 3000)
    }
  }

  const characters = [
    {
      id: 1,
      name: "Jon Snow",
      description: "Bastard son of Eddard Stark, sworn brother of the Night's Watch.",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=228&h=240&fit=crop"
    },
    {
      id: 2,
      name: "Daenerys Targaryen",
      description: "Last surviving heir of the Targaryen dynasty, Mother of Dragons.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=228&h=240&fit=crop"
    },
    {
      id: 3,
      name: "Jaime Lannister",
      description: "Kingslayer, twin brother of Cersei, skilled swordsman.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=228&h=240&fit=crop"
    }
  ]

  const secondaryCharacters = {
    1: [
      { id: 11, name: "Sansa Stark", desc: "Lady of Winterfell", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=228&h=240&fit=crop" },
      { id: 12, name: "Bran Stark", desc: "The Three-Eyed Raven", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=228&h=240&fit=crop" },
      { id: 13, name: "Robb Stark", desc: "King in the North", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=228&h=240&fit=crop" }
    ],
    2: [
      { id: 21, name: "Jorah Mormont", desc: "Loyal knight and advisor", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=228&h=240&fit=crop" },
      { id: 22, name: "Missandei", desc: "Trusted translator", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=228&h=240&fit=crop" },
      { id: 23, name: "Grey Worm", desc: "Commander of Unsullied", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=228&h=240&fit=crop" }
    ],
    3: [
      { id: 31, name: "Tyrion Lannister", desc: "The Imp, master strategist", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=228&h=240&fit=crop" },
      { id: 32, name: "Cersei Lannister", desc: "Queen of Seven Kingdoms", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=228&h=240&fit=crop" },
      { id: 33, name: "Tywin Lannister", desc: "Lord of Casterly Rock", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=228&h=240&fit=crop" }
    ]
  }

  const selectedChar = characters.find(c => c.id === selectedCharacter)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCard(true)
      setTimeout(() => {
        setHideBigFire(true)
        setTimeout(() => setShowSmallFire(true), 500)
      }, 800)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY * -0.001
      setZoom(prev => Math.min(Math.max(0.3, prev + delta), 3))
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isDragging) {
        e.preventDefault()
        setIsDragging(true)
        if (containerRef.current) {
          containerRef.current.style.cursor = 'grabbing'
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        setIsDragging(false)
        if (containerRef.current) {
          containerRef.current.style.cursor = 'default'
        }
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (isDragging) {
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        })
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel)
      }
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isDragging, dragStart, position])

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#292726', cursor: isDragging ? 'grabbing' : 'default' }}
    >
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
      {/* 枝桠生长 - 分阶段显示 */}
      {showCharacters && (
        <BranchGrowth
          connections={[
            { from: 'world-card', to: 'char-1', label: '北境守护' },
            { from: 'world-card', to: 'char-2', label: '龙之血脉' },
            { from: 'world-card', to: 'char-3', label: '兰尼斯特家族' }
          ]}
        />
      )}

      {showSecondaryCharacters && (
        <BranchGrowth
          connections={[
            { from: 'char-1', to: 'char-11', label: '姐妹' },
            { from: 'char-1', to: 'char-12', label: '兄弟' },
            { from: 'char-1', to: 'char-13', label: '兄弟' },
            { from: 'char-2', to: 'char-21', label: '忠诚骑士' },
            { from: 'char-2', to: 'char-22', label: '密友' },
            { from: 'char-2', to: 'char-23', label: '统帅' },
            { from: 'char-3', to: 'char-31', label: '兄弟' },
            { from: 'char-3', to: 'char-32', label: '孪生姐妹' },
            { from: 'char-3', to: 'char-33', label: '父亲' }
          ]}
        />
      )}

      {showLocations && (
        <BranchGrowth
          connections={[
            { from: 'char-1', to: 'loc-1', label: '故乡' },
            { from: 'char-2', to: 'loc-2', label: '征服之地' },
            { from: 'char-3', to: 'loc-3', label: '守夜人' }
          ]}
        />
      )}

      {showBranches && (
        <BranchGrowth
          connections={[
            { from: 'loc-1', to: 'story-0', label: '事件发生地' },
            { from: 'loc-1', to: 'story-1', label: '事件发生地' },
            { from: 'loc-2', to: 'story-2', label: '事件发生地' },
            { from: 'loc-3', to: 'story-3', label: '事件发生地' },
            { from: 'loc-3', to: 'story-4', label: '事件发生地' },
            { from: 'story-0', to: 'story-1', label: '时间线' },
            { from: 'story-1', to: 'story-2', label: '时间线' },
            { from: 'story-2', to: 'story-3', label: '时间线' },
            { from: 'story-3', to: 'story-4', label: '时间线' },
            { from: 'char-11', to: 'story-0', label: '参与者' },
            { from: 'char-21', to: 'story-1', label: '参与者' },
            { from: 'char-22', to: 'story-2', label: '参与者' },
            { from: 'char-31', to: 'story-3', label: '参与者' },
            { from: 'char-32', to: 'story-4', label: '参与者' }
          ]}
        />
      )}

      <motion.div
        animate={{ scale: showSecondaryCharacters ? 0.6 : 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="w-full h-full relative flex items-center justify-center"
      >
      {/* 大火焰 */}
      <AnimatePresence>
        {!hideBigFire && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="scale-75"
            style={{ position: 'relative', zIndex: 1 }}
          >
            <FloatingCards3D />
            <PixelFire showText={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 卡片 */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{
              opacity: 1,
              scale: scaleDown ? (showSecondaryCharacters ? 0.28 : 0.45) : 0.8,
              x: scaleDown ? 0 : 0,
              y: scaleDown ? (showStories ? 480 : showSecondaryCharacters ? 460 : 280) : 0
            }}
            transition={{
              opacity: { delay: 0.3, duration: 0.8 },
              scale: { delay: 0.3, duration: scaleDown ? 0.8 : 0.8, ease: 'easeInOut' },
              x: { duration: 0.8, ease: 'easeInOut' },
              y: { duration: 0.8, ease: 'easeInOut' }
            }}
            className="absolute"
            style={{ top: '10%', zIndex: 50 }}
            id="world-card"
          >
            <WorldCard />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 小火焰 - 左侧独立位置 - 不受缩放影响 */}
      <AnimatePresence>
        {showSmallFire && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              scale: [1, 1.1, 1],
              x: showStories ? -100 : 0
            }}
            transition={{
              opacity: { duration: 0.8 },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: 0.8, ease: 'easeInOut' }
            }}
            className="absolute cursor-pointer"
            style={{ left: '5%', top: '45%', zIndex: 20 }}
            onMouseEnter={() => setShowForgeText(true)}
            onMouseLeave={() => setShowForgeText(false)}
            onClick={handleForgeClick}
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [0.3, 1.5], opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full border-2 border-[#FE8200]"
              />
              <motion.div
                animate={{ scale: [0.3, 1.5], opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full border-2 border-[#FE8200]"
              />
              <SmallPixelFire />
              {sparks.map((spark) => (
                <motion.div
                  key={spark.id}
                  initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  animate={{ opacity: 0, scale: 0, x: spark.x, y: spark.y }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute top-1/2 left-1/2 w-[6px] h-[6px] rounded-full bg-[#FFD700]"
                  style={{ boxShadow: '0 0 20px #FFD700, 0 0 35px #FFA500, 0 0 50px #FF8C00' }}
                />
              ))}
            </div>
            {showForgeText && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-[120px] left-1/2 -translate-x-1/2 text-[#FE8200] text-[16px] font-bold whitespace-nowrap"
              >
                Forge
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full h-full relative flex items-center justify-center"
        animate={{ scale: showLocations ? 0.5 : 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ transformOrigin: 'center center' }}
      >

      {/* 统一下移容器 - 包含所有角色/地点卡 */}
      <motion.div
        animate={{ y: showStories ? 600 : showLocations ? 350 : showSecondaryCharacters ? 280 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="relative w-full h-full"
      >

      {/* 角色卡片和流动线 */}
      {showCharacters && (
        <>
          {/* 主角色流动线 - 暂时隐藏 */}
          {/* <FlowingLine startId="world-card" endId="char-1" delay={0} />
          <FlowingLine startId="world-card" endId="char-2" delay={0.2} />
          <FlowingLine startId="world-card" endId="char-3" delay={0.4} /> */}

          {/* 次要角色流动线 - 暂时隐藏 */}
          {/* {showSecondaryCharacters && (
            <>
              <FlowingLine startId="char-1" endId="char-11" delay={0} />
              <FlowingLine startId="char-1" endId="char-12" delay={0.1} />
              <FlowingLine startId="char-1" endId="char-13" delay={0.2} />
              <FlowingLine startId="char-2" endId="char-21" delay={0.3} />
              <FlowingLine startId="char-2" endId="char-22" delay={0.4} />
              <FlowingLine startId="char-2" endId="char-23" delay={0.5} />
              <FlowingLine startId="char-3" endId="char-31" delay={0.6} />
              <FlowingLine startId="char-3" endId="char-32" delay={0.7} />
              <FlowingLine startId="char-3" endId="char-33" delay={0.8} />
            </>
          )} */}

          {/* 角色卡片 */}
          <motion.div
            className="absolute top-[180px] left-[366px]"
            id="char-1"
            style={{ transform: showSecondaryCharacters ? 'scale(0.68)' : 'scale(0.8)', zIndex: 10 }}
          >
            <CharacterCard
              name="Jon Snow"
              description="Bastard son of Eddard Stark, sworn brother of the Night's Watch."
              image="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=228&h=240&fit=crop"
              rotation={-1}
              delay={0.8}
              isModalOpen={selectedCharacter === 1}
              onOpenModal={() => setSelectedCharacter(1)}
              onCloseModal={() => setSelectedCharacter(null)}
            />
          </motion.div>

          <motion.div
            className="absolute top-[60px] left-[717px]"
            id="char-2"
            style={{ transform: showSecondaryCharacters ? 'scale(0.68)' : 'scale(0.8)', zIndex: 10 }}
          >
            <CharacterCard
              name="Daenerys Targaryen"
              description="Last surviving heir of the Targaryen dynasty, Mother of Dragons."
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=228&h=240&fit=crop"
              rotation={1}
              delay={1}
              isModalOpen={selectedCharacter === 2}
              onOpenModal={() => setSelectedCharacter(2)}
              onCloseModal={() => setSelectedCharacter(null)}
            />
          </motion.div>

          <motion.div
            className="absolute top-[170px] left-[1100px]"
            id="char-3"
            style={{ transform: showSecondaryCharacters ? 'scale(0.68)' : 'scale(0.8)', zIndex: 10 }}
          >
            <CharacterCard
              name="Jaime Lannister"
              description="Kingslayer, twin brother of Cersei, skilled swordsman."
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=228&h=240&fit=crop"
              rotation={-1}
              delay={1.2}
              isModalOpen={selectedCharacter === 3}
              onOpenModal={() => setSelectedCharacter(3)}
              onCloseModal={() => setSelectedCharacter(null)}
            />
          </motion.div>

          {/* 次要角色 - Jon Snow的3个 - 向上生长 */}
          {showSecondaryCharacters && (
            <>
              <motion.div className="absolute top-[-220px] left-[50px]" id="char-11" style={{ transform: 'scale(0.65)', zIndex: 9 }}>
                <CharacterCard name="Sansa Stark" description="Lady of Winterfell" image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=228&h=240&fit=crop" rotation={-3} delay={1.4} isModalOpen={selectedCharacter === 11} onOpenModal={() => setSelectedCharacter(11)} onCloseModal={() => setSelectedCharacter(null)} />
              </motion.div>
              <motion.div className="absolute top-[-290px] left-[280px]" id="char-12" style={{ transform: 'scale(0.65)', zIndex: 9 }}>
                <CharacterCard name="Bran Stark" description="The Three-Eyed Raven" image="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=228&h=240&fit=crop" rotation={2} delay={1.5} isModalOpen={selectedCharacter === 12} onOpenModal={() => setSelectedCharacter(12)} onCloseModal={() => setSelectedCharacter(null)} />
              </motion.div>
              <motion.div className="absolute top-[-235px] left-[490px]" id="char-13" style={{ transform: 'scale(0.65)', zIndex: 9 }}>
                <CharacterCard name="Robb Stark" description="King in the North" image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=228&h=240&fit=crop" rotation={-2} delay={1.6} isModalOpen={selectedCharacter === 13} onOpenModal={() => setSelectedCharacter(13)} onCloseModal={() => setSelectedCharacter(null)} />
              </motion.div>
            </>
          )}

          {/* 次要角色 - Daenerys的3个 - 向上生长 - 中间不动 */}
          {showSecondaryCharacters && (
            <>
              <motion.div className="absolute top-[-255px] left-[680px]" id="char-21" style={{ transform: 'scale(0.65)', zIndex: 9 }}>
                <CharacterCard name="Jorah Mormont" description="Loyal knight and advisor" image="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=228&h=240&fit=crop" rotation={3} delay={1.7} isModalOpen={selectedCharacter === 21} onOpenModal={() => setSelectedCharacter(21)} onCloseModal={() => setSelectedCharacter(null)} />
              </motion.div>
              <motion.div className="absolute top-[-300px] left-[860px]" id="char-22" style={{ transform: 'scale(0.65)', zIndex: 9 }}>
                <CharacterCard name="Missandei" description="Trusted translator" image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=228&h=240&fit=crop" rotation={-2} delay={1.8} isModalOpen={selectedCharacter === 22} onOpenModal={() => setSelectedCharacter(22)} onCloseModal={() => setSelectedCharacter(null)} />
              </motion.div>
              <motion.div className="absolute top-[-245px] left-[1080px]" id="char-23" style={{ transform: 'scale(0.65)', zIndex: 9 }}>
                <CharacterCard name="Grey Worm" description="Commander of Unsullied" image="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=228&h=240&fit=crop" rotation={2} delay={1.9} isModalOpen={selectedCharacter === 23} onOpenModal={() => setSelectedCharacter(23)} onCloseModal={() => setSelectedCharacter(null)} />
              </motion.div>
            </>
          )}

          {/* 次要角色 - Jaime的3个 - 向上生长 */}
          {showSecondaryCharacters && (
            <>
              <motion.div className="absolute top-[-240px] left-[1290px]" id="char-31" style={{ transform: 'scale(0.65)', zIndex: 9 }}>
                <CharacterCard name="Tyrion Lannister" description="The Imp, master strategist" image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=228&h=240&fit=crop" rotation={-3} delay={2.0} isModalOpen={selectedCharacter === 31} onOpenModal={() => setSelectedCharacter(31)} onCloseModal={() => setSelectedCharacter(null)} />
              </motion.div>
              <motion.div className="absolute top-[-295px] left-[1460px]" id="char-32" style={{ transform: 'scale(0.65)', zIndex: 9 }}>
                <CharacterCard name="Cersei Lannister" description="Queen of Seven Kingdoms" image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=228&h=240&fit=crop" rotation={2} delay={2.1} isModalOpen={selectedCharacter === 32} onOpenModal={() => setSelectedCharacter(32)} onCloseModal={() => setSelectedCharacter(null)} />
              </motion.div>
              <motion.div className="absolute top-[-250px] left-[1680px]" id="char-33" style={{ transform: 'scale(0.65)', zIndex: 9 }}>
                <CharacterCard name="Tywin Lannister" description="Lord of Casterly Rock" image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=228&h=240&fit=crop" rotation={-2} delay={2.2} isModalOpen={selectedCharacter === 33} onOpenModal={() => setSelectedCharacter(33)} onCloseModal={() => setSelectedCharacter(null)} />
              </motion.div>
            </>
          )}

          {/* 地点卡 - 第三次点击后从屏幕外飞入 */}
          {showLocations && (
            <>
              <motion.div className="absolute top-[-620px] left-[150px]" id="loc-1" style={{ zIndex: 11 }}>
                <LocationCard name="Winterfell" description="Ancestral home of House Stark in the North" image="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=228&h=240&fit=crop" rotation={-2} delay={0.2} fromDirection="left" />
              </motion.div>
              <motion.div className="absolute top-[-620px] left-[750px]" id="loc-2" style={{ zIndex: 11 }}>
                <LocationCard name="King's Landing" description="Capital of the Seven Kingdoms" image="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=228&h=240&fit=crop" rotation={1} delay={0.4} fromDirection="top" />
              </motion.div>
              <motion.div className="absolute top-[-620px] left-[1350px]" id="loc-3" style={{ zIndex: 11 }}>
                <LocationCard name="The Wall" description="Massive fortification defending the realm" image="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=228&h=240&fit=crop" rotation={-1} delay={0.6} fromDirection="right" />
              </motion.div>
            </>
          )}

          {/* 故事时间线 - 第四次点击后显示 */}
          {showStories && <StoryTimeline />}
        </>
      )}
      </motion.div>
      </motion.div>

      {/* 全局模态框 */}
      {selectedChar && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setSelectedCharacter(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', transformOrigin: 'center' }}
          >
            <button
              onClick={() => setSelectedCharacter(null)}
              style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                cursor: 'pointer',
                zIndex: 10,
                color: '#000'
              }}
            >
              ×
            </button>

            <div className="relative w-[228px] h-[358px] bg-[#eeefe2] rounded-[12px] overflow-hidden">
              <div className="w-full h-[240px] overflow-hidden">
                <img src={selectedChar.image} alt={selectedChar.name} className="w-full h-full object-cover" />
              </div>
              <div className="px-[12px] pt-[8px]">
                <h3 className="m-0 font-black text-[#353535] text-center leading-[28px] tracking-[-0.44px] line-clamp-1" style={{ fontSize: '22px', whiteSpace: 'nowrap' }}>
                  {selectedChar.name}
                </h3>
              </div>
              <div className="px-[12px] pt-[2px]">
                <p className="text-[14px] font-medium text-[#353535] leading-[16px] text-center tracking-[-0.56px] line-clamp-3">
                  {selectedChar.description}
                </p>
              </div>
              <div className="absolute bottom-[8px] left-[12px]">
                <span className="text-[12px] font-black text-[#c7720a] uppercase tracking-[-0.24px] leading-[16px]" style={{ fontWeight: 900 }}>Character</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </motion.div>
      </div>
    </div>
  )
}
