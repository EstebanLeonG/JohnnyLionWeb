import videosData from './videos.json'

export type Category = 'music-videos' | 'publicidad' | 'narrative'
export type Section = 'home' | Category | 'contact'

export interface VideoItem {
  vimeoId: string
  title?: string
  thumbnail?: string
  category: Category | 'reel'
}

export const thumbUrl = (base: string | undefined, size: '640x360' | '1280x720') =>
  base ? `${base}_${size}` : undefined

const rawVideos = videosData as Array<VideoItem>

export const categories: { key: Section; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'music-videos', label: 'Music Videos' },
  { key: 'publicidad', label: 'Ads' },
  { key: 'narrative', label: 'Narrative' },
  { key: 'contact', label: 'Contact' },
]

export const CONTACT_EMAIL = 'johnnycine@gmail.com'

export const reel: VideoItem | undefined = rawVideos.find((video) => video.category === 'reel')

export const videos: VideoItem[] = rawVideos.filter((video) => video.category !== 'reel')
