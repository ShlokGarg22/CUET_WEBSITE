import React, { useEffect, useRef, useState } from 'react'

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

export default function CountdownCarousel({ onComplete, className = '' }) {
  const [currentNumber, setCurrentNumber] = useState(3)
  const [progress, setProgress] = useState(0)
  const [animating, setAnimating] = useState(false)
  const completedRef = useRef(false)
  const completionTimeoutRef = useRef(null)

  useEffect(() => {
    completedRef.current = false
    const startTimeout = setTimeout(() => {
      setAnimating(true)
    }, 400)

    return () => clearTimeout(startTimeout)
  }, [])

  useEffect(() => () => {
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current)
      completionTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!animating) return

    const startTime = performance.now()
    const transitionDuration = 800
    let frameId

    const stepAnimation = (timestamp) => {
      const elapsed = timestamp - startTime

      if (elapsed < transitionDuration) {
        const ratio = easeInOut(Math.min(1, elapsed / transitionDuration))
        setCurrentNumber(3)
        setProgress(ratio)
        frameId = requestAnimationFrame(stepAnimation)
        return
      }

      if (elapsed < transitionDuration * 2) {
        const ratio = easeInOut(Math.min(1, (elapsed - transitionDuration) / transitionDuration))
        setCurrentNumber(2)
        setProgress(ratio)
        frameId = requestAnimationFrame(stepAnimation)
        return
      }

      setCurrentNumber(1)
      setProgress(1)
      setAnimating(false)

      if (!completedRef.current && typeof onComplete === 'function') {
        completedRef.current = true
        completionTimeoutRef.current = setTimeout(() => {
          onComplete()
        }, 400)
      }
    }

    frameId = requestAnimationFrame(stepAnimation)

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [animating, onComplete])

  const getOutgoingY = (value) => value * 100
  const getIncomingY = (value) => (1 - value) * 100

  const outgoingY = getOutgoingY(progress)
  const incomingY = getIncomingY(progress)

  const getColor = (num) => (num === 2 ? '#FADCD9' : '#4CAF50')

  return (
    <div className={`flex min-h-[60vh] w-full items-center justify-center bg-white overflow-hidden ${className}`}>
      <div className="relative w-full max-w-2xl aspect-square">
        {currentNumber > 1 && (
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: '50%',
              top: `${50 + outgoingY}%`,
              transform: 'translate(-50%, -50%)',
              width: '50%',
            }}
          >
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: '80%',
                paddingBottom: '80%',
                backgroundColor: getColor(currentNumber),
              }}
            >
              <span
                className="absolute inset-0 flex items-center justify-center text-black"
                style={{
                  fontFamily: 'Didot, "Bodoni MT", "Bodoni 72", serif',
                  fontSize: 'clamp(4rem, 20vw, 12rem)',
                  fontWeight: 400,
                }}
              >
                {currentNumber}
              </span>
            </div>
          </div>
        )}

        {currentNumber > 1 && (
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: '50%',
              top: `${50 + incomingY}%`,
              transform: 'translate(-50%, -50%)',
              width: '50%',
            }}
          >
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: '80%',
                paddingBottom: '80%',
                backgroundColor: getColor(currentNumber - 1),
              }}
            >
              <span
                className="absolute inset-0 flex items-center justify-center text-black"
                style={{
                  fontFamily: 'Didot, "Bodoni MT", "Bodoni 72", serif',
                  fontSize: 'clamp(4rem, 20vw, 12rem)',
                  fontWeight: 400,
                }}
              >
                {currentNumber - 1}
              </span>
            </div>
          </div>
        )}

        {currentNumber === 1 && (
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50%',
            }}
          >
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: '80%',
                paddingBottom: '80%',
                backgroundColor: '#4CAF50',
              }}
            >
              <span
                className="absolute inset-0 flex items-center justify-center text-black"
                style={{
                  fontFamily: 'Didot, "Bodoni MT", "Bodoni 72", serif',
                  fontSize: 'clamp(4rem, 20vw, 12rem)',
                  fontWeight: 400,
                }}
              >
                1
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
