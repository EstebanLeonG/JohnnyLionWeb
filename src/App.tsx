import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Contact from './components/Contact'
import VideoGrid from './components/VideoGrid'
import VideoModal from './components/VideoModal'
import { videos, reel, categories } from './data/projects'
import { useHashSection } from './hooks'

const BASE_TITLE = 'JOHNNY LEON — Cinematographer'

export default function App() {
  const [section, changeSection] = useHashSection()
  const [modalId, setModalId] = useState<string | null>(null)

  useEffect(() => {
    const label = categories.find((c) => c.key === section)?.label
    document.title = section === 'home' || !label ? BASE_TITLE : `${label} — ${BASE_TITLE}`
    setModalId(null)
  }, [section])

  return (
    <div className={`site-wrapper ${section === 'home' ? 'site-wrapper--home' : ''}`.trim()}>
      <Header active={section} onChange={changeSection} />
      <main>
        {section === 'home' ? (
          reel && <Hero vimeoId={reel.vimeoId} thumbnail={reel.thumbnail} />
        ) : section === 'contact' ? (
          <Contact />
        ) : (
          <section id="work" aria-label={categories.find((c) => c.key === section)?.label}>
            <VideoGrid items={videos} filter={section} paused={modalId !== null} onSelect={setModalId} />
          </section>
        )}
      </main>
      {section !== 'contact' && <Footer />}
      {modalId && (
        <VideoModal
          vimeoId={modalId}
          title={videos.find((v) => v.vimeoId === modalId)?.title}
          onClose={() => setModalId(null)}
        />
      )}
    </div>
  )
}
