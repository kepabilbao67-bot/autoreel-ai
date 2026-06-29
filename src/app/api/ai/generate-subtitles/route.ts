import { NextResponse } from 'next/server'
import { generateSubtitles } from '@/lib/openai'

// POST - Genera subtitulos con timestamps
export async function POST(request: Request) {
  try {
    const { script, duration } = await request.json()

    if (!script || !duration) {
      return NextResponse.json(
        { error: 'Se requiere script y duration' },
        { status: 400 }
      )
    }

    const subtitles = await generateSubtitles(script, duration)
    return NextResponse.json({ subtitles })
  } catch (error) {
    console.error('Error generando subtitulos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
