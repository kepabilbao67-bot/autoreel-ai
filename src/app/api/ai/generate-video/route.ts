import { NextResponse } from 'next/server'

// ============================================================
// GENERACION DE VIDEO CON IA - via Replicate
// Toma una imagen y la convierte en video con movimiento (image-to-video)
// Modelo: stable-video-diffusion
// ============================================================

const REPLICATE_API = 'https://api.replicate.com/v1'

// Modelo image-to-video de Stability AI
const MODEL = 'stability-ai/stable-video-diffusion'

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: 'Se requiere una imagen' }, { status: 400 })
    }

    const token = process.env.REPLICATE_API_TOKEN
    if (!token) {
      return NextResponse.json(
        { error: 'Replicate no esta configurado. Falta REPLICATE_API_TOKEN.' },
        { status: 503 }
      )
    }

    // 1. Crear la prediccion (empezar a generar el video)
    const createRes = await fetch(`${REPLICATE_API}/models/${MODEL}/predictions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'wait', // esperar hasta que este listo (o timeout)
      },
      body: JSON.stringify({
        input: {
          input_image: image,
          video_length: '14_frames_with_svd',
          sizing_strategy: 'maintain_aspect_ratio',
          frames_per_second: 6,
          motion_bucket_id: 127,
        },
      }),
    })

    if (!createRes.ok) {
      const errText = await createRes.text()
      console.error('Error Replicate:', errText)
      return NextResponse.json(
        { error: 'Error al iniciar generacion de video', details: errText },
        { status: 500 }
      )
    }

    const prediction = await createRes.json()

    // Si ya termino (con Prefer: wait), devolver directamente
    if (prediction.status === 'succeeded' && prediction.output) {
      return NextResponse.json({ videoUrl: prediction.output, status: 'succeeded' })
    }

    // Devolver el ID para hacer polling
    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
      videoUrl: prediction.output || null,
    })
  } catch (error) {
    console.error('Error generando video:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET - Consultar estado de una generacion en curso
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Se requiere id' }, { status: 400 })
    }

    const token = process.env.REPLICATE_API_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'Replicate no configurado' }, { status: 503 })
    }

    const res = await fetch(`${REPLICATE_API}/predictions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const prediction = await res.json()

    return NextResponse.json({
      status: prediction.status,
      videoUrl: prediction.output || null,
      error: prediction.error || null,
    })
  } catch (error) {
    console.error('Error consultando video:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
