const dotenv = require('dotenv')
const createApp = require('./app')
const connectDB = require('./config/db')

dotenv.config()

const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI

async function start() {
  await connectDB(MONGODB_URI)

  const app = createApp()

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}

start().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
