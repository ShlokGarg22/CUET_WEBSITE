import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import logo from '../assets/adobelogo.svg'
import SlideArrowButton from '../components/animata/button/slide-arrow-button'
import { getSubjectById } from '../data/subjects'
import { API_BASE_URL } from '../config'
import { getLogoHref } from '../utils/navigation'
import { ChevronDown } from 'lucide-react'
import CountdownCarousel from '../components/CountdownCarousel'

const optionLabels = ['A', 'B', 'C', 'D']
const questionBackgrounds = ['#ECFFDF', '#DEFDFF', '#FEDFDD', '#D8E6FF']

function SubjectSession() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const subject = useMemo(() => {
    if (location.state?.subjectId) {
      const fromState = getSubjectById(location.state.subjectId)
      if (fromState) return fromState
    }
    return getSubjectById(subjectId) ?? null
  }, [location.state, subjectId])

  const [view, setView] = useState('overview')
  const [levels, setLevels] = useState([])
  const [overview, setOverview] = useState(null)
  const [levelsLoading, setLevelsLoading] = useState(true)
  const [levelsError, setLevelsError] = useState(null)
  const [pendingLevel, setPendingLevel] = useState(null)
  const [expandedChapter, setExpandedChapter] = useState(0)
  const [activeLevel, setActiveLevel] = useState(null)
  const [questions, setQuestions] = useState([])
  const [quizError, setQuizError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [answerLog, setAnswerLog] = useState([])
  const [retryToken, setRetryToken] = useState(0)
  const advanceTimeoutRef = useRef(null)
  const requestedLevelRef = useRef(
    typeof location.state?.startLevel === 'number' ? location.state.startLevel : null,
  )
  const [showCountdown, setShowCountdown] = useState(false)
  const countdownLevelRef = useRef(null)

  const logoHref = useMemo(() => getLogoHref(), [])

  const sessionBackground = useMemo(() => {
    if (view === 'quiz') {
      return questionBackgrounds[currentIndex % questionBackgrounds.length]
    }
    return '#eef3ff'
  }, [view, currentIndex])

  const activeQuestion = questions[currentIndex] ?? null
  const correctIndex = activeQuestion?.correctIndex ?? -1
  const hasAnswered = selectedIndex !== null

  const clearAdvanceTimeout = useCallback(() => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current)
      advanceTimeoutRef.current = null
    }
  }, [])

  const handleRetryLevels = useCallback(() => {
    setRetryToken((prev) => prev + 1)
  }, [])

  useEffect(() => {
    setLevels([])
    setOverview(null)
    setLevelsError(null)
    setLevelsLoading(true)
    setPendingLevel(null)
    setActiveLevel(null)
    setQuestions([])
    setQuizError(null)
    setCurrentIndex(0)
    setSelectedIndex(null)
    setAnswerLog([])
    setView('overview')
    clearAdvanceTimeout()

    if (!subject) {
      setLevelsLoading(false)
      return
    }

    const controller = new AbortController()

    ;(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/questions/${subject.id}`, {
          signal: controller.signal,
        })
        const payload = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(payload.message || 'Unable to load levels right now.')
        }

        setOverview(payload.overview ?? null)
        setLevels(Array.isArray(payload.levels) ? payload.levels : [])
      } catch (error) {
        if (error.name !== 'AbortError') {
          setLevelsError(error.message || 'Something went wrong while loading this subject.')
        }
      } finally {
        setLevelsLoading(false)
      }
    })()

    return () => controller.abort()
  }, [subject, retryToken, clearAdvanceTimeout])


  const getOptionStyles = useCallback(
    (optionIndex) => {
      if (!hasAnswered) {
        return {
          button: 'border-[#0a1029] text-[#0a1029] hover:border-[#102f76] hover:bg-[#102f76]/5',
          badge: 'border-[#0a1029] text-[#0a1029]',
        }
      }

      if (optionIndex === correctIndex) {
        return {
          button: 'border-[#2f855a] bg-[#e6f6ed] text-[#22543d]',
          badge: 'border-[#2f855a] bg-[#2f855a] text-white',
        }
      }

      if (optionIndex === selectedIndex) {
        return {
          button: 'border-[#c53030] bg-[#fde8e8] text-[#822727]',
          badge: 'border-[#c53030] text-[#c53030]',
        }
      }

      return {
        button: 'border-[#d4dae9] text-[#7c87aa]',
        badge: 'border-[#d4dae9] text-[#7c87aa]',
      }
    },
    [correctIndex, hasAnswered, selectedIndex],
  )

  const handleStartLevel = useCallback(
    async (levelNumber) => {
      if (!subject) return

      setPendingLevel(levelNumber)
      setQuizError(null)
      clearAdvanceTimeout()

      try {
        const response = await fetch(`${API_BASE_URL}/api/questions/${subject.id}?level=${levelNumber}`)
        const payload = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(payload.message || 'Unable to load questions right now.')
        }

        const fetchedQuestions = Array.isArray(payload.questions) ? payload.questions : []

        if (fetchedQuestions.length === 0) {
          throw new Error('No questions available for this level yet.')
        }

        const levelMeta =
          payload.level || levels.find((entry) => entry.level === levelNumber) || null

        setQuestions(fetchedQuestions)
        setActiveLevel(
          levelMeta
            ? {
                number: levelMeta.number ?? levelMeta.level,
                title: levelMeta.title,
                summary: levelMeta.summary,
                durationMinutes: levelMeta.durationMinutes,
                focus: levelMeta.focus,
              }
            : { number: levelNumber },
        )
        setView('quiz')
        setCurrentIndex(0)
        setSelectedIndex(null)
        setAnswerLog([])
      } catch (error) {
        setQuizError(error.message || 'Something went wrong while loading questions.')
        setView('overview')
      } finally {
        setPendingLevel(null)
      }
    },
    [subject, levels, clearAdvanceTimeout],
  )

  // Show countdown first, then actually start the selected level
  const handleBeginLevel = useCallback(
    (levelNumber) => {
      countdownLevelRef.current = levelNumber
      setShowCountdown(true)
    },
    [],
  )

  useEffect(() => {
    if (view !== 'overview') return
    const pending = requestedLevelRef.current
    if (!pending || levelsLoading) return
    const available = levels.some((level) => level.level === pending)
    if (available) {
      requestedLevelRef.current = null
      handleStartLevel(pending)
    }
  }, [levelsLoading, levels, handleStartLevel, view])

  const handleOptionSelect = useCallback(
    (index) => {
      if (view !== 'quiz' || !activeQuestion || hasAnswered) return
      clearAdvanceTimeout()
      setSelectedIndex(index)
      setAnswerLog((prev) => {
        const next = [...prev]
        next[currentIndex] = {
          questionId: activeQuestion.id,
          selectedIndex: index,
          correctIndex,
        }
        return next
      })
    },
    [view, activeQuestion, hasAnswered, clearAdvanceTimeout, currentIndex, correctIndex],
  )

  const generateReportData = useCallback(
    (reason) => {
      if (!subject || questions.length === 0) {
        return null
      }

      const levelInfo = activeLevel
        ? {
            number: activeLevel.number ?? activeLevel.level ?? null,
            title: activeLevel.title ?? null,
            summary: activeLevel.summary ?? null,
            durationMinutes: activeLevel.durationMinutes ?? null,
            focus: activeLevel.focus ?? null,
          }
        : null

      const details = questions.map((question, index) => {
        const logEntry = answerLog[index] ?? null
        const recordedSelection =
          logEntry && typeof logEntry.selectedIndex === 'number' ? logEntry.selectedIndex : null
        const isCorrect =
          recordedSelection !== null && recordedSelection === question.correctIndex

        return {
          id: question.id ?? `question-${index}`,
          prompt: question.prompt,
          options: question.options,
          correctIndex: question.correctIndex,
          selectedIndex: recordedSelection,
          isCorrect,
          order: index + 1,
        }
      })

      const totalQuestions = questions.length
      const answeredCount = details.filter((detail) => detail.selectedIndex !== null).length
      const correctCount = details.filter((detail) => detail.isCorrect).length
      const incorrectCount = answeredCount - correctCount
      const unansweredCount = totalQuestions - answeredCount
      const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0

      const payload = {
        subjectId: subject.id,
        subjectName: subject.name,
        level: levelInfo,
        generatedAt: new Date().toISOString(),
        reason,
        totalQuestions,
        answeredCount,
        correctCount,
        incorrectCount,
        unansweredCount,
        accuracy,
        questions: details,
      }

      try {
        sessionStorage.setItem('pmmpLatestReport', JSON.stringify(payload))
      } catch (storageError) {
        console.warn('Unable to persist performance report', storageError)
      }

      return payload
    },
    [activeLevel, answerLog, questions, subject],
  )

  const navigateToReport = useCallback(
    (reason) => {
      clearAdvanceTimeout()
      const payload = generateReportData(reason)
      setSelectedIndex(null)
      setAnswerLog([])
      setQuestions([])
      setActiveLevel(null)
      setView('overview')

      if (payload && subject) {
        navigate(`/session/${subject.id}/report`, { state: payload })
      } else {
        navigate('/dashboard')
      }
    },
    [clearAdvanceTimeout, generateReportData, navigate, subject],
  )

  const handleNext = useCallback(() => {
    if (!hasAnswered) return

    const isLastQuestion = currentIndex >= questions.length - 1
    if (isLastQuestion) {
      navigateToReport('completed')
      return
    }

    setCurrentIndex((prev) => prev + 1)
    setSelectedIndex(null)
    clearAdvanceTimeout()
  }, [hasAnswered, currentIndex, questions.length, navigateToReport, clearAdvanceTimeout])

  const goToDashboard = useCallback(() => {
    navigate('/dashboard')
  }, [navigate])

  const handleStop = useCallback(() => {
    if (view === 'quiz') {
      navigateToReport('stopped')
    } else {
      goToDashboard()
    }
  }, [view, navigateToReport, goToDashboard])

  useEffect(() => {
    if (view !== 'quiz' || !hasAnswered) {
      clearAdvanceTimeout()
      return
    }

    advanceTimeoutRef.current = setTimeout(() => {
      handleNext()
    }, 1000)

    return () => {
      clearAdvanceTimeout()
    }
  }, [view, hasAnswered, handleNext, clearAdvanceTimeout])

  useEffect(() => {
    if (view !== 'quiz' || !activeQuestion) {
      return
    }

    const keyMap = {
      1: 0,
      2: 1,
      3: 2,
      4: 3,
    }

    const handleKeyDown = (event) => {
      if (hasAnswered) return
      const index = keyMap[event.key]
      if (typeof index === 'number' && index < activeQuestion.options.length) {
        event.preventDefault()
        handleOptionSelect(index)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [view, activeQuestion, hasAnswered, handleOptionSelect])

  // Build two chapters with two exercises each, derived from the first 4 available levels
  const chapters = useMemo(() => {
    if (!Array.isArray(levels) || levels.length === 0) return []

    const mkExercise = (lvl, idxInChapter) =>
      lvl
        ? {
            label: `Exercise ${idxInChapter + 1}`,
            level: lvl.level,
            title: lvl.title || `Level ${lvl.level}`,
            duration: lvl.durationMinutes,
          }
        : null

    const list = []
    for (let i = 0; i < 2; i += 1) {
      const a = levels[i * 2]
      const b = levels[i * 2 + 1]
      if (!a && !b) continue
      list.push({
        number: i + 1,
        title: a?.title || `Level ${a?.level ?? i * 2 + 1}`,
        description:
          a?.summary ||
          overview?.description ||
          subject?.focus ||
          'Practice chapter with two short exercises.',
        exercises: [mkExercise(a, 0), mkExercise(b, 1)].filter(Boolean),
      })
    }
    return list
  }, [levels, overview, subject])

  if (!subject) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-[#0a1029]">
        <div className="mx-auto w-full max-w-md space-y-4 rounded-3xl border border-[#d7dbeb] bg-white px-10 py-12 text-center shadow-[0_20px_60px_rgba(16,47,118,0.08)]">
          <p className="text-sm uppercase tracking-[0.35em] text-[#6b7592]">Subject unavailable</p>
          <h1 className="font-serif-display text-3xl">Let’s head back to the dashboard</h1>
          <p className="text-sm text-[#4c5777]">We couldn’t find that focus track. Pick another subject to continue.</p>
          <button
            type="button"
            onClick={goToDashboard}
            className="inline-flex items-center justify-center rounded-full border border-[#102f76] px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#102f76] transition hover:bg-[#102f76] hover:text-white"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  const totalQuestionsForSubject = overview?.totalQuestions ?? levels.reduce((sum, level) => sum + (level.questionCount ?? 0), 0)

  return (
    <div
      className="min-h-screen w-full text-[#0a1029] transition-colors duration-500"
      style={{ backgroundColor: sessionBackground }}
    >
      <div className="flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8 sm:px-10">
          <Link to={logoHref} className="inline-flex items-center gap-3">
            <img src={logo} alt="pmmp.club" className="h-12 w-auto" />
          </Link>

          {view === 'quiz' ? (
            <SlideArrowButton
              text="Stop session"
              primaryColor="#c53030"
              textColor="#c53030"
              onClick={handleStop}
              className="text-sm sm:text-base"
            />
          ) : (
            <SlideArrowButton
              text="Dashboard"
              primaryColor="#102f76"
              textColor="#102f76"
              onClick={goToDashboard}
              className="text-sm sm:text-base"
            />
          )}
        </header>

        <main className="flex flex-1 flex-col pt-12">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col px-6 pb-14 sm:px-10">
            {view === 'overview' && (
              <div className="flex flex-1 flex-col gap-10 pb-6">
                {levelsLoading ? (
                  <div className="flex flex-1 items-center justify-center">
                    <p className="text-sm uppercase tracking-[0.35em] text-[#6b7592]">Loading levels…</p>
                  </div>
                ) : levelsError ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                    <p className="text-lg font-semibold text-[#c53030]">{levelsError}</p>
                    <button
                      type="button"
                      onClick={handleRetryLevels}
                      className="rounded-full border border-[#102f76] px-6 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-[#102f76] transition hover:bg-[#102f76] hover:text-white"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Accordion timeline with two chapters, each containing two exercises */}
                    {quizError && (
                      <div className="rounded-3xl border border-[#f8b4b4] bg-[#fee2e2] px-6 py-4 text-sm text-[#7f1d1d] shadow-[0_12px_28px_rgba(127,29,29,0.12)]">
                        {quizError}
                      </div>
                    )}

                    <section className="relative">
                      <div className="absolute left-7 top-0 bottom-0 hidden w-px bg-[#1f2b4a] sm:block" />

                      <div className="space-y-6">
                        {chapters.slice(0, 2).map((chapter, idx) => {
                          const isOpen = expandedChapter === idx
                          return (
                            <div key={idx} className="relative">
                              {/* Numbered circle */}
                              <div className="absolute -left-0.5 top-1 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#2a375e] bg-[#0b1224] text-white sm:flex">
                                <span className="rounded-full bg-[#0b1224] px-3 py-1 text-lg font-semibold text-white/90">
                                  {chapter.number}
                                </span>
                              </div>

                              {/* Header */}
                              <button
                                type="button"
                                onClick={() => setExpandedChapter(isOpen ? -1 : idx)}
                                className="flex w-full items-center justify-between rounded-2xl border border-[#ccd4f4] bg-white/95 px-6 py-5 shadow-[0_8px_24px_rgba(13,32,96,0.08)] transition hover:border-[#102f76]"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#102f76] text-sm font-semibold text-white">
                                    {chapter.number}
                                  </span>
                                  <h3 className="font-serif-display text-2xl text-[#0a1029]">{chapter.title}</h3>
                                </div>
                                <ChevronDown
                                  className={`h-6 w-6 text-[#102f76] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                />
                              </button>

                              {/* Panel */}
                              {isOpen && (
                                <div className="mt-3 rounded-2xl border border-[#1f2b4a] bg-[#0b1224] p-6 text-white shadow-[0_16px_40px_rgba(3,10,24,0.6)]">
                                  <p className="mb-5 text-sm text-white/80">{chapter.description}</p>

                                  <div className="overflow-hidden rounded-xl bg-[#101a34]">
                                    {chapter.exercises.map((ex, exIdx) => (
                                      <div
                                        key={ex.level}
                                        className={`grid grid-cols-[auto,1fr,auto] items-center gap-4 px-5 py-4 ${
                                          exIdx === 0 ? '' : 'border-t border-white/10'
                                        }`}
                                      >
                                        <span className="text-sm text-white/70">Exercise {exIdx + 1}</span>
                                        <div className="truncate text-white">{ex.title}</div>
                                        {exIdx === 0 ? (
                                          <SlideArrowButton
                                            text={pendingLevel === ex.level ? 'Starting…' : 'Start'}
                                            primaryColor="#3671ff"
                                            textColor="#3671ff"
                                            onClick={() => handleBeginLevel(ex.level)}
                                            disabled={Boolean(pendingLevel) && pendingLevel !== ex.level}
                                            className="text-sm"
                                          />
                                        ) : (
                                          <span className="inline-flex min-w-[64px] items-center justify-center rounded-md border border-white/20 px-4 py-2 text-sm text-white/50">
                                            ???
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </section>

                    {showCountdown && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                        <CountdownCarousel
                          onComplete={() => {
                            setShowCountdown(false)
                            if (typeof countdownLevelRef.current === 'number') {
                              const lvl = countdownLevelRef.current
                              countdownLevelRef.current = null
                              // after animation ends, fetch questions and enter quiz
                              handleStartLevel(lvl)
                            }
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {view === 'quiz' && activeQuestion && (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="space-y-5">
                  {activeLevel && (
                    <span className="inline-flex items-center gap-3 rounded-full border border-[#102f76]/20 bg-white/70 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.45em] text-[#102f76] shadow-[0_14px_35px_rgba(16,47,118,0.12)]">
                      <span>Level {activeLevel.number}</span>
                      {activeLevel.title && <span className="hidden sm:inline">{activeLevel.title}</span>}
                    </span>
                  )}
                  <p className="text-xs uppercase tracking-[0.35em] text-[#4b5a93]">
                    Question {currentIndex + 1} of {questions.length}
                  </p>
                  <h2 className="font-serif-display text-[clamp(2.2rem,4vw,3.4rem)] text-[#0a1029]">
                    {activeQuestion.prompt}
                  </h2>
                </div>
              </div>
            )}
          </div>

          {view === 'quiz' && activeQuestion && (
            <div className="mt-auto w-full rounded-t-[3rem] border-t border-white/30 bg-white/95 pt-12 pb-8 shadow-[0_22px_55px_rgba(16,47,118,0.12)] backdrop-blur">
              <div className="mx-auto w-full px-6 sm:px-10">
                <div className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {activeQuestion.options.map((option, index) => {
                    const styles = getOptionStyles(index)
                    const label = optionLabels[index] ?? String.fromCharCode(65 + index)
                    return (
                      <button
                        key={`${activeQuestion.id}-${index}`}
                        type="button"
                        onClick={() => handleOptionSelect(index)}
                        className={`group flex w-full items-center justify-between gap-4 rounded-full border px-6 py-4 text-left text-base font-medium transition ${styles.button}`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold uppercase tracking-[0.2em] ${styles.badge}`}
                        >
                          {label}
                        </span>
                        <span className="flex-1 truncate text-[#0a1029]">{option}</span>
                        <span className="text-xs uppercase tracking-[0.35em] text-[#9aa3c3]">
                          {index + 1}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <div className="mt-8 text-center text-sm text-[#6b7592]">
                  {hasAnswered
                    ? indexMessage(selectedIndex === correctIndex)
                    : 'Choose the answer you believe is correct or press 1-4 on your keyboard.'}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function indexMessage(isCorrect) {
  return isCorrect
    ? 'Nice! That’s the correct answer. Loading the next question…'
    : 'Not quite. We’ve marked the correct option for you—next question coming up…'
}

export default SubjectSession
