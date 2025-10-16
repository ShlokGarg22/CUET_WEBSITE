const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const User = require('../models/User')

function handleValidationErrors(req) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed')
    error.statusCode = 422
    error.details = errors.array()
    throw error
  }
}

async function register(req, res, next) {
  try {
    handleValidationErrors(req)

    const { name, email, password, phone } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(409)
      throw new Error('Email is already registered')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    })

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    })
  } catch (error) {
    next(error)
  }
}

async function login(req, res, next) {
  try {
    handleValidationErrors(req)

    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      res.status(401)
      throw new Error('Invalid email or password')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(401)
      throw new Error('Invalid email or password')
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
}
