import { NextResponse } from 'next/server'
import { detectTrends } from '@/lib/openai'

// POST - Detecta tendencias actuales
export async function POST(request: Request) {
  try {
    const { niche, platform } = await request.json()

    if (!niche || !platform) {
      return NextResponse.json(
        { error: 'Se requiere niche y platform' },
        { status: 400 }
      )
    }

    const trends = await detectTrends({ niche, platform })
    return NextResponse.json(trends)
  } catch (error) {
    console.error('Error detectando tendencias:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
