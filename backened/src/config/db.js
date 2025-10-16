const mongoose = require('mongoose')

async function connectDB(uri) {
  try {
    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })

    console.log(`MongoDB connected: ${connection.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB
