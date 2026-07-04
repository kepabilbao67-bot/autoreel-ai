import { NextResponse } from 'next/server'

interface PexelsPhoto {
  id: number
  url: string
  photographer: string
  photographer_url: string
  alt: string
  width: number
  height: number
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
  }
}

function getMockImages(query: string) {
  const mockImages = Array.from({ length: 12 }, (_, i) => ({
    id: `mock-${i + 1}`,
    url: `https://images.pexels.com/photos/${1000000 + i}/pexels-photo-${1000000 + i}.jpeg`,
    thumbnailUrl: `https://images.pexels.com/photos/${1000000 + i}/pexels-photo-${1000000 + i}.jpeg?auto=compress&cs=tinysrgb&w=400`,
    photographer: ['Maria Garcia', 'Carlos Lopez', 'Ana Martinez', 'Pedro Ruiz', 'Laura Sanchez', 'Diego Torres'][i % 6],
    photographerUrl: 'https://www.pexels.com',
    alt: `${query} - imagen ${i + 1}`,
    width: [400, 300, 500, 350, 450, 380][i % 6],
    height: [300, 400, 350, 500, 300, 450][i % 6],
  }))

  return mockImages
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ images: [] })
    }

    const pexelsKey = process.env.PEXELS_API_KEY

    if (pexelsKey && pexelsKey !== 'placeholder') {
      try {
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20&locale=es-ES`,
          {
            headers: {
              Authorization: pexelsKey,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          const images = data.photos.map((photo: PexelsPhoto) => ({
            id: String(photo.id),
            url: photo.src.large2x || photo.src.original,
            thumbnailUrl: photo.src.medium || photo.src.small,
            photographer: photo.photographer,
            photographerUrl: photo.photographer_url,
            alt: photo.alt || query,
            width: photo.width,
            height: photo.height,
          }))

          return NextResponse.json({ images })
        }
      } catch {
        // Fall through to mock data
      }
    }

    // Mock data fallback
    await new Promise((resolve) => setTimeout(resolve, 800))
    const images = getMockImages(query)
    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error en busqueda de imagenes:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
