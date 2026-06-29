import { NextResponse } from 'next/server'
import { oneClickGenerate } from '@/lib/ai-engine'

// POST - Genera TODO con un solo tema (guion, subtitulos, musica, hashtags)
export async function POST(request: Request) {
  try {
    const { topic, platform, duration, style, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Se requiere un tema' }, { status: 400 })
    }

    const result = await oneClickGenerate({
      topic,
      platform: platform || 'tiktok',
      duration: duration || 30,
      style: style || 'informativo',
      language: language || 'es',
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error en generacion one-click:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
