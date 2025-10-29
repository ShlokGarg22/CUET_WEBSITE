import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import MottoTicker from '../components/MottoTicker.jsx'
import ScrollHighlightText from '../components/ScrollHighlightText.jsx'
import HomeIntroOverlay from '../components/HomeIntroOverlay.jsx'
import SlideArrowButton from '../components/animata/button/slide-arrow-button'
import TextbookStack3D from '../components/TextbookStack3D.jsx'
import logo from '../assets/adobelogo.svg'
import { getLogoHref } from '../utils/navigation.js'

const domePath = 'M0 320V200 Q720 0 1440 200 V320 Z'

function Home() {
  const navigate = useNavigate()
  const [isArrowAnimating, setIsArrowAnimating] = useState(false)
  const animationTimeoutRef = useRef(null)
  const logoHref = useMemo(() => getLogoHref(), [])

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
        animationTimeoutRef.current = null
      }
    }
  }, [])

  const handleStartClick = () => {
    if (isArrowAnimating) return
    setIsArrowAnimating(true)
    animationTimeoutRef.current = setTimeout(() => {
      setIsArrowAnimating(false)
      navigate('/auth/login')
      animationTimeoutRef.current = null
    }, 450)
  }

  return (
    <>
      <HomeIntroOverlay />
      <div className="relative min-h-screen bg-gradient-to-br from-[#fafbfc] via-white to-[#f5f7fa] text-[#1a1a1a] overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        </div>

        <div className="relative flex min-h-screen flex-col pb-32">
          <div className="w-full relative z-10">
            <header className="flex h-20 w-full items-center pl-6 pr-6 sm:pl-10 sm:pr-10">
              <Link to={logoHref} className="inline-flex items-center transform hover:scale-105 transition-transform duration-300 -ml-2">
                <img src={logo} alt="pmmp.club" className="h-16 w-auto drop-shadow-sm" />
              </Link>
            </header>
            <div className="flex w-full flex-col">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <MottoTicker />
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </div>
          </div>

          <main className="flex flex-1 flex-col relative z-10 items-center justify-center">
            <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 py-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center justify-items-center">
                
                {/* Left Side - Text Content */}
                <div className="space-y-8 text-center lg:text-left w-full">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-[#102f76]">All Your CUET Prep in One Place</span>
                  </div>

                  {/* Main Headline */}
                  <div className="space-y-4">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                      <span className="text-gray-900">Master </span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#102f76] via-[#2563eb] to-[#7c3aed]">
                        Every Subject
                      </span>
                      <span className="block text-gray-900 mt-2">With Confidence</span>
                    </h1>
                    
                    <p className="text-xl text-gray-600 leading-relaxed max-w-xl lg:max-w-none">
                      Your complete digital library for CUET success. Organized, comprehensive, and always at your fingertips.
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="space-y-4 pt-4">
                    <SlideArrowButton
                      onClick={handleStartClick}
                      disabled={isArrowAnimating}
                      text="Start Learning Free"
                      primaryColor="#102f76"
                      className={`${
                        isArrowAnimating ? 'cursor-wait opacity-80' : 'hover:-translate-y-1 hover:shadow-2xl transition-all duration-300'
                      } shadow-[0_20px_50px_rgba(16,47,118,0.3)] font-bold text-lg`}
                    />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-green-600">✓</span> No credit card required 
                      <span className="mx-2">•</span>
                      <span className="font-semibold text-green-600">✓</span> Free forever
                    </p>
                  </div>
                </div>

                {/* Right Side - 3D Book Stack */}
                <div className="relative w-full flex items-center justify-center">
                  <TextbookStack3D />
                </div>

              </div>
            </div>
          </main>
        </div>
      </div>
      <ScrollHighlightText />
      <footer className="relative mt-24 bg-gradient-to-b from-[#f6f8ff] via-white to-white py-20 text-[#0a1029]">
        <div className="absolute inset-x-0 -top-12 flex justify-center">
          <div className="h-12 w-[82%] max-w-4xl rounded-full bg-[#102f76]/10 blur-lg" />
        </div>
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 text-center">
          <div className="flex items-center justify-center">
            <img src={logo} alt="pmmp.club" className="h-12 w-auto" />
          </div>
          <p className="text-sm font-serif-text text-[#4a5480] sm:text-base">
            Made with <span className="text-[#d94c63]">❤️</span>{' '}
            <a href="mailto:hello@pmmp.club" className="underline decoration-[#102f76]/40 decoration-dotted underline-offset-4 hover:decoration-solid">
              Contact
            </a>
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-[0.45em] text-[#1b2553]/70 sm:text-sm">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="transition hover:text-[#102f76]">
              Facebook
            </a>
            <span className="hidden text-[#1b2553]/40 sm:inline">—</span>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="transition hover:text-[#102f76]">
              Instagram
            </a>
            <span className="hidden text-[#1b2553]/40 sm:inline">—</span>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="transition hover:text-[#102f76]">
              Twitter
            </a>
          </nav>
          <div className="h-px w-24 bg-[#1b2553]/10" />
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#1b2553]/40">
            © {new Date().getFullYear()} pmmp.club
          </p>
        </div>
      </footer>
    </>
  )
}

export default Home
