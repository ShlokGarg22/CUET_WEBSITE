import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ChevronDown, Search, Moon, Menu, X, Lock, ArrowRight } from 'lucide-react'
import logo from '../assets/adobelogo.svg'
import SlideArrowButton from '../components/animata/button/slide-arrow-button'
import { getSubjectById } from '../data/subjects'
import { API_BASE_URL } from '../config'
import { getLogoHref } from '../utils/navigation'
import CountdownCarousel from '../components/CountdownCarousel'

const optionLabels = ['A', 'B', 'C', 'D']

// Codédex-style background colors for questions
const questionBackgrounds = [
  'linear-gradient(180deg, #d9e8ff 0%, #f3f7ff 45%, #e8efff 100%)',
  'linear-gradient(180deg, #e8f5e9 0%, #f1f8f4 45%, #e8f5e9 100%)',
  'linear-gradient(180deg, #fff3e0 0%, #fff8f0 45%, #fff3e0 100%)',
  'linear-gradient(180deg, #fce4ec 0%, #fef0f5 45%, #fce4ec 100%)',
]

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
  const [fadeIn, setFadeIn] = useState(false)
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
    // Light theme gradient background for overview
    return 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)'
  }, [view, currentIndex])

  const overviewSummary = useMemo(() => {
    if (overview?.description) return overview.description
    if (subject?.focus) return subject.focus
    return 'Learn programming fundamentals through interactive exercises and hands-on practice.'
  }, [overview?.description, subject?.focus])

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
    setFadeIn(false)
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
        // Trigger fade-in animation after content loads
        setTimeout(() => setFadeIn(true), 50)
      }
    })()

    return () => controller.abort()
  }, [subject, retryToken, clearAdvanceTimeout])

  const getOptionStyles = useCallback(
    (optionIndex) => {
      if (!hasAnswered) {
        return {
          button: 'border-gray-700 text-gray-800 hover:border-blue-600 hover:bg-blue-50',
          badge: 'border-gray-700 text-gray-800',
        }
      }

      if (optionIndex === correctIndex) {
        return {
          button: 'border-green-600 bg-green-50 text-green-900',
          badge: 'border-green-600 bg-green-600 text-white',
        }
      }

      if (optionIndex === selectedIndex) {
        return {
          button: 'border-red-600 bg-red-50 text-red-900',
          badge: 'border-red-600 bg-red-600 text-white',
        }
      }

      return {
        button: 'border-gray-300 text-gray-400',
        badge: 'border-gray-300 text-gray-400',
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

  // Build chapters from levels (Codédex structure)
  const chapters = useMemo(() => {
    if (!Array.isArray(levels) || levels.length === 0) return []

    const mkExercise = (lvl, idxInChapter) =>
      lvl
        ? {
            label: `Exercise ${idxInChapter + 1}`,
            level: lvl.level,
            title: lvl.title || `Level ${lvl.level}`,
            duration: lvl.durationMinutes,
            status: idxInChapter === 0 ? 'unlocked' : 'locked',
          }
        : null

    const list = []
    for (let i = 0; i < Math.ceil(levels.length / 2); i += 1) {
      const a = levels[i * 2]
      const b = levels[i * 2 + 1]
      if (!a && !b) continue
      list.push({
        number: i + 1,
        title: a?.title || `Chapter ${i + 1}`,
        description:
          a?.summary ||
          overview?.description ||
          subject?.focus ||
          'Practice exercises to build your skills.',
        exercises: [mkExercise(a, 0), mkExercise(b, 1)].filter(Boolean),
      })
    }
    return list
  }, [levels, overview, subject])

  const firstPlayableLevel = useMemo(() => {
    for (const chapter of chapters) {
      if (Array.isArray(chapter.exercises) && chapter.exercises.length > 0) {
        return chapter.exercises[0].level
      }
    }
    return null
  }, [chapters])

  const handleHeroStart = useCallback(() => {
    if (!firstPlayableLevel) return
    handleBeginLevel(firstPlayableLevel)
  }, [firstPlayableLevel, handleBeginLevel])

  if (!subject) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-gray-900">
        <div className="mx-auto w-full max-w-md space-y-4 rounded-2xl border border-gray-300 bg-white p-10 text-center shadow-xl">
          <p className="text-sm uppercase tracking-widest text-gray-500">Subject unavailable</p>
          <h1 className="text-3xl font-bold text-gray-900">Let's head back to the dashboard</h1>
          <p className="text-sm text-gray-600">We couldn't find that subject. Pick another to continue.</p>
          <button
            type="button"
            onClick={goToDashboard}
            className="inline-flex items-center justify-center rounded-lg border border-gray-900 bg-gray-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
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
      className={`min-h-screen w-full transition-all duration-700 overflow-x-hidden ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ background: sessionBackground }}
    >
      <div className="flex min-h-screen flex-col overflow-x-hidden">
        {/* Navigation */}
        <nav className="relative z-10 w-full">
          <div className="w-full pl-6 pr-6 sm:pl-10 sm:pr-10">
            <div className="flex h-20 items-center">
              <Link to={logoHref} className="inline-flex items-center transform hover:scale-105 transition-transform duration-300 -ml-2">
                <img src={logo} alt="Logo" className="h-16 w-auto drop-shadow-sm" />
              </Link>
              
              <div className="ml-auto">
                {view === 'quiz' ? (
                  <button
                    onClick={handleStop}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition text-sm shadow-md"
                  >
                    Stop Session
                  </button>
                ) : (
                  <button
                    onClick={goToDashboard}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition text-sm shadow-md"
                  >
                    Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="flex flex-1 flex-col">
          {view === 'overview' && (
            <div className="flex-1">
              {levelsLoading ? (
                <div className="flex h-full items-center justify-center py-20">
                  <p className="text-sm uppercase tracking-widest text-gray-600">Loading levels…</p>
                </div>
              ) : levelsError ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 py-20 text-center">
                  <p className="text-lg font-semibold text-red-600">{levelsError}</p>
                  <button
                    type="button"
                    onClick={handleRetryLevels}
                    className="rounded-lg border border-blue-600 px-6 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {/* Hero Section with Light Theme */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1]" style={{
                    minHeight: '400px'
                  }}>
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-[0.15]" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23475569' stroke-width='0.5'/%3E%3C/svg%3E")`
                    }}></div>
                    
                    {/* Animated gradient orbs */}
                    <div className="absolute inset-0 overflow-hidden opacity-40">
                      <div className="absolute top-10 right-20 w-64 h-64 bg-purple-300 rounded-full blur-3xl animate-pulse"></div>
                      <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                    
                    {/* Pixel Art Scene (kept for visual interest) */}
                    <div className="absolute inset-0 opacity-20">
                      <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice">
                        {/* Sky and clouds */}
                        <rect x="0" y="0" width="1200" height="400" fill="#4a9fd8"/>
                        
                        {/* Mountains/Hills in background */}
                        <path d="M0,250 Q200,150 400,250 T800,250 T1200,250 L1200,400 L0,400 Z" fill="#5a7d6f" opacity="0.6"/>
                        <path d="M0,280 Q300,180 600,280 T1200,280 L1200,400 L0,400 Z" fill="#6a8d7f" opacity="0.7"/>
                        
                        {/* Foreground grass */}
                        <rect x="0" y="320" width="1200" height="80" fill="#5fb560"/>
                        <rect x="0" y="340" width="1200" height="60" fill="#4a9f4a"/>
                        
                        {/* Palm trees */}
                        <g transform="translate(200,250)">
                          <rect x="35" y="0" width="10" height="80" fill="#8b6f47"/>
                          <circle cx="40" cy="-10" r="25" fill="#4a9f4a"/>
                          <circle cx="40" cy="-15" r="25" fill="#5fb560"/>
                        </g>
                        
                        <g transform="translate(900,230)">
                          <rect x="35" y="0" width="10" height="100" fill="#8b6f47"/>
                          <circle cx="40" cy="-10" r="30" fill="#4a9f4a"/>
                          <circle cx="40" cy="-18" r="28" fill="#5fb560"/>
                        </g>
                        
                        {/* Snake/Python character */}
                        <g transform="translate(500,200)">
                          <path d="M0,80 Q20,60 40,80 Q60,100 80,80 Q100,60 120,80 Q140,100 160,100" 
                                stroke="#6b7c8a" strokeWidth="25" fill="none" strokeLinecap="round"/>
                          <path d="M0,80 Q20,60 40,80 Q60,100 80,80 Q100,60 120,80 Q140,100 160,100" 
                                stroke="#8b9ca8" strokeWidth="20" fill="none" strokeLinecap="round"/>
                          <circle cx="170" cy="95" r="18" fill="#6b7c8a"/>
                          <circle cx="170" cy="95" r="15" fill="#8b9ca8"/>
                          <circle cx="175" cy="92" r="6" fill="#2a2a2a"/>
                          <circle cx="177" cy="90" r="2" fill="white"/>
                        </g>
                        
                        {/* Floating platforms */}
                        <rect x="150" y="120" width="80" height="20" rx="4" fill="#4a7a4a"/>
                        <rect x="150" y="125" width="80" height="15" rx="4" fill="#5fb560"/>
                        
                        <rect x="700" y="100" width="100" height="20" rx="4" fill="#4a7a4a"/>
                        <rect x="700" y="105" width="100" height="15" rx="4" fill="#5fb560"/>
                        
                        {/* Clouds */}
                        <g opacity="0.8">
                          <ellipse cx="150" cy="60" rx="40" ry="25" fill="white"/>
                          <ellipse cx="180" cy="60" rx="35" ry="20" fill="white"/>
                          <ellipse cx="120" cy="65" rx="30" ry="18" fill="white"/>
                        </g>
                        
                        <g opacity="0.8">
                          <ellipse cx="950" cy="80" rx="45" ry="28" fill="white"/>
                          <ellipse cx="985" cy="80" rx="40" ry="23" fill="white"/>
                          <ellipse cx="915" cy="85" rx="35" ry="20" fill="white"/>
                        </g>
                      </svg>
                    </div>

                    {/* Hero Content */}
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                      <div className="max-w-2xl">
                        <div className="flex items-center space-x-3 mb-4">
                          <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full uppercase tracking-wide shadow-md">
                            Beginner
                          </span>
                          <span className="text-gray-700 text-sm font-semibold uppercase tracking-wide">COURSE</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight drop-shadow-sm">
                          {subject.name}
                        </h1>
                        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                          {overviewSummary}
                        </p>
                        <button
                          onClick={handleHeroStart}
                          disabled={!firstPlayableLevel || showCountdown}
                          className={`px-8 py-3 bg-gray-900 text-white rounded-lg font-bold text-lg hover:bg-gray-800 transition shadow-xl ${
                            !firstPlayableLevel || showCountdown ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          Start Learning for Free
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
                      {chapters.map((chapter, idx) => {
                        const isOpen = expandedChapter === idx
                        return (
                          <div key={idx} className={idx > 0 ? 'border-t border-gray-200' : ''}>
                            {/* Chapter Header */}
                            <button
                              type="button"
                              onClick={() => setExpandedChapter(isOpen ? -1 : idx)}
                              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                                  {chapter.number}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{chapter.title}</h2>
                              </div>
                              <ChevronDown
                                className={`w-6 h-6 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                              />
                            </button>

                            {/* Lessons List */}
                            {isOpen && (
                              <div className="border-t border-gray-200">
                                <div className="px-6 py-4 bg-gray-50">
                                  <p className="text-gray-600 text-sm">{chapter.description}</p>
                                </div>

                                {chapter.exercises.map((exercise, exIdx) => (
                                  <div
                                    key={exercise.level}
                                    className="border-t border-gray-200 px-6 py-4 hover:bg-gray-50 transition"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-4 flex-1">
                                        <span className="text-gray-500 font-medium">{exercise.label}</span>
                                        <div className="flex-1">
                                          <div className="text-gray-900 font-medium">{exercise.title}</div>
                                          {exercise.duration && (
                                            <div className="text-gray-500 text-sm">{exercise.duration} min</div>
                                          )}
                                        </div>
                                      </div>

                                      {exercise.status === 'unlocked' ? (
                                        <button
                                          onClick={() => handleBeginLevel(exercise.level)}
                                          disabled={pendingLevel === exercise.level}
                                          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
                                        >
                                          {pendingLevel === exercise.level ? 'Starting…' : 'Start'}
                                        </button>
                                      ) : (
                                        <button className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg font-semibold cursor-not-allowed flex items-center space-x-2">
                                          <Lock className="w-4 h-4" />
                                          <span>???</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {showCountdown && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                      <CountdownCarousel
                        onComplete={() => {
                          setShowCountdown(false)
                          if (typeof countdownLevelRef.current === 'number') {
                            const lvl = countdownLevelRef.current
                            countdownLevelRef.current = null
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
            <>
              <div className="flex flex-1 flex-col items-center justify-center text-center px-4 py-12 pt-24">
                <div className="space-y-5 max-w-3xl">
                  {activeLevel && (
                    <span className="inline-flex items-center gap-3 rounded-full border border-gray-700 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wide text-gray-900">
                      {activeLevel.title ? (
                        <span>{activeLevel.title}</span>
                      ) : (
                        <span>Level {activeLevel.number}</span>
                      )}
                    </span>
                  )}
                  <p className="text-xs uppercase tracking-widest text-gray-600">
                    Question {currentIndex + 1} of {questions.length}
                  </p>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                    {activeQuestion.prompt}
                  </h2>
                </div>
              </div>

              <div className="mt-auto w-full pt-6 pb-6">
                <div className="mx-auto w-full px-6">
                  <div className="flex gap-3 w-full">
                    {activeQuestion.options.map((option, index) => {
                      const isCorrect = index === correctIndex
                      const isSelected = index === selectedIndex
                      const shouldShowCorrect = hasAnswered && isCorrect
                      const shouldShowIncorrect = hasAnswered && isSelected && !isCorrect
                      
                      return (
                        <button
                          key={`${activeQuestion.id}-${index}`}
                          type="button"
                          onClick={() => handleOptionSelect(index)}
                          disabled={hasAnswered}
                          className="brutalist-option-button"
                          style={{
                            backgroundColor: shouldShowCorrect ? '#10b981' : shouldShowIncorrect ? '#ef4444' : '#000',
                            borderColor: shouldShowCorrect ? '#10b981' : shouldShowIncorrect ? '#ef4444' : '#fff',
                            outlineColor: shouldShowCorrect ? '#10b981' : shouldShowIncorrect ? '#ef4444' : '#000',
                            boxShadow: shouldShowCorrect 
                              ? '6px 6px 0 #059669' 
                              : shouldShowIncorrect 
                              ? '6px 6px 0 #dc2626' 
                              : '6px 6px 0 #00a4ef',
                            cursor: hasAnswered ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <div className="option-number">
                            {index + 1}
                          </div>
                          <div className="option-text">
                            <span className="option-content">{option}</span>
                          </div>
                          <div className="option-shine"></div>
                        </button>
                      )
                    })}
                  </div>
                  <div className="mt-4 text-center text-sm text-gray-600">
                    {hasAnswered
                      ? selectedIndex === correctIndex
                        ? 'Correct! Moving to next question…'
                        : 'Not quite. The correct answer is highlighted. Moving on…'
                      : 'Choose an answer or press 1-4 on your keyboard.'}
                  </div>
                </div>
              </div>

              <style jsx>{`
                .brutalist-option-button {
                  display: flex;
                  align-items: center;
                  cursor: pointer;
                  flex: 1;
                  height: 60px;
                  color: #fff;
                  text-decoration: none;
                  font-family: Arial, sans-serif;
                  font-weight: bold;
                  border: 3px solid #fff;
                  outline: 3px solid #000;
                  transition: all 0.1s ease-out;
                  padding: 0 15px;
                  box-sizing: border-box;
                  position: relative;
                  overflow: hidden;
                }
                
                .option-shine {
                  content: "";
                  position: absolute;
                  top: 0;
                  left: -100%;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 255, 255, 0.8),
                    transparent
                  );
                  z-index: 1;
                  transition: none;
                  opacity: 0;
                }
                
                @keyframes slide {
                  0% {
                    left: -100%;
                  }
                  100% {
                    left: 100%;
                  }
                }
                
                .brutalist-option-button:not(:disabled):hover .option-shine {
                  opacity: 1;
                  animation: slide 2s infinite;
                }
                
                .brutalist-option-button:not(:disabled):hover {
                  transform: translate(-4px, -4px);
                  box-shadow: 10px 10px 0 #000 !important;
                }
                
                .brutalist-option-button:not(:disabled):active {
                  transform: translate(4px, 4px);
                  box-shadow: 0px 0px 0 #00a4ef !important;
                  background-color: #fff !important;
                  color: #000;
                  border-color: #000;
                }
                
                .brutalist-option-button:disabled {
                  cursor: not-allowed;
                  opacity: 0.95;
                }
                
                .option-number {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 32px;
                  height: 32px;
                  background-color: rgba(255, 255, 255, 0.2);
                  border: 2px solid rgba(255, 255, 255, 0.4);
                  border-radius: 4px;
                  margin-right: 12px;
                  flex-shrink: 0;
                  font-size: 18px;
                  font-weight: 900;
                  transition: transform 0.2s ease-out;
                  position: relative;
                  z-index: 2;
                }
                
                .brutalist-option-button:not(:disabled):hover .option-number {
                  transform: rotate(-10deg) scale(1.1);
                  background-color: rgba(255, 255, 255, 0.3);
                }
                
                .brutalist-option-button:not(:disabled):active .option-number {
                  transform: rotate(10deg) scale(0.9);
                  background-color: rgba(0, 0, 0, 0.1);
                  color: #000;
                }
                
                .option-text {
                  display: flex;
                  line-height: 1.2;
                  transition: transform 0.2s ease-out;
                  position: relative;
                  z-index: 2;
                }
                
                .brutalist-option-button:not(:disabled):hover .option-text {
                  transform: skew(-5deg);
                }
                
                .brutalist-option-button:not(:disabled):active .option-text {
                  transform: skew(5deg);
                  color: #000;
                }
                
                .option-content {
                  font-size: 14px;
                  text-transform: uppercase;
                  font-weight: 700;
                }
              `}</style>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default SubjectSession