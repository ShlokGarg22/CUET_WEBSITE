const express = require('express')
const {
  getSubjectOverview,
  getLevelsSummary,
  getQuestionsForLevel,
} = require('../data/questions')

const router = express.Router()

router.get('/:subjectId', (req, res) => {
  const { subjectId } = req.params
  const normalizedSubjectId = subjectId?.toLowerCase()
  const overview = getSubjectOverview(normalizedSubjectId)

  if (!overview) {
    return res.status(404).json({ message: 'No questions found for this subject.' })
  }

  const { level: levelParam } = req.query
  if (typeof levelParam !== 'undefined') {
    const levelNumber = Number.parseInt(levelParam, 10)

    if (Number.isNaN(levelNumber) || levelNumber < 1) {
      return res.status(400).json({ message: 'Level must be a positive integer.' })
    }

    const questions = getQuestionsForLevel(normalizedSubjectId, levelNumber)
    if (!questions) {
      return res.status(404).json({ message: 'No questions available for this level.' })
    }

    const summaries = getLevelsSummary(normalizedSubjectId) ?? []
    const levelMeta = summaries.find((summary) => summary.level === levelNumber)

    return res.json({
      subjectId: normalizedSubjectId,
      subjectName: overview.name,
      level: levelMeta
        ? {
            number: levelMeta.level,
            title: levelMeta.title,
            summary: levelMeta.summary,
            durationMinutes: levelMeta.durationMinutes,
            focus: levelMeta.focus,
          }
        : { number: levelNumber },
      questions,
    })
  }

  const levels = getLevelsSummary(normalizedSubjectId) ?? []

  return res.json({
    subjectId: normalizedSubjectId,
    subjectName: overview.name,
    overview,
    levels,
  })
})

module.exports = router
