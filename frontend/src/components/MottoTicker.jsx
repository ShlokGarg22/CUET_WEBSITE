import { useEffect, useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'

const MottoTicker = () => {
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const marqueeTransition = useMemo(
    () => ({ 
      repeat: Infinity, 
      duration: isHovered ? 20 : 40, // Speed up on hover
      ease: 'linear', 
      repeatType: 'loop' 
    }),
    [isHovered],
  )

  const mottos = useMemo(
    () => [
      { text: 'Practice'},
      { text: 'Perfection'},
      { text: 'Dedication'},
      { text: 'Excellence'},
      { text: 'Consistency'},
      { text: 'Practice' },
      { text: 'Perfection'},
      { text: 'Dedication'},
      { text: 'Excellence'},
      { text: 'Consistency'}

    ],
    [],
  )

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const renderItems = (arr) =>
    arr.map((motto, index) => (
      <Motion.div
        key={`${motto.text}-${index}`}
        className="group flex cursor-pointer items-center"
        whileHover={{ scale: 1.10 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-lg font-semibold tracking-wide text-white transition-colors duration-200 group-hover:text-[#c9d9ff]">
          {motto.text}
        </span>
        <span className="mx-8 flex-shrink-0 text-xl text-white/30">•</span>
      </Motion.div>
    ))

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center bg-[#102F76] py-3 text-sm text-white">
        Preparing for CUET...
      </div>
    )
  }

  return (
    <div 
      className="w-full overflow-hidden bg-[#102F76] py-[0.75rem] relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated shimmer effect */}
      <Motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      />
      
      <Motion.div
        initial={{ x: '0%' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={marqueeTransition}
        className="flex w-max items-center whitespace-nowrap gap-8 relative z-10"
      >
        <div className="flex items-center" aria-hidden="false">
          {renderItems(mottos)}
        </div>
        <div className="flex items-center" aria-hidden="true">
          {renderItems(mottos)}
        </div>
      </Motion.div>
    </div>
  )
}

export default MottoTicker
