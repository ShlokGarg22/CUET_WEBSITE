export function getLogoHref() {
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem('pmmpUser')
      if (stored) {
        return '/dashboard'
      }
  } catch {
      // Ignore storage access errors and fall back to home
    }
  }

  return '/'
}

export default getLogoHref
