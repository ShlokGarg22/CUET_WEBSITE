import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const subjects = [
  { 
    id: 'mathematics', 
    name: 'Mathematics',
    icon: 'M',
    color: 'from-[#4169E1] to-[#1e40af]',
    borderColor: '#1e3a8a',
    pages: 'bg-blue-50'
  },
  { 
    id: 'english', 
    name: 'English',
    icon: 'E',
    color: 'from-[#ff6b35] to-[#dc2626]',
    borderColor: '#b91c1c',
    pages: 'bg-orange-50'
  },
  { 
    id: 'reasoning', 
    name: 'Logical Reasoning',
    icon: 'L',
    color: 'from-[#10b981] to-[#059669]',
    borderColor: '#047857',
    pages: 'bg-emerald-50'
  },
  { 
    id: 'gk', 
    name: 'General Knowledge',
    icon: 'G',
    color: 'from-[#a855f7] to-[#7c3aed]',
    borderColor: '#6b21a8',
    pages: 'bg-purple-50'
  },
]

const Book = ({ subject, index, isStackHovered, totalBooks, hoveredBookIndex, flippingPages }) => {
  const [isBookHovered, setIsBookHovered] = useState(false)
  
  // Center positioning - compact spacing
  const baseY = index * 15
  
  // Only spread when hovering the stack, not individual books
  const stackSpread = isStackHovered ? index * 35 : 0
  
  // Only the hovered book lifts slightly
  const hoverLift = isBookHovered ? 20 : 0
  
  // No rotation - keep books aligned
  const fanRotation = 0


  return (
    <motion.div
      initial={{ 
        y: -300, 
        opacity: 0, 
        rotateX: -60,
        scale: 0.8
      }}
      animate={{ 
        y: baseY + stackSpread - hoverLift,
        opacity: 1,
        rotateX: -8,
        rotateY: fanRotation,
        scale: isBookHovered ? 1.03 : 1,
        z: isBookHovered ? 50 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 28,
        delay: isBookHovered ? 0 : index * 0.1,
        mass: 0.8,
      }}
      onHoverStart={() => setIsBookHovered(true)}
      onHoverEnd={() => setIsBookHovered(false)}
      className="absolute"
      style={{
        transformStyle: 'preserve-3d',
        zIndex: isBookHovered ? 100 : index,
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {/* Book Container */}
      <div className="relative w-64 h-[340px]" style={{ transformStyle: 'preserve-3d' }}>
        
        {/* Front Cover - No visible borders */}
        <div 
          className={`absolute bg-gradient-to-br ${subject.color} shadow-2xl overflow-hidden`}
          style={{ 
            transform: 'translateZ(20px)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
            border: 'none',
            width: '100%',
            height: '100%',
            borderRadius: '0'
          }}
        >
          {/* Texture overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)`
          }} />
          
          {/* Light reflection */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
          
          <div className="relative h-full flex flex-col items-center justify-between p-8">
            {/* Top Icon Container */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-32 h-32 mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40 shadow-xl">
                <div className="w-24 h-24 rounded-xl bg-white/25 flex items-center justify-center">
                  <span 
                    className="text-7xl font-black text-white"
                    style={{
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}
                  >
                    {subject.icon}
                  </span>
                </div>
              </div>
              
              {/* Subject Name */}
              <h3 className="text-2xl font-black text-center text-white tracking-tight leading-tight drop-shadow-lg px-2">
                {subject.name}
              </h3>
              
              {/* Divider line */}
              <div className="w-24 h-0.5 bg-white/60 rounded-full mt-3 mb-2" />
            </div>

            {/* Bottom Badge */}
            <div className="flex flex-col items-center gap-2">
              <div className="px-6 py-2 bg-white/25 backdrop-blur-sm rounded-full border border-white/40">
                <p className="text-xs text-white font-bold uppercase tracking-widest">CUET 2024</p>
              </div>
              <p className="text-xs text-white/90 font-semibold">Complete Guide</p>
            </div>
          </div>
        </div>

        {/* Back Cover */}
        <div 
          className={`absolute bg-gradient-to-br ${subject.color} shadow-2xl`}
          style={{ 
            transform: 'translateZ(-20px) rotateY(180deg)',
            filter: 'brightness(0.92)',
            border: 'none',
            width: '100%',
            height: '100%',
            borderRadius: '0'
          }}
        />

        {/* Pages - no visible borders */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute ${subject.pages}`}
            style={{
              transform: `translateZ(${19 - i * 1.7}px)`,
              width: '100%',
              height: '100%',
              left: '0',
              top: '0',
              borderRadius: '0',
              boxShadow: 'none',
              border: 'none'
            }}
          />
        ))}

        {/* Animated Flipping Pages */}
        {[0, 1, 2].map((pageIndex) => {
          const pageKey = `${index}-${pageIndex}`
          const isFlipping = flippingPages[pageKey]
          
          return (
            <AnimatePresence key={pageKey}>
              {isFlipping && (
                <motion.div
                  className={`absolute ${subject.pages}`}
                  style={{
                    width: '50%',
                    height: '100%',
                    right: '0',
                    top: '0',
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    zIndex: 100 + pageIndex,
                    boxShadow: '-2px 0 10px rgba(0,0,0,0.2)',
                  }}
                  initial={{ rotateY: 0 }}
                  animate={{ 
                    rotateY: -180,
                  }}
                  exit={{ rotateY: 0 }}
                  transition={{ 
                    duration: 0.8,
                    delay: pageIndex * 0.1,
                    ease: [0.43, 0.13, 0.23, 0.96]
                  }}
                >
                  {/* Page texture lines */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0,0,0,0.05) 8px, rgba(0,0,0,0.05) 9px)`
                  }} />
                  
                  {/* Page shadow during flip */}
                  <motion.div 
                    className="absolute inset-0 bg-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 0.8 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )
        })}
      </div>
    </motion.div>
  )
}

export default function TextbookStack3D() {
  const [isStackHovered, setIsStackHovered] = useState(false)
  const [hoveredBookIndex, setHoveredBookIndex] = useState(null)
  const [flippingPages, setFlippingPages] = useState({})

  // Auto page flip effect - random pages flip every 3 seconds
  useEffect(() => {
    const flipInterval = setInterval(() => {
      const bookIndex = Math.floor(Math.random() * 4)
      const pageIndex = Math.floor(Math.random() * 3)
      
      setFlippingPages(prev => ({
        ...prev,
        [`${bookIndex}-${pageIndex}`]: true
      }))

      setTimeout(() => {
        setFlippingPages(prev => {
          const newState = { ...prev }
          delete newState[`${bookIndex}-${pageIndex}`]
          return newState
        })
      }, 800)
    }, 3000)

    return () => clearInterval(flipInterval)
  }, [])

  return (
    <div 
      className="relative h-[450px] w-full flex items-center justify-center"
      onMouseEnter={() => setIsStackHovered(true)}
      onMouseLeave={() => setIsStackHovered(false)}
      style={{
        perspective: '1800px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Shadow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/4 w-80 h-80">
        <div className="absolute inset-0 bg-gradient-radial from-gray-900/20 via-gray-900/8 to-transparent rounded-full blur-3xl" />
      </div>
      
      {/* Books Container */}
      <div 
        className="relative w-full h-full flex items-center justify-center" 
        style={{ transformStyle: 'preserve-3d' }}
      >
        {subjects.map((subject, index) => (
          <Book 
            key={subject.id} 
            subject={subject} 
            index={index} 
            isStackHovered={isStackHovered}
            totalBooks={subjects.length}
            hoveredBookIndex={hoveredBookIndex}
            flippingPages={flippingPages}
          />
        ))}
      </div>
    </div>
  )
}