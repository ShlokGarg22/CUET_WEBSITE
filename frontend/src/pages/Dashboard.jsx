import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/adobelogo.svg'
import subjects from '../data/subjects'
import { getLogoHref } from '../utils/navigation'
import { BarChart2 } from 'lucide-react'
import AnimatedPencilLoader from '../components/AnimatedPencilLoader'

function getTimeGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 5) return 'Late-night focus'
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Night session'
}

function Dashboard() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [userName, setUserName] = useState(() => {
    try {
      const storedUser = localStorage.getItem('pmmpUser')
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        if (parsed?.name) {
          return parsed.name
        }
      }
    } catch (error) {
      console.warn('Unable to read user from storage', error)
    }
    return ''
  })
  const [hoveredCard, setHoveredCard] = useState(null)

  const greeting = useMemo(() => getTimeGreeting(), [])
  const logoHref = useMemo(() => getLogoHref(), [])
  const resolvedName = useMemo(() => {
    if (!userName) return 'friend'
    const trimmed = userName.trim()
    if (!trimmed) return 'friend'
    return trimmed.split(' ')[0]
  }, [userName])

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    localStorage.removeItem('pmmpUser')
    navigate('/')
  }, [navigate])

  const handleCourseClick = useCallback(async (subjectId) => {
    setIsNavigating(true)
    setFadeIn(false)
    await new Promise(resolve => setTimeout(resolve, 600))
    navigate(`/session/${subjectId}`, { state: { subjectId } })
  }, [navigate])

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const storedUser = localStorage.getItem('pmmpUser')
        if (!storedUser) {
          navigate('/auth/login', { replace: true })
          return
        }
        const parsed = JSON.parse(storedUser)
        if (parsed?.name) {
          setUserName(parsed.name)
        }
      } catch (error) {
        console.warn('Unable to read user from storage', error)
        navigate('/auth/login', { replace: true })
        return
      }

      try {
        const visitedFlag = localStorage.getItem('pmmpVisited') === 'true'
        if (!visitedFlag) {
          localStorage.setItem('pmmpVisited', 'true')
        }
      } catch (error) {
        console.warn('Unable to read visit state', error)
      }

      // Simulate loading time for smooth transition
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsLoading(false)
      // Trigger fade-in animation
      setTimeout(() => setFadeIn(true), 50)
    }

    loadDashboard()
  }, [navigate])

  if (isLoading || isLoggingOut) {
    return <AnimatedPencilLoader message={isLoggingOut ? "Bye bye..." : "Loading your dashboard..."} />
  }

  return (
    <div className={`transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
    <div className="relative min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-gray-900 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Subtle grid pattern */}
      <div className="fixed inset-0 opacity-[0.4]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23cbd5e1' stroke-width='0.5'/%3E%3C/svg%3E")`
      }} />
      
      <div className="relative z-10 flex min-h-screen w-full flex-col pb-16 pt-0 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex h-20 w-full items-center pl-6 pr-6 sm:pl-10 sm:pr-10">
          <Link to={logoHref} className="inline-flex items-center transform hover:scale-105 transition-transform duration-300 -ml-2">
            <img src={logo} alt="pmmp.club" className="h-16 w-auto drop-shadow-sm" />
          </Link>
          
          <div className="ml-auto">
            <button
              type="button"
              onClick={handleLogout}
              className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center gap-16 py-12">
          {/* Hero Section */}
          <section className={`space-y-8 transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 tracking-wide">
                {greeting}
              </p>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 drop-shadow-sm">
                Hey, {resolvedName}.
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              What do you want to sharpen today?
            </p>
          </section>

          {/* Course Selection */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                2 Core Focus Tracks
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 max-w-5xl mx-auto">
              {subjects.map((subject, idx) => (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => handleCourseClick(subject.id)}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  disabled={isNavigating}
                  className={`group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-md border border-gray-200 text-left shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 disabled:pointer-events-none ${
                    fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  {/* Top banner */}
                  <div className="relative h-40 w-full overflow-hidden border-b border-gray-200">
                    <div className={`absolute inset-0 transition-all duration-500 ${
                      hoveredCard === idx 
                        ? 'bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100' 
                        : 'bg-gradient-to-br from-gray-50 to-gray-100'
                    }`} />
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M20 0v40M0 20h40' stroke='%23cbd5e1' stroke-width='1'/%3E%3C/svg%3E")`
                    }} />
                  </div>

                  {/* Content */}
                  <div className="relative space-y-4 px-8 py-8 bg-white/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Course {idx + 1}
                      </span>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200">
                        <BarChart2 className="h-3.5 w-3.5 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700">Beginner</span>
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                      {subject.name}
                    </h3>
                    
                    <p className="text-base leading-relaxed text-gray-600">
                      {subject.focus}
                    </p>

                    {/* Hover indicator */}
                    <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-900">
                        <span>Start session</span>
                        <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 transition-all duration-300 ${
                    hoveredCard === idx ? 'opacity-100' : 'opacity-0'
                  }`} />
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
    </div>
  )
}

export default Dashboard
