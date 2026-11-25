import { useMemo } from 'react'
import type { VideoItem, Category } from '../data/projects'
import VideoCard from './VideoCard'

interface Props {
  items: VideoItem[]
  filter: Category
  paused: boolean
  onSelect: (vimeoId: string) => void
}

const MAX_STAGGERED = 12

export default function VideoGrid({ items, filter, paused, onSelect }: Props) {
  const filtered = useMemo(
    () => items.filter((v) => v.category === filter),
    [filter, items]
  )

  return (
    <div key={filter} className="grid">
      {filtered.map((item, index) => (
        <VideoCard
          key={item.vimeoId}
          item={item}
          index={Math.min(index, MAX_STAGGERED)}
          paused={paused}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
