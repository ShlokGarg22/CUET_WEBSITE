import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import logo from '../assets/adobelogo.svg'
import { getGoogleAuthUrl } from '../config/googleAuth'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth
    window.location.href = getGoogleAuthUrl()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (!formData.email.trim()) {
      setError('Please enter your email')
      return
    }
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email')
      return
    }
    if (!formData.password) {
      setError('Please enter your password')
      return
    }

    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockUser = { email: formData.email, name: 'User' }
      localStorage.setItem('pmmpUser', JSON.stringify(mockUser))
      navigate('/dashboard')
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex font-['Inter',sans-serif]">
      
      {/* Left Side - Gradient Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 animate-gradient-shift">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          
          {/* Large floating orbs for depth */}
          <div className="absolute -top-10 -left-10 w-96 h-96 bg-emerald-400/40 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-10 -right-10 w-[500px] h-[500px] bg-teal-400/40 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-400/30 rounded-full blur-3xl animate-float-reverse" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-emerald-300/35 rounded-full blur-2xl animate-pulse-visible" />
          
          {/* Animated mesh gradient overlay */}
          <div className="absolute inset-0 opacity-40 mix-blend-soft-light">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-300 via-teal-400 to-cyan-300 animate-gradient-rotate" />
          </div>
          
          {/* Animated light rays */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent animate-light-ray-1" />
            <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent animate-light-ray-2" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center">
            <img src={logo} alt="Logo" className="h-12 w-auto drop-shadow-lg" />
          </Link>

          {/* Welcome Text */}
          <div className="space-y-6">
            <h1 className="text-6xl font-bold text-white leading-tight">
              Welcome Back
            </h1>
            <p className="text-emerald-200/80 text-xl font-light">
              Sign in to continue your journey
            </p>
          </div>

          {/* Footer */}
          <div className="space-y-2">
            <p className="text-emerald-200/40 text-sm">
              Don't have an account?
            </p>
            <Link 
              to="/auth/signup"
              className="inline-block text-white font-semibold hover:text-emerald-200 transition-colors"
            >
              Create account →
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center">
              <img src={logo} alt="Logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Log In</h2>
            <p className="text-gray-400">Enter your credentials to continue</p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl mb-6"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0a0a0a] text-gray-500">Or</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="eg. john@email.com"
                className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <AiFillEyeInvisible className="text-xl" />
                  ) : (
                    <AiFillEye className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-gray-400">
            Don't have an account?{' '}
            <Link 
              to="/auth/signup" 
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}