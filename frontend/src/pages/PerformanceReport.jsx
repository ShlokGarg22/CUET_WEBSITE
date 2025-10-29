import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import logo from '../assets/adobelogo.svg'
import { getLogoHref } from '../utils/navigation'
import { getSubjectById } from '../data/subjects'

const optionLabels = ['A', 'B', 'C', 'D']

function getStoredReport() {
  try {
    const raw = sessionStorage.getItem('pmmpLatestReport')
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.warn('Unable to read stored performance report', error)
    return null
  }
}

function PerformanceReport() {
  const location = useLocation()
  const navigate = useNavigate()
  const { subjectId } = useParams()
  const [report, setReport] = useState(() => location.state ?? getStoredReport())
  const logoHref = useMemo(() => getLogoHref(), [])

  useEffect(() => {
    if (location.state) {
      setReport(location.state)
    }
  }, [location.state])

  useEffect(() => {
    if (!report) {
      navigate('/dashboard', { replace: true })
    }
  }, [report, navigate])

  if (!report) {
    return null
  }

  const subjectLabel =
    report.subjectName || getSubjectById(report.subjectId ?? subjectId)?.name || 'Subject session'
  const totalQuestions = report.totalQuestions ?? report.questions?.length ?? 0
  const answeredCount = report.answeredCount ?? 0
  const correctCount = report.correctCount ?? 0
  const incorrectCount = report.incorrectCount ?? Math.max(answeredCount - correctCount, 0)
  const unansweredCount = report.unansweredCount ?? Math.max(totalQuestions - answeredCount, 0)
  const accuracy = report.accuracy ?? (answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0)
  const generatedAt = report.generatedAt
    ? new Date(report.generatedAt)
    : new Date()
  const reasonLabel = report.reason === 'stopped' ? 'Session ended early' : 'Session completed'
  const questionDetails = Array.isArray(report.questions) ? report.questions : []
  const incorrectDetails = questionDetails.filter((detail) => detail && detail.isCorrect !== true)
  const levelInfo = report.level ?? null
  const levelNumber = levelInfo?.number ?? report.levelNumber ?? null
  const levelTitle = levelInfo?.title ?? report.levelTitle ?? null
  const levelSummary = levelInfo?.summary ?? null
  const levelFocus = levelInfo?.focus ?? null

  const levelBadgeLabel = levelNumber
    ? `Level ${levelNumber}${levelTitle ? ` · ${levelTitle}` : ''}`
    : null

  const handleRetake = () => {
    sessionStorage.removeItem('pmmpLatestReport')
    const targetId = report.subjectId ?? subjectId
    if (targetId) {
      const state = { subjectId: targetId }
      if (levelNumber) {
        state.startLevel = levelNumber
      }
      navigate(`/session/${targetId}`, { state })
    } else {
      navigate('/dashboard')
    }
  }

  const handleDashboard = () => {
    sessionStorage.removeItem('pmmpLatestReport')
    navigate('/dashboard')
  }

  const accuracyLabel = answeredCount === 0 ? '—' : `${accuracy}%`

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-gray-900">
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Subtle grid pattern */}
      <div className="fixed inset-0 opacity-[0.4]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23cbd5e1' stroke-width='0.5'/%3E%3C/svg%3E")`
      }} />
      
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col py-0">
        <header className="flex h-20 items-center border-b border-gray-200 pb-6 pl-6 pr-6 sm:pl-10 sm:pr-10">
          <Link to={logoHref} className="inline-flex items-center transform hover:scale-105 transition-transform duration-300 -ml-2">
            <img src={logo} alt="pmmp.club" className="h-16 w-auto drop-shadow-sm" />
          </Link>
          
          <div className="ml-auto">
            <button
              type="button"
              onClick={handleDashboard}
              className="rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 shadow-lg"
            >
              Dashboard
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-12 py-12">
          <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-md px-10 py-12 shadow-xl">
            <div className="relative max-w-3xl space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {reasonLabel}
                </span>
                {levelBadgeLabel && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-green-700">
                    {levelBadgeLabel}
                  </span>
                )}
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight text-gray-900 tracking-tight">
                {subjectLabel} Performance
              </h1>
              <p className="text-lg text-gray-600">
                {levelBadgeLabel ? `${levelBadgeLabel} recap — ` : ''}You answered {correctCount} of {answeredCount} attempted questions correctly. Overall accuracy: {accuracyLabel}.
              </p>
              {levelSummary && (
                <p className="text-sm text-gray-600">
                  {levelSummary}
                  {levelFocus ? ` · Focus: ${levelFocus}` : ''}
                </p>
              )}
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Generated {generatedAt.toLocaleString()}
              </p>
              <div className="grid gap-4 pt-4 sm:grid-cols-4">
                <MetricChip label="Correct" value={correctCount} tone="success" />
                <MetricChip label="Incorrect" value={incorrectCount} tone="danger" />
                <MetricChip label="Unanswered" value={unansweredCount} tone="neutral" />
                <MetricChip label="Total" value={totalQuestions} tone="primary" />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Questions to revisit</h2>
              <span className="text-xs uppercase tracking-wide text-gray-500">
                {levelNumber ? `Level ${levelNumber} · ` : ''}{incorrectDetails.length} incorrect · {answeredCount} answered
              </span>
            </div>

            <div className="space-y-4">
              {questionDetails.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-300 bg-white/70 backdrop-blur-sm px-8 py-12 text-center text-sm text-gray-600">
                  No responses recorded for this session.
                </div>
              ) : incorrectDetails.length === 0 ? (
                <div className="rounded-3xl border border-gray-200 bg-green-50 px-8 py-12 text-center text-sm text-green-700 font-medium">
                  Perfect run—no questions to review!
                </div>
              ) : (
                incorrectDetails.map((detail, index) => {
                  const questionNumber = detail.order ?? detail.ordinal ?? detail.position ?? detail.index ?? index + 1
                  const selectedIdx =
                    typeof detail.selectedIndex === 'number' ? detail.selectedIndex : null
                  const selectedLabel =
                    selectedIdx !== null && selectedIdx >= 0
                      ? optionLabels[selectedIdx] ?? String.fromCharCode(65 + selectedIdx)
                      : null
                  const selectedText =
                    selectedIdx !== null && selectedIdx >= 0
                      ? detail.options?.[selectedIdx]
                      : 'Not answered'
                  const correctIdx = detail.correctIndex ?? -1
                  const correctLabel =
                    correctIdx >= 0 ? optionLabels[correctIdx] ?? String.fromCharCode(65 + correctIdx) : null
                  const correctText =
                    correctIdx >= 0 ? detail.options?.[correctIdx] ?? '—' : '—'
                  const status = selectedIdx === null ? 'Skipped' : 'Review'
                  const cardTone = selectedIdx === null
                      ? 'border-gray-200 bg-white text-gray-600'
                      : 'border-red-200 bg-red-50 text-red-900'

                  return (
                    <article
                      key={detail.id ?? `question-${index}`}
                      className={`rounded-3xl border px-8 py-7 shadow-lg backdrop-blur-sm ${cardTone}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-wide font-semibold">
                        <span>Question {questionNumber}</span>
                        <span>{status}</span>
                      </div>
                      <p className="mt-4 text-xl font-bold text-gray-900">
                        {detail.prompt}
                      </p>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white/60 backdrop-blur-sm px-5 py-4 border border-gray-200">
                          <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Your answer</p>
                          <p className="mt-2 text-sm font-medium text-gray-900">
                            {selectedLabel ? `${selectedLabel}. ${selectedText}` : selectedText}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white/60 backdrop-blur-sm px-5 py-4 border border-gray-200">
                          <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Correct answer</p>
                          <p className="mt-2 text-sm font-medium text-gray-900">
                            {correctLabel ? `${correctLabel}. ${correctText}` : correctText}
                          </p>
                        </div>
                      </div>
                    </article>
                  )
                })
              )}
            </div>
          </section>
        </main>

        <footer className="flex flex-wrap items-center justify-center gap-4 border-t border-gray-200 pt-8">
          <button
            type="button"
            onClick={handleRetake}
            className="rounded-full border border-blue-600 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-blue-600 transition hover:bg-blue-600 hover:text-white shadow-md"
          >
            Retake session
          </button>
          <button
            type="button"
            onClick={handleDashboard}
            className="rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800 shadow-lg"
          >
            Dashboard
          </button>
        </footer>
      </div>
    </div>
  )
}

function MetricChip({ label, value, tone }) {
  const tones = {
    success: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200'
    },
    danger: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200'
    },
    neutral: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200'
    },
    primary: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
  }

  const toneStyles = tones[tone] || tones.neutral

  return (
    <div className={`rounded-2xl px-5 py-5 text-center shadow-md border ${toneStyles.bg} ${toneStyles.text} ${toneStyles.border}`}>
      <p className="text-xs uppercase tracking-wide font-semibold opacity-70">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  )
}

export default PerformanceReport
