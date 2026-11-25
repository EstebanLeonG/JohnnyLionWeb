import fs from 'node:fs'
import path from 'node:path'

const categories = [
  { key: 'music-videos', albumId: process.env.VIMEO_MUSIC_ALBUM_ID },
  { key: 'publicidad', albumId: process.env.VIMEO_PUBLICIDAD_ALBUM_ID },
  { key: 'narrative', albumId: process.env.VIMEO_NARRATIVE_ALBUM_ID },
  { key: 'reel', albumId: process.env.VIMEO_REEL_ALBUM_ID },
].filter((entry) => Boolean(entry.albumId))

if (!process.env.VIMEO_ACCESS_TOKEN) {
  console.error('Falta VIMEO_ACCESS_TOKEN. Añádelo antes de ejecutar este script.')
  process.exit(1)
}

if (categories.length === 0) {
  console.error('No hay álbumes configurados. Define VIMEO_MUSIC_ALBUM_ID, VIMEO_PUBLICIDAD_ALBUM_ID, VIMEO_NARRATIVE_ALBUM_ID y/o VIMEO_REEL_ALBUM_ID.')
  process.exit(1)
}

const token = process.env.VIMEO_ACCESS_TOKEN
const outputFile = path.resolve('src/data/videos.json')

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.vimeo.*+json;version=3.4',
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Vimeo API error (${response.status}): ${body}`)
  }

  return response.json()
}

async function getVideosForAlbum(albumId, category) {
  const items = []
  let nextUrl = `/me/albums/${albumId}/videos?per_page=100&fields=uri,name,pictures.sizes.link`

  while (nextUrl) {
    const data = await fetchJson(`https://api.vimeo.com${nextUrl}`)
    if (Array.isArray(data?.data)) items.push(...data.data)
    nextUrl = data?.paging?.next ?? null
  }

  return items
    .map((video) => {
      const uri = typeof video?.uri === 'string' ? video.uri : ''
      const vimeoId = uri.split('/').filter(Boolean).at(-1) ?? ''

      if (!vimeoId) return null

      // Se guarda la URL base de la miniatura (sin tamaño); el front agrega _640x360, etc.
      const sizeLink = video?.pictures?.sizes?.at?.(-1)?.link
      const thumbnail = typeof sizeLink === 'string'
        ? sizeLink.replace(/_\d+(x\d+)?(\?.*)?$/, '')
        : undefined

      return {
        vimeoId,
        title: typeof video?.name === 'string' && video.name.trim() ? video.name : undefined,
        category,
        thumbnail,
      }
    })
    .filter(Boolean)
}

try {
  const syncedKeys = new Set(categories.map((entry) => entry.key))
  const existing = fs.existsSync(outputFile) ? JSON.parse(fs.readFileSync(outputFile, 'utf8')) : []
  // Las categorías sin álbum configurado se conservan para no borrarlas.
  const allVideos = existing.filter((video) => !syncedKeys.has(video.category))

  for (const category of categories) {
    const videos = await getVideosForAlbum(category.albumId, category.key)
    allVideos.push(...videos)
    console.log(`Álbum ${category.key}: ${videos.length} videos`)
  }

  const order = ['music-videos', 'publicidad', 'narrative', 'reel']
  const rank = (video) => {
    const index = order.indexOf(video.category)
    return index === -1 ? order.length : index
  }
  allVideos.sort((a, b) => rank(a) - rank(b))

  fs.writeFileSync(outputFile, `${JSON.stringify(allVideos, null, 2)}\n`, 'utf8')
  console.log(`Archivo generado en ${outputFile}`)
  console.log(`Total: ${allVideos.length} videos`)
} catch (error) {
  console.error('Error synchronizing Vimeo videos:')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
