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
    <div className="min-h-screen bg-gradient-to-br from-[#eef3ff] via-white to-[#f8faff] text-[#0a1029]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10">
        <header className="flex items-center justify-between border-b border-[#d7dbeb] pb-6">
          <Link to={logoHref} className="inline-flex items-center gap-3">
            <img src={logo} alt="pmmp.club" className="h-12 w-auto" />
          </Link>
          <button
            type="button"
            onClick={handleDashboard}
            className="rounded-full border border-[#0a1029] px-6 py-2 text-sm font-semibold text-[#0a1029] transition hover:bg-[#0a1029] hover:text-white"
          >
            Dashboard
          </button>
        </header>

        <main className="flex flex-1 flex-col gap-12 py-12">
          <section className="relative overflow-hidden rounded-[40px] border border-[#d7dbeb] bg-white/90 px-10 py-12 shadow-[0_24px_60px_rgba(15,39,115,0.16)] backdrop-blur">
            <div className="absolute inset-y-0 right-0 hidden w-[45%] bg-[radial-gradient(circle_at_top,rgba(16,47,118,0.12),transparent_65%)] sm:block" />
            <div className="relative max-w-3xl space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-3 rounded-full border border-[#102f76]/20 bg-[#102f76]/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.45em] text-[#102f76]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#35a0ff]" />
                  {reasonLabel}
                </span>
                {levelBadgeLabel && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#2f855a]/25 bg-[#ecffdf] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.45em] text-[#1f4614]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2f855a]" />
                    {levelBadgeLabel}
                  </span>
                )}
              </div>
              <h1 className="font-serif-display text-[clamp(2.6rem,5vw,4.2rem)] leading-tight text-[#0a1029]">
                {subjectLabel} performance snapshot
              </h1>
              <p className="text-base text-[#4a5480] sm:text-lg">
                {levelBadgeLabel ? `${levelBadgeLabel} recap — ` : ''}You answered {correctCount} of {answeredCount} attempted questions correctly. Overall accuracy: {accuracyLabel}.
              </p>
              {levelSummary && (
                <p className="text-sm text-[#4a5480]">
                  {levelSummary}
                  {levelFocus ? ` · Focus: ${levelFocus}` : ''}
                </p>
              )}
              <p className="text-xs uppercase tracking-[0.4em] text-[#9aa3c3]">
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
              <h2 className="font-serif-display text-[clamp(1.8rem,3vw,2.6rem)] text-[#0a1029]">Questions to revisit</h2>
              <span className="text-xs uppercase tracking-[0.4em] text-[#7c87aa]">
                {levelNumber ? `Level ${levelNumber} · ` : ''}{incorrectDetails.length} incorrect · {answeredCount} answered
              </span>
            </div>

            <div className="space-y-4">
              {questionDetails.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#d7dbeb] bg-white/70 px-8 py-12 text-center text-sm text-[#4a5480]">
                  No responses recorded for this session.
                </div>
              ) : incorrectDetails.length === 0 ? (
                <div className="rounded-3xl border border-[#d7dbeb] bg-white px-8 py-12 text-center text-sm text-[#2f855a]">
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
                      ? 'border-[#d4dae9] bg-white text-[#4a5480]'
                      : 'border-[#c53030] bg-[#fedfdd] text-[#73201b]'

                  return (
                    <article
                      key={detail.id ?? `question-${index}`}
                      className={`rounded-3xl border px-8 py-7 shadow-[0_18px_45px_rgba(15,39,115,0.08)] ${cardTone}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.35em]">
                        <span>Question {questionNumber}</span>
                        <span>{status}</span>
                      </div>
                      <p className="mt-4 font-serif-display text-xl text-[#0a1029]">
                        {detail.prompt}
                      </p>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white/80 px-5 py-4 text-[#0a1029]">
                          <p className="text-[11px] uppercase tracking-[0.4em] text-[#7c87aa]">Your answer</p>
                          <p className="mt-2 text-sm font-medium">
                            {selectedLabel ? `${selectedLabel}. ${selectedText}` : selectedText}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white/80 px-5 py-4 text-[#0a1029]">
                          <p className="text-[11px] uppercase tracking-[0.4em] text-[#7c87aa]">Correct answer</p>
                          <p className="mt-2 text-sm font-medium">
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

        <footer className="flex flex-wrap items-center justify-center gap-4 border-t border-[#d7dbeb] pt-8">
          <button
            type="button"
            onClick={handleRetake}
            className="rounded-full border border-[#102f76] px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#102f76] transition hover:bg-[#102f76] hover:text-white"
          >
            Retake session
          </button>
          <button
            type="button"
            onClick={handleDashboard}
            className="rounded-full border border-[#0a1029] px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#0a1029] transition hover:bg-[#0a1029] hover:text-white"
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
      bg: 'bg-[#ecffdf]',
      text: 'text-[#1f4614]',
    },
    danger: {
      bg: 'bg-[#fedfdd]',
      text: 'text-[#73201b]',
    },
    neutral: {
      bg: 'bg-white',
      text: 'text-[#4a5480]',
    },
    primary: {
      bg: 'bg-[#deedff]',
      text: 'text-[#123b6d]',
    },
  }

  const toneStyles = tones[tone] || tones.neutral

  return (
    <div className={`rounded-3xl px-5 py-5 text-center shadow-[0_12px_32px_rgba(15,39,115,0.08)] ${toneStyles.bg} ${toneStyles.text}`}>
      <p className="text-[11px] uppercase tracking-[0.45em] opacity-70">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  )
}

export default PerformanceReport
