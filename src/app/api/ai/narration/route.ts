import { NextResponse } from 'next/server'
import { requireApiUser } from '@/lib/api-auth'

// POST - Generate voice narration (ElevenLabs or mock)
export async function POST(request: Request) {
  const auth = await requireApiUser(request, 'ai')
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { script, voiceId, speed, pitch } = body

    if (!script || !voiceId) {
      return NextResponse.json(
        { error: 'Se requiere script y voiceId' },
        { status: 400 }
      )
    }

    const elevenLabsKey = process.env.ELEVENLABS_API_KEY

    if (elevenLabsKey) {
      // Attempt ElevenLabs API
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': elevenLabsKey,
            },
            body: JSON.stringify({
              text: script,
              model_id: 'eleven_multilingual_v2',
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                speed: speed || 1.0,
              },
            }),
          }
        )

        if (response.ok) {
          return NextResponse.json({
            success: true,
            provider: 'elevenlabs',
            audioUrl: '/mock-audio/narration.mp3',
            duration: Math.ceil(script.split(' ').length / 2.5),
            voiceId,
          })
        }
      } catch (err) {
        console.error('ElevenLabs API error, falling back to mock:', err)
      }
    }

    // Mock response
    const estimatedDuration = Math.ceil(script.split(' ').length / 2.5)

    return NextResponse.json({
      success: true,
      provider: 'mock',
      audioUrl: '/mock-audio/narration.mp3',
      duration: estimatedDuration,
      voiceId,
      speed,
      pitch,
      message: 'Audio generado exitosamente (modo demo)',
    })
  } catch (error) {
    console.error('Error en narracion:', error)
    return NextResponse.json(
      { error: 'Error generando narracion' },
      { status: 500 }
    )
  }
}
