import { useEffect, useMemo, useRef, useState, useCallback } from 'react'

const MIN_OPACITY = 0.05
const MAX_OPACITY = 1

const ScrollHighlightText = () => {
  const lines = useMemo(
    () => [
      'master your entrance journey',
      'build relentless momentum',
      'unlock confidence in every mock',
      'embrace disciplined revision rituals',
      'track progress with precision analytics',
      'stay calm under mounting exam pressure',
      'celebrate every incremental micro win',
      'arrive ready for the CUET spotlight',
    ],
    [],
  )

  const words = useMemo(() => lines.map((line) => line.split(' ')), [lines])

  const [opacities, setOpacities] = useState(() =>
    words.map((lineWords) => lineWords.map(() => MIN_OPACITY)),
  )
  const wordRefs = useRef([])
  const activeWords = useRef(new Set())
  const visitedWords = useRef(new Set())
  const ticking = useRef(false)
  const targetOpacities = useRef([])
  const animatedOpacities = useRef([])
  const animationFrame = useRef(null)
  const lastScrollY = useRef(0)

  const animateTowardTargets = useCallback(() => {
    const targets = targetOpacities.current

    if (!targets.length) {
      animationFrame.current = null
      return
    }

    let needsNext = false

    const updated = targets.map((targetLine, lineIndex) => {
      const previousLine = animatedOpacities.current[lineIndex] || []
      return targetLine.map((target, wordIndex) => {
        const currentValue = previousLine[wordIndex] ?? MIN_OPACITY
  const nextValue = currentValue + (target - currentValue) * 0.05

        if (Math.abs(nextValue - target) > 0.003) {
          needsNext = true
          return nextValue
        }

        return target
      })
    })

    animatedOpacities.current = updated
    setOpacities(updated)

    if (needsNext) {
      animationFrame.current = requestAnimationFrame(animateTowardTargets)
    } else {
      animationFrame.current = null
    }
  }, [])

  const startAnimation = useCallback(() => {
    if (animationFrame.current === null) {
      animationFrame.current = requestAnimationFrame(animateTowardTargets)
    }
  }, [animateTowardTargets])

  const updateOpacities = useCallback(() => {
    const viewportCenter = window.innerHeight / 2
    const highlightRadius = window.innerHeight * 0.08
    const previousScrollY = lastScrollY.current
    const currentScrollY = window.scrollY || window.pageYOffset || 0
    const scrollingDown = currentScrollY >= previousScrollY
    lastScrollY.current = currentScrollY

  let highlightKey = null
  let highlightDistance = Infinity
  let fadeKey = null
  let fadeDistance = Infinity

    const info = words.map((lineWords, lineIndex) =>
      lineWords.map((_, wordIndex) => {
        const ref = wordRefs.current[lineIndex]?.[wordIndex]
        const key = `${lineIndex}-${wordIndex}`
        const isActive = activeWords.current.has(key)
        let isVisited = visitedWords.current.has(key)

        if (!ref) {
          if (!scrollingDown && isVisited) {
            visitedWords.current.delete(key)
            isVisited = false
          }
          return {
            key,
            hasRef: false,
            isActive,
            isVisited,
            proximity: 0,
            distance: Infinity,
            adjustedCenter: null,
          }
        }

        const rect = ref.getBoundingClientRect()
        const elementCenter = rect.top + rect.height / 2
        const wordCount = Math.max(lineWords.length - 1, 1)
        const progress = wordIndex / wordCount
        const offsetMagnitude = highlightRadius * 0.85
        const offset = (0.5 - progress) * offsetMagnitude
        const adjustedCenter = scrollingDown
          ? elementCenter - offset
          : elementCenter + offset
        const distance = Math.abs(viewportCenter - adjustedCenter)

        if (scrollingDown && adjustedCenter <= viewportCenter - highlightRadius * 0.05) {
          visitedWords.current.add(key)
          isVisited = true
        } else if (!scrollingDown && adjustedCenter >= viewportCenter + highlightRadius * 0.15) {
          visitedWords.current.delete(key)
          isVisited = false
        }

        const proximity = Math.max(0, 1 - distance / highlightRadius)

        if (scrollingDown) {
          if (!isVisited && isActive && proximity > 0 && distance < highlightDistance) {
            highlightDistance = distance
            highlightKey = key
          }
        } else {
          if (isVisited && isActive && proximity > 0 && distance < fadeDistance) {
            fadeDistance = distance
            fadeKey = key
          }
        }

        return {
          key,
          hasRef: true,
          isActive,
          isVisited,
          proximity,
          distance,
          adjustedCenter,
        }
      }),
    )

    if (!scrollingDown && fadeKey) {
      visitedWords.current.delete(fadeKey)
    }

    const next = info.map((lineWords) =>
      lineWords.map((data) => {
        const isStillVisited = visitedWords.current.has(data.key)

        if (isStillVisited) {
          return MAX_OPACITY
        }

        if (!data.isActive || !data.hasRef) {
          return MIN_OPACITY
        }

        if (scrollingDown) {
          if (data.key !== highlightKey) {
            return MIN_OPACITY
          }

          const eased = data.proximity * data.proximity
          return MIN_OPACITY + eased * (MAX_OPACITY - MIN_OPACITY)
        }

        if (fadeKey && data.key === fadeKey && data.adjustedCenter !== null) {
          const fadeStart = viewportCenter + highlightRadius * 0.15
          const fadeEnd = viewportCenter + highlightRadius * 1.1
          const clamped = Math.min(
            1,
            Math.max(0, (data.adjustedCenter - fadeStart) / (fadeEnd - fadeStart || 1)),
          )
          const eased = clamped * clamped
          return MAX_OPACITY - eased * (MAX_OPACITY - MIN_OPACITY)
        }

        return MIN_OPACITY
      }),
    )

    targetOpacities.current = next
    startAnimation()
    ticking.current = false
  }, [words, startAnimation])

  const requestTick = useCallback(() => {
    if (!ticking.current) {
      ticking.current = true
      requestAnimationFrame(updateOpacities)
    }
  }, [updateOpacities])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const lineIndex = Number(entry.target.dataset.lineIndex)
          const wordIndex = Number(entry.target.dataset.wordIndex)
          if (Number.isNaN(lineIndex) || Number.isNaN(wordIndex)) return

          const key = `${lineIndex}-${wordIndex}`
          if (entry.isIntersecting) {
            activeWords.current.add(key)
            requestTick()
          } else {
            activeWords.current.delete(key)
            if (!targetOpacities.current[lineIndex]) {
              targetOpacities.current[lineIndex] = []
            }
            targetOpacities.current[lineIndex][wordIndex] = visitedWords.current.has(key)
              ? MAX_OPACITY
              : MIN_OPACITY
            startAnimation()
          }
        })
      },
      { threshold: [0, 0.15, 0.4, 1] },
    )

    words.forEach((lineWords, lineIndex) => {
      lineWords.forEach((_, wordIndex) => {
        const ref = wordRefs.current[lineIndex]?.[wordIndex]
        if (ref) observer.observe(ref)
      })
    })

    return () => observer.disconnect()
  }, [requestTick, words, startAnimation])

  useEffect(() => {
    const handleScroll = () => requestTick()
    const handleResize = () => requestTick()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    requestTick()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [requestTick])

  useEffect(() => {
    activeWords.current.clear()
    visitedWords.current.clear()
    wordRefs.current = []
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current)
      animationFrame.current = null
    }

    const initial = words.map((lineWords) => lineWords.map(() => MIN_OPACITY))
    targetOpacities.current = initial.map((line) => [...line])
    animatedOpacities.current = initial.map((line) => [...line])
    setOpacities(initial)
    lastScrollY.current = window.scrollY || window.pageYOffset || 0
    requestTick()
  }, [words, requestTick])

  useEffect(
    () => () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current)
      }
    },
    [],
  )

  return (
    <section className="bg-[#102F76] pt-10 pb-24 text-white">
      <div className="mx-auto max-w-4xl px-6 sm:px-12">
        <p className="mb-12 font-serif-text text-sm uppercase tracking-[0.35em] text-white/70">
          cuet mastery
        </p>
        <div className="space-y-6 text-left">
          {words.map((lineWords, lineIndex) => (
            <p
              key={lines[lineIndex]}
              className="font-serif-display text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.18] text-white"
            >
              {lineWords.map((word, wordIndex) => (
                <span key={`${word}-${wordIndex}`} className="inline">
                  <span
                    data-line-index={lineIndex}
                    data-word-index={wordIndex}
                    ref={(el) => {
                      if (!wordRefs.current[lineIndex]) {
                        wordRefs.current[lineIndex] = []
                      }
                      wordRefs.current[lineIndex][wordIndex] = el
                    }}
                    className="inline-block pr-3 transition-opacity duration-300 ease-out"
                    style={{ opacity: opacities[lineIndex]?.[wordIndex] ?? MIN_OPACITY }}
                  >
                    {word}
                  </span>
                  {wordIndex !== lineWords.length - 1 ? <span className="inline-block pr-[0.15em]" aria-hidden="true">&nbsp;</span> : null}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ScrollHighlightText
