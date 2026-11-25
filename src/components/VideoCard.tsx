import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type Player from '@vimeo/player'
import { thumbUrl, type VideoItem } from '../data/projects'
import { usePrefersReducedMotion } from '../hooks'

interface Props {
  item: VideoItem
  index: number
  paused: boolean
  onSelect: (vimeoId: string) => void
}

export default function VideoCard({ item, index, paused, onSelect }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<Player | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [inView, setInView] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const shouldPlay = inView && !paused
  const shouldPlayRef = useRef(shouldPlay)
  shouldPlayRef.current = shouldPlay

  // El iframe se monta la primera vez que la tarjeta se acerca al viewport.
  useEffect(() => {
    const el = cardRef.current
    if (!el || reducedMotion) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setMounted(true)
      },
      { rootMargin: '200px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reducedMotion])

  useEffect(() => {
    if (!mounted) return
    let cancelled = false
    let player: Player | null = null

    void import('@vimeo/player').then(({ default: VimeoPlayer }) => {
      if (cancelled || !iframeRef.current) return
      player = new VimeoPlayer(iframeRef.current)
      playerRef.current = player
      if (!shouldPlayRef.current) void player.pause().catch(() => {})
    })

    return () => {
      cancelled = true
      playerRef.current = null
      try { void player?.destroy() } catch {}
    }
  }, [mounted])

  useEffect(() => {
    const player = playerRef.current
    if (!player) return
    const action = shouldPlay ? player.play() : player.pause()
    void Promise.resolve(action).catch(() => {})
  }, [shouldPlay])

  const src = `https://player.vimeo.com/video/${item.vimeoId}?background=1&autoplay=1&muted=1&loop=1&autopause=0&controls=0&title=0&byline=0&portrait=0&playsinline=1&transparent=0`
  const poster = thumbUrl(item.thumbnail, '640x360')
  const label = item.title || `Video ${item.vimeoId}`

  return (
    <div
      ref={cardRef}
      data-category={item.category}
      className="card"
      style={{ '--i': index } as CSSProperties}
    >
      {poster && (
        <img
          className="card__poster"
          src={poster}
          alt=""
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
        />
      )}
      {mounted && !reducedMotion && (
        <iframe
          ref={iframeRef}
          className={loaded ? 'is-loaded' : ''}
          src={src}
          title={label}
          allow="autoplay"
          tabIndex={-1}
          onLoad={() => setLoaded(true)}
        />
      )}
      {item.title && (
        <div className="card__overlay" aria-hidden="true">
          <span>{item.title}</span>
        </div>
      )}
      <button type="button" className="card__button" aria-label={`Reproducir: ${label}`} onClick={() => onSelect(item.vimeoId)} />
    </div>
  )
}
