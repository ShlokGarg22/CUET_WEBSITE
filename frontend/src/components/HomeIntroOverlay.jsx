import { useEffect, useState } from 'react'

const WORD_SEQUENCE = [
  { word: 'Are', gradient: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)' },
  { word: 'you', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
  { word: 'ready', gradient: 'linear-gradient(135deg, #111827 0%, #0b1120 100%)' },
  { word: 'for', gradient: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' },
  { word: 'the', gradient: 'linear-gradient(135deg, #0f172a 0%, #1f2937 100%)' },
  { word: 'preparation', gradient: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)' },
  { word: 'of', gradient: 'linear-gradient(135deg, #0f141f 0%, #111827 100%)' },
  { word: 'CUET?', gradient: 'linear-gradient(135deg, #111827 0%, #1e293b 100%)' },
]

function HomeIntroOverlay({ pace = 300, linger = 420 }) {
  const [index, setIndex] = useState(0)
  const [isLeaving, setIsLeaving] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    if (isLeaving) return undefined

    if (index >= WORD_SEQUENCE.length - 1) {
      const finalTimer = setTimeout(() => setIsLeaving(true), Math.max(linger, pace))
      return () => clearTimeout(finalTimer)
    }

    const timer = setTimeout(
      () => setIndex((prev) => Math.min(prev + 1, WORD_SEQUENCE.length - 1)),
      Math.max(140, pace),
    )

    return () => clearTimeout(timer)
  }, [index, pace, linger, isLeaving])

  useEffect(() => {
    if (!isLeaving) return undefined

    const hideTimer = setTimeout(() => setIsHidden(true), 650)
    return () => clearTimeout(hideTimer)
  }, [isLeaving])

  if (isHidden) {
    return null
  }

  const safeIndex = Math.min(index, WORD_SEQUENCE.length - 1)
  const { word, gradient } = WORD_SEQUENCE[safeIndex]
  const completedWords = WORD_SEQUENCE.map((item) => item.word.toUpperCase())

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center overflow-hidden transition-all duration-700 ease-out ${
        isLeaving ? 'pointer-events-none opacity-0 blur-[2px]' : 'opacity-100'
      }`}
      style={{ background: gradient }}
      onClick={() => setIsLeaving(true)}
      aria-hidden="true"
    >
      <div className="relative flex flex-col items-center gap-7">
        <div
          className={`flex flex-wrap justify-center gap-x-3 gap-y-2 text-[0.65rem] uppercase tracking-[0.55em] text-white/70 transition-all duration-500 ${
            isLeaving ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          {completedWords.map((token, tokenIndex) => (
            <span
              key={`${token}-${tokenIndex}`}
              className={`transition-colors duration-300 ${
                tokenIndex === safeIndex
                  ? 'text-white'
                  : tokenIndex < safeIndex
                    ? 'text-white/40'
                    : 'text-white/20'
              }`}
            >
              {token}
            </span>
          ))}
        </div>
        <span
          className={`font-serif-display text-[clamp(3rem,12vw,6.5rem)] font-semibold tracking-tight text-white transition-all duration-500 ease-out ${
            isLeaving ? 'scale-95 opacity-0' : 'scale-110 opacity-100'
          }`}
        >
          {word}
        </span>
        <span
          className={`text-sm font-serif-text text-white/70 transition-opacity duration-400 ${
            isLeaving ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Tap to skip
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(30,58,138,0.45),transparent_55%)] transition-opacity duration-700" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(15,23,42,0.55),transparent_60%)] transition-opacity duration-700" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(148,163,184,0.25)_0%,rgba(148,163,184,0.05)_45%,rgba(148,163,184,0.35)_100%)] mix-blend-screen" />
    </div>
  )
}

export default HomeIntroOverlay
