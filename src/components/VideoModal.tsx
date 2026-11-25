import { useEffect, useRef } from 'react'

interface Props {
  vimeoId: string
  title?: string
  onClose: () => void
}

const SWIPE_CLOSE_PX = 90

export default function VideoModal({ vimeoId, title, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const touchStartY = useRef<number | null>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const focusables = [closeRef.current, iframeRef.current].filter(Boolean) as HTMLElement[]
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      } else if (!focusables.includes(active as HTMLElement)) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKey)

    // position: fixed evita el scroll de fondo también en iOS Safari.
    const scrollY = window.scrollY
    const { style } = document.body
    style.position = 'fixed'
    style.top = `-${scrollY}px`
    style.left = '0'
    style.right = '0'
    style.width = '100%'

    return () => {
      document.removeEventListener('keydown', handleKey)
      style.position = ''
      style.top = ''
      style.left = ''
      style.right = ''
      style.width = ''
      window.scrollTo({ top: scrollY, behavior: 'instant' })
      previouslyFocused?.focus?.()
    }
  }, [])

  const src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&transparent=0`

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'Reproductor de video'}
      onClick={onClose}
      onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY }}
      onTouchEnd={(e) => {
        const start = touchStartY.current
        touchStartY.current = null
        if (start !== null && e.changedTouches[0].clientY - start > SWIPE_CLOSE_PX) onClose()
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} type="button" className="modal-close" aria-label="Cerrar video" onClick={onClose}>
          <span aria-hidden="true">✕</span> Cerrar
        </button>
        <iframe
          ref={iframeRef}
          src={src}
          title={title ?? 'Video player'}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
