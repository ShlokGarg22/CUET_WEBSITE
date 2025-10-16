import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import MottoTicker from '../components/MottoTicker.jsx'
import ScrollHighlightText from '../components/ScrollHighlightText.jsx'
import HomeIntroOverlay from '../components/HomeIntroOverlay.jsx'
import SlideArrowButton from '../components/animata/button/slide-arrow-button'
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
      <div className="relative min-h-screen bg-white text-[#1a1a1a]">
        <div className="flex min-h-screen flex-col pb-32">
          <div className="w-full">
            <header className="flex h-20 w-full items-center px-6 sm:px-10">
              <Link to={logoHref} className="inline-flex items-center">
                <img src={logo} alt="pmmp.club" className="h-16 w-auto" />
              </Link>
            </header>
            <div className="flex w-full flex-col">
              <div className="h-px w-full bg-black/10" />
              <MottoTicker />
              <div className="h-px w-full bg-black/10" />
            </div>
          </div>
          <main className="flex flex-1 flex-col">
            <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 text-center sm:px-10">
              <div className="space-y-6">
                <h1 className="font-serif-display text-[clamp(3.5rem,9vw,6rem)] leading-tight text-[#1a1a1a]">
                  Score marks pls bro
                </h1>
                <p className="mx-auto max-w-2xl text-lg font-serif-text text-[#2d2d2d] sm:text-xl">
                  pradhan mantri desh becho yojna
                </p>
                <SlideArrowButton
                  onClick={handleStartClick}
                  disabled={isArrowAnimating}
                  text="Get started"
                  primaryColor="#102f76"
                  className={`${
                    isArrowAnimating ? 'cursor-wait opacity-80' : 'hover:-translate-y-0.5 transition-transform'
                  } shadow-[0_12px_30px_rgba(16,47,118,0.35)]`}
                />
              </div>
            </section>
          </main>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <svg
            className="h-48 w-full fill-[#102f76]"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d={domePath} />
          </svg>
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
