import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { CreateVideoSchema } from '@/lib/validators'

// GET - Obtener videos del usuario
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Se requiere userId' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ videos: data })
  } catch (error) {
    console.error('Error obteniendo videos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear un nuevo video
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, ...videoData } = body

    if (!userId) {
      return NextResponse.json({ error: 'Se requiere userId' }, { status: 400 })
    }

    const parsed = CreateVideoSchema.safeParse(videoData)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const supabase = createSupabaseAdmin()
    const { data, error } = await supabase
      .from('videos')
      .insert({
        user_id: userId,
        title: parsed.data.topic,
        platform: parsed.data.platform,
        duration: parsed.data.duration,
        style: parsed.data.style,
        language: parsed.data.language,
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ video: data })
  } catch (error) {
    console.error('Error creando video:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un video
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!videoId || !userId) {
      return NextResponse.json(
        { error: 'Se requiere id y userId' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseAdmin()
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId)
      .eq('user_id', userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Video eliminado' })
  } catch (error) {
    console.error('Error eliminando video:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
