const englishBaseQuestions = [
  {
    prompt: (level) => `Which word is a synonym for "rapid" in your Level ${level} warm-up?`,
    options: ['Slow', 'Quick', 'Late', 'Dull'],
    correctIndex: 1,
  },
  {
    prompt: (level) => `Choose the sentence with correct punctuation for Level ${level} review.`,
    options: [
      'However I will still attend the lecture.',
      'However, I will still attend the lecture.',
      'However I will still attend the lecture?',
      'However I will still attend the lecture!',
    ],
    correctIndex: 1,
  },
  {
    prompt: (level) => `Identify the antonym of "scarce" during your Level ${level} drill.`,
    options: ['Rare', 'Limited', 'Plentiful', 'Sparse'],
    correctIndex: 2,
  },
  {
    prompt: (level) => `Fill in the blank for Level ${level}: "She has been working here ____ five years."`,
    options: ['since', 'from', 'for', 'during'],
    correctIndex: 2,
  },
  {
    prompt: (level) => `Which figure of speech appears in the Level ${level} sentence "The wind whispered through the trees"?`,
    options: ['Simile', 'Personification', 'Metaphor', 'Hyperbole'],
    correctIndex: 1,
  },
  {
    prompt: (level) => `Select the sentence with correct subject-verb agreement in Level ${level}.`,
    options: [
      'The team are winning their match.',
      'The team is winning its match.',
      'The team win its match.',
      'The teams is winning its match.',
    ],
    correctIndex: 1,
  },
  {
    prompt: (level) => `Which transition best introduces a contrasting idea in Level ${level}?`,
    options: ['Furthermore', 'However', 'Consequently', 'Therefore'],
    correctIndex: 1,
  },
  {
    prompt: (level) => `Choose the correctly spelled word for Level ${level}.`,
    options: ['accomodate', 'accommodate', 'accomadate', 'accommadate'],
    correctIndex: 1,
  },
  {
    prompt: (level) => `Identify the sentence type for Level ${level}: "Please close the window."`,
    options: ['Declarative', 'Imperative', 'Interrogative', 'Exclamatory'],
    correctIndex: 1,
  },
  {
    prompt: (level) => `Which sentence uses a comma correctly in this Level ${level} item?`,
    options: [
      "Before we leave let's grab snacks.",
      'Before, we leave lets grab snacks.',
      "Before we leave, let's grab snacks.",
      'Before we, leave lets grab snacks.',
    ],
    correctIndex: 2,
  },
]

const mathematicsBaseQuestions = [
  {
    prompt: (level) => `What is the derivative of x² in your Level ${level} prep?`,
    options: ['x', '2x', 'x²', '2'],
    correctIndex: 1,
  },
  {
    prompt: (level) => `Solve for Level ${level}: 3/4 + 2/3 = ?`,
    options: ['13/12', '17/12', '23/24', '25/24'],
    correctIndex: 1,
  },
  {
    prompt: (level) => `Which number is prime in the Level ${level} check-in?`,
    options: ['21', '51', '29', '49'],
    correctIndex: 2,
  },
  {
    prompt: (level) => `If a square has a perimeter of 48 cm in Level ${level}, what is each side length?`,
    options: ['10 cm', '11 cm', '12 cm', '13 cm'],
    correctIndex: 2,
  },
  {
    prompt: (level) => `Evaluate Level ${level} warm-up: log₁₀(100).`,
    options: ['1', '2', '10', '100'],
    correctIndex: 1,
  },
  {
    prompt: (level) => `Solve for x in Level ${level}: 5x - 7 = 18.`,
    options: ['4', '5', '6', '7'],
    correctIndex: 1,
  },
  {
    prompt: (level) => `Compute Level ${level}: √144 = ?`,
    options: ['10', '11', '12', '13'],
    correctIndex: 2,
  },
  {
    prompt: (level) => `In this Level ${level} probability drill, what is the chance of a fair coin landing heads?`,
    options: ['0', '1/4', '1/2', '1'],
    correctIndex: 2,
  },
  {
    prompt: (level) => `Evaluate the Level ${level} expression: 2³ × 3.`,
    options: ['6', '8', '18', '24'],
    correctIndex: 3,
  },
  {
    prompt: (level) => `Find the area of a circle with radius 7 in your Level ${level} practice.`,
    options: ['14π', '28π', '49π', '64π'],
    correctIndex: 2,
  },
]

const englishLevelDescriptors = [
  {
    level: 1,
    title: 'Level 1 · Foundations',
    summary: 'Warm up with high-frequency grammar essentials and confident usage.',
    durationMinutes: 12,
    focus: 'Synonyms · punctuation · tone',
  },
  {
    level: 2,
    title: 'Level 2 · Sentence Craft',
    summary: 'Deepen sentence structure awareness and polish transitions.',
    durationMinutes: 14,
    focus: 'Sentence flow · agreement · connectors',
  },
  {
    level: 3,
    title: 'Level 3 · Expression',
    summary: 'Refine vocabulary nuance and figurative language control.',
    durationMinutes: 15,
    focus: 'Figurative language · diction · inference',
  },
  {
    level: 4,
    title: 'Level 4 · Precision',
    summary: 'Dial in clarity with tone management and advanced syntax.',
    durationMinutes: 16,
    focus: 'Tone · clarity · advanced structure',
  },
  {
    level: 5,
    title: 'Level 5 · Mixed Drills',
    summary: 'Blend concepts for exam-style mixed questions under time.',
    durationMinutes: 18,
    focus: 'Exam mix · pacing · accuracy',
  },
]

const mathematicsLevelDescriptors = [
  {
    level: 1,
    title: 'Level 1 · Core Skills',
    summary: 'Refresh arithmetic and algebra building blocks.',
    durationMinutes: 12,
    focus: 'Algebra · fractions · arithmetic',
  },
  {
    level: 2,
    title: 'Level 2 · Applied Practice',
    summary: 'Apply fundamentals to geometry and logarithms.',
    durationMinutes: 14,
    focus: 'Geometry · logarithms · ratios',
  },
  {
    level: 3,
    title: 'Level 3 · Speed Drills',
    summary: 'Increase pace with balanced algebra and number theory.',
    durationMinutes: 15,
    focus: 'Primes · equations · radicals',
  },
  {
    level: 4,
    title: 'Level 4 · Probability Mix',
    summary: 'Combine probability, powers, and quick calculations.',
    durationMinutes: 16,
    focus: 'Probability · exponents · mental math',
  },
  {
    level: 5,
    title: 'Level 5 · Final Sprint',
    summary: 'Simulate exam pacing with varied quantitative problems.',
    durationMinutes: 18,
    focus: 'Mixed practice · pacing · accuracy',
  },
]

function createLevels(subjectId, baseQuestions, descriptors) {
  return descriptors.map((descriptor, index) => {
    const levelNumber = descriptor.level ?? index + 1

    const questions = baseQuestions.map((baseQuestion, questionIndex) => {
      const prompt =
        typeof baseQuestion.prompt === 'function'
          ? baseQuestion.prompt(levelNumber, questionIndex + 1)
          : baseQuestion.prompt
      const options =
        typeof baseQuestion.options === 'function'
          ? baseQuestion.options(levelNumber, questionIndex + 1)
          : [...baseQuestion.options]
      const correctIndex =
        typeof baseQuestion.correctIndex === 'function'
          ? baseQuestion.correctIndex(levelNumber, questionIndex + 1, options)
          : baseQuestion.correctIndex

      return {
        id: `${subjectId}-l${levelNumber}-q${questionIndex + 1}`,
        prompt,
        options,
        correctIndex,
      }
    })

    return {
      level: levelNumber,
      title: descriptor.title,
      summary: descriptor.summary,
      durationMinutes: descriptor.durationMinutes,
      focus: descriptor.focus,
      questions,
    }
  })
}

const englishSubject = {
  id: 'english',
  name: 'English',
  badge: 'Verbal reasoning',
  headline: 'English mastery series',
  description: 'Sharpen comprehension, vocabulary, and tone control with compact levelled drills.',
  levels: createLevels('english', englishBaseQuestions, englishLevelDescriptors),
}

const mathematicsSubject = {
  id: 'mathematics',
  name: 'Mathematics',
  badge: 'Quantitative aptitude',
  headline: 'Mathematics mastery series',
  description: 'Strengthen speed, accuracy, and conceptual clarity across five focused levels.',
  levels: createLevels('mathematics', mathematicsBaseQuestions, mathematicsLevelDescriptors),
}

const questionBank = {
  english: englishSubject,
  mathematics: mathematicsSubject,
}

function getSubject(subjectId) {
  if (!subjectId) return undefined
  return questionBank[subjectId.toLowerCase()]
}

function getLevelsSummary(subjectId) {
  const subject = getSubject(subjectId)
  if (!subject) return undefined

  return subject.levels.map((level) => ({
    level: level.level,
    title: level.title,
    summary: level.summary,
    durationMinutes: level.durationMinutes,
    focus: level.focus,
    questionCount: level.questions.length,
  }))
}

function getQuestionsForLevel(subjectId, levelNumber) {
  const subject = getSubject(subjectId)
  if (!subject) return undefined
  const level = subject.levels.find((entry) => entry.level === levelNumber)
  if (!level) return undefined
  return level.questions
}

function getSubjectOverview(subjectId) {
  const subject = getSubject(subjectId)
  if (!subject) return undefined

  const totalQuestions = subject.levels.reduce((sum, level) => sum + level.questions.length, 0)

  return {
    id: subject.id,
    name: subject.name,
    badge: subject.badge,
    headline: subject.headline,
    description: subject.description,
    totalLevels: subject.levels.length,
    totalQuestions,
  }
}

module.exports = {
  questionBank,
  getSubject,
  getLevelsSummary,
  getQuestionsForLevel,
  getSubjectOverview,
}
