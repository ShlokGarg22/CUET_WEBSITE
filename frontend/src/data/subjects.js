const subjects = [
  {
    id: 'english',
    name: 'English',
    focus: 'Master comprehension and vocabulary drills.',
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    focus: 'Sharpen quantitative speed and accuracy.',
  },
]

export function getSubjectById(id) {
  if (!id) return undefined
  return subjects.find((subject) => subject.id === id.toLowerCase())
}

export default subjects
