const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const questionRoutes = require('./routes/questionRoutes')
const { notFound, errorHandler } = require('./middleware/errorHandler')

function createApp() {
  const app = express()

  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
  app.use(express.json())

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/questions', questionRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}

module.exports = createApp
