import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function GoogleCallback() {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search)
      const code = params.get('code')
      const errorParam = params.get('error')

      if (errorParam) {
        setError('Google authentication failed. Please try again.')
        setTimeout(() => navigate('/auth/login'), 2000)
        return
      }

      if (!code) {
        setError('No authorization code received.')
        setTimeout(() => navigate('/auth/login'), 2000)
        return
      }

      try {
        // Here you would typically send the code to your backend
        // For now, we'll simulate a successful login
        console.log('Authorization code:', code)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock user data
        const mockUser = {
          email: 'user@gmail.com',
          name: 'Google User',
          provider: 'google'
        }
        
        // Store user data
        localStorage.setItem('pmmpUser', JSON.stringify(mockUser))
        
        // Redirect to dashboard
        navigate('/dashboard')
      } catch (err) {
        setError('Authentication failed. Please try again.')
        setTimeout(() => navigate('/auth/login'), 2000)
      }
    }

    handleCallback()
  }, [location, navigate])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div className="space-y-4">
            <div className="text-red-400 text-lg">{error}</div>
            <div className="text-gray-400">Redirecting...</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            <div className="text-white text-lg">Completing sign in...</div>
            <div className="text-gray-400 text-sm">Please wait</div>
          </div>
        )}
      </div>
    </div>
  )
}
