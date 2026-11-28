import { NextResponse } from 'next/server'
import { suggestMusic } from '@/lib/openai'
import { requireApiUser } from '@/lib/api-auth'

// POST - Sugiere musica de fondo
export async function POST(request: Request) {
  const auth = await requireApiUser(request, 'ai')
  if (auth instanceof NextResponse) return auth

  try {
    const { topic, style, mood } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Se requiere topic' }, { status: 400 })
    }

    const suggestions = await suggestMusic({
      topic,
      style: style || 'general',
      mood: mood || 'energetic',
    })

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('Error sugiriendo musica:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
