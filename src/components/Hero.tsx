import { useEffect, useRef, useState } from 'react'
import type Player from '@vimeo/player'
import { thumbUrl } from '../data/projects'
import { usePrefersReducedMotion } from '../hooks'

interface Props {
  vimeoId: string
  thumbnail?: string
}

export default function Hero({ vimeoId, thumbnail }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [posterReady, setPosterReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const src = `https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&muted=1&loop=1&autopause=0&controls=0&title=0&byline=0&portrait=0&playsinline=1`
  const poster = thumbUrl(thumbnail, '1280x720')

  // El iframe se revela solo cuando Vimeo ya está reproduciendo, no cuando termina de cargar el HTML del player.
  useEffect(() => {
    if (reducedMotion) return
    let cancelled = false
    let player: Player | null = null

    void import('@vimeo/player').then(({ default: VimeoPlayer }) => {
      if (cancelled || !iframeRef.current) return
      player = new VimeoPlayer(iframeRef.current)
      const onTime = (data: { seconds: number }) => {
        if (data.seconds > 0.15) {
          setPlaying(true)
          void player?.off('timeupdate', onTime)
        }
      }
      void player.on('timeupdate', onTime)
    })

    return () => {
      cancelled = true
      try { void player?.destroy() } catch {}
    }
  }, [reducedMotion])

  return (
    <section className="hero" aria-label="Reel">
      {poster && (
        <img
          className={`hero__poster${posterReady ? ' is-ready' : ''}`}
          src={poster}
          alt=""
          decoding="async"
          ref={(img) => { if (img?.complete && img.naturalWidth > 0) setPosterReady(true) }}
          onLoad={() => setPosterReady(true)}
        />
      )}
      {!reducedMotion && (
        <iframe
          ref={iframeRef}
          className={playing ? 'is-loaded' : ''}
          src={src}
          title="Reel"
          allow="autoplay; fullscreen"
          tabIndex={-1}
        />
      )}
    </section>
  )
}
