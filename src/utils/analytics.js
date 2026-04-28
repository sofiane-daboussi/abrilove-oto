import { useEffect } from 'react'

export function trackEvent(name, params = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params)
  }
}

export function useScrollTracking(profil) {
  useEffect(() => {
    const fired = new Set()
    const onScroll = () => {
      const pct = Math.round(
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
      )
      for (const threshold of [25, 50, 75, 100]) {
        if (pct >= threshold && !fired.has(threshold)) {
          fired.add(threshold)
          trackEvent('scroll_depth', { profil, percent: threshold })
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [profil])
}
