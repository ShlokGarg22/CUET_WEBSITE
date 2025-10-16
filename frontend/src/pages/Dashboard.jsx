import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/adobelogo.svg'
import subjects from '../data/subjects'
import { getLogoHref } from '../utils/navigation'
import { BarChart2 } from 'lucide-react'

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

  const greeting = useMemo(() => getTimeGreeting(), [])
  const logoHref = useMemo(() => getLogoHref(), [])
  const resolvedName = useMemo(() => {
    if (!userName) return 'friend'
    const trimmed = userName.trim()
    if (!trimmed) return 'friend'
    return trimmed.split(' ')[0]
  }, [userName])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('pmmpUser')
    navigate('/')
  }, [navigate])

  useEffect(() => {
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
  }, [navigate])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#e9efff] via-white to-[#dbe4ff] text-[#061237]">
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_-5%,rgba(16,47,118,0.15),transparent_55%),radial-gradient(circle_at_85%_0%,rgba(66,103,196,0.12),transparent_45%)]" />
  <div className="relative flex min-h-screen w-full flex-col px-6 pb-12 pt-8 sm:px-12">
        <header className="flex h-20 w-full items-center justify-between">
          <Link to={logoHref} className="inline-flex items-center gap-3">
            <img src={logo} alt="pmmp.club" className="h-12 w-auto" />
          </Link>
          <nav className="hidden text-xs uppercase tracking-[0.35em] text-[#3a4773] sm:flex sm:items-center sm:gap-6">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-[#0a163c] px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#0a163c] transition hover:bg-[#0a163c] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a163c]/40"
            >
              Log out
            </button>
          </nav>
        </header>

  <main className="flex flex-1 flex-col justify-between gap-12 py-12">
          <section className="relative overflow-hidden rounded-[46px] bg-gradient-to-r from-[#0f1d5b] via-[#1d3d9e] to-[#5a7fff] px-6 py-[4.5rem] shadow-[0_26px_70px_rgba(12,30,92,0.32)] ring-1 ring-white/15 sm:px-10">
            <div className="pointer-events-none absolute inset-0 opacity-80 mix-blend-screen" style={{ background: 'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.38), transparent 58%), radial-gradient(circle at 88% 8%, rgba(255,255,255,0.22), transparent 42%)' }} />
            <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center text-white">
              <h1 className="font-serif-display text-[clamp(3rem,6vw,4.9rem)] leading-[1.05] tracking-[-0.02em] drop-shadow-[0_18px_48px_rgba(8,22,71,0.45)]">
                <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
                  <span className="text-white/95 whitespace-pre text-balance">{`${greeting},`}</span>
                  <span className="relative inline-flex items-center overflow-hidden rounded-full px-6 py-2 whitespace-nowrap align-middle">
                    <span className="absolute inset-0 bg-white/18 blur-[2px]" aria-hidden="true" />
                    <span className="relative z-10 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                      {resolvedName}
                    </span>
                  </span>
                  <span className="text-white/75">.</span>
                </span>
              </h1>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-3 text-center">
              <h2 className="font-serif-display text-2xl text-[#091642]">What do you want to sharpen today?</h2>
              <span className="text-xs uppercase tracking-[0.4em] text-[#4b5a93]">2 core focus tracks</span>
            </div>
            <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2">
              {subjects.map((subject, idx) => (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => navigate(`/session/${subject.id}`, { state: { subjectId: subject.id } })}
                  className="group relative overflow-hidden rounded-2xl border border-[#32406c] bg-[#0b1224] text-left shadow-[0_18px_50px_rgba(3,10,24,0.5)] transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5a7fff]/60"
                >
                  {/* Top banner image area */}
                  <div className="relative h-28 w-full overflow-hidden border-b border-white/10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,#73ffd4_0%,transparent_35%),radial-gradient(circle_at_80%_20%,#6da8ff_0%,transparent_40%),radial-gradient(circle_at_50%_120%,#2c3f77_0%,#0b1224_65%)]" />
                    <div className="absolute inset-0 opacity-70 mix-blend-screen" style={{ background: 'linear-gradient(to right, rgba(113,168,255,0.35), rgba(0,0,0,0))' }} />
                  </div>

                  {/* Body */}
                  <div className="space-y-3 px-5 py-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/60">
                      {`Course ${idx + 1}`}
                    </p>
                    <h3 className="font-serif-display text-2xl text-white">{subject.name}</h3>
                    <p className="text-sm leading-snug text-white/80">
                      {subject.focus}
                    </p>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/75">
                        <BarChart2 className="h-3.5 w-3.5" />
                        Beginner
                      </span>
                    </div>
                  </div>

                  {/* Subtle outline corners */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/5" />
                  <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
