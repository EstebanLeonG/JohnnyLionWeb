# Johnny Leon — Cinematographer Portfolio

Portfolio web para Dirección de Fotografía.

## Stack

- **Vite** — bundler ultrarrápido
- **React 18** + **TypeScript** — UI declarativa con tipos
- **CSS puro** — sin dependencias de Tailwind/PostCSS; cero problemas de compatibilidad
- **@vimeo/player** — SDK oficial de Vimeo para hover preview

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm run build      # build de producción en dist/
npm run preview    # preview del build
```

## Estructura

```
src/
  data/videos.json      ← Lista de videos (editar aquí o con npm run sync:vimeo)
  data/projects.ts      ← Tipos, categorías y helpers
  components/
    Header.tsx           ← Marca y navegación
    Footer.tsx           ← Pie de página
    CategoryFilter.tsx   ← Filtros (All / Music Videos / Publicidad)
    VideoGrid.tsx        ← Grid responsive
    VideoCard.tsx        ← Tarjeta con hover preview
    VideoModal.tsx       ← Modal casi fullscreen al hacer click
  styles/global.css      ← Todos los estilos
  App.tsx                ← Composición principal
  main.tsx               ← Entry point
```

## Agregar un video nuevo

Los videos viven en `src/data/videos.json`. Se pueden sincronizar desde Vimeo con `npm run sync:vimeo`
(requiere las variables de `.env.example`, incluye título y miniatura) o agregarse a mano:

```json
{ "vimeoId": "123456789", "title": "Artista - Tema", "thumbnail": "https://i.vimeocdn.com/video/…-d", "category": "music-videos" }
```

Categorías disponibles: `music-videos` | `publicidad` | `narrative` | `reel` (el reel es el video del Home).
`thumbnail` es la URL base de Vimeo (sin `_640x360`); es opcional.

## Navegación

Cada sección tiene su URL por hash: `/#music-videos`, `/#publicidad`, `/#narrative`.

## SEO

Define `VITE_SITE_URL` (ej. `https://tu-dominio.com`) en `.env` o en el hosting antes de `npm run build`
para generar canonical, `og:image`, `robots.txt` y `sitemap.xml`.

## Deploy

Build estático, desplegable en Vercel, Netlify, o cualquier hosting:

```bash
npm run build
# sube la carpeta dist/
```
# Mi Bro — Portfolio (scaffold)

Scaffold inicial Next.js + TypeScript + Tailwind para el portfolio de Dirección de Fotografía.

Instalación y ejecución:

```bash
npm install
npm run dev
```

Página principal: `http://localhost:3000`

Siguientes pasos recomendados:
- Conectar CMS (Sanity/Tina) para manejar proyectos y assets.
- Agregar SEO y Open Graph dinámico por proyecto.
- Mejorar thumbs y lazy-loading de imágenes.
