import { NextResponse } from 'next/server'
import { generateHashtags } from '@/lib/openai'

// POST - Genera titulo, descripcion y hashtags
export async function POST(request: Request) {
  try {
    const { topic, platform, language } = await request.json()

    if (!topic || !platform) {
      return NextResponse.json(
        { error: 'Se requiere topic y platform' },
        { status: 400 }
      )
    }

    const result = await generateHashtags({
      topic,
      platform,
      language: language || 'es',
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generando hashtags:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
