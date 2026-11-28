import { NextResponse } from 'next/server'
import { requireApiUser } from '@/lib/api-auth'

// Genera hashtags demo inteligentes segun el tema y plataforma
function getMockHashtags(topic: string, platform: string) {
  const clean = topic.replace(/\s+/g, '').toLowerCase().slice(0, 15)
  const base: Record<string, string[]> = {
    tiktok: ['#fyp', '#parati', '#viral', '#tiktokviral', '#aprendeentiktok'],
    reels: ['#reels', '#reelsinstagram', '#explore', '#instagood', '#viral'],
    shorts: ['#shorts', '#youtubeshorts', '#viral', '#youtube', '#subscribe'],
  }
  const platformTags = base[platform] || base.tiktok
  return {
    title: `${topic} - Lo que NADIE te cuenta 🔥`,
    description: `Descubre todo sobre ${topic}. Guarda este video y sigue para mas contenido como este! 🚀`,
    hashtags: [...platformTags, `#${clean}`, '#tips', '#tutorial', '#trending', '#2025', '#contenido'],
  }
}

// POST - Genera titulo, descripcion y hashtags
export async function POST(request: Request) {
  const auth = await requireApiUser(request, 'ai')
  if (auth instanceof NextResponse) return auth

  try {
    const { topic, platform, language } = await request.json()

    if (!topic || !platform) {
      return NextResponse.json(
        { error: 'Se requiere topic y platform' },
        { status: 400 }
      )
    }

    // Si no hay API key de OpenAI, usar demo
    const apiKey = process.env.OPENAI_API_KEY
    const hasValidKey = apiKey && apiKey !== 'sk-placeholder' && apiKey.startsWith('sk-')

    if (!hasValidKey) {
      return NextResponse.json(getMockHashtags(topic, platform))
    }

    // Modo real con OpenAI
    const { generateHashtags } = await import('@/lib/openai')
    const result = await generateHashtags({
      topic,
      platform,
      language: language || 'es',
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generando hashtags:', error)
    // Fallback a demo si algo falla
    try {
      const { topic, platform } = await request.clone().json()
      return NextResponse.json(getMockHashtags(topic || 'video', platform || 'tiktok'))
    } catch {
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }
  }
}
