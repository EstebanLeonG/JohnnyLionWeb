import { useEffect, useState } from 'react'
import { categories, type Section } from './data/projects'

const QUERY = '(prefers-reduced-motion: reduce)'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}

const readHash = (): Section => {
  const hash = window.location.hash.replace(/^#\/?/, '')
  return categories.find((c) => c.key === hash)?.key ?? 'home'
}

// Sección sincronizada con el hash de la URL (#music-videos), compatible con Atrás/Adelante.
export function useHashSection(): [Section, (next: Section) => void] {
  const [section, setSection] = useState<Section>(readHash)

  useEffect(() => {
    const onHashChange = () => {
      setSection(readHash())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const change = (next: Section) => {
    if (next === section) return
    window.location.hash = next === 'home' ? '' : next
  }

  return [section, change]
}
