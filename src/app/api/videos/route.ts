import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { CreateVideoSchema } from '@/lib/validators'
import { requireApiUser } from '@/lib/api-auth'

// El usuario se obtiene SIEMPRE de la sesion. Antes se aceptaba un userId
// enviado por el cliente y, como el cliente admin ignora RLS, cualquiera podia
// leer, crear o borrar videos de otro usuario cambiando ese parametro.

// GET - Obtener videos del usuario
export async function GET(request: Request) {
  const auth = await requireApiUser(request, 'api', { allowAnonymous: false })
  if (auth instanceof NextResponse) return auth
  const userId = auth.id

  try {
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
  const auth = await requireApiUser(request, 'api', { allowAnonymous: false })
  if (auth instanceof NextResponse) return auth
  const userId = auth.id

  try {
    const body = await request.json()
    // Un userId enviado por el cliente se ignora
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId: _ignored, ...videoData } = body

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
  const auth = await requireApiUser(request, 'api', { allowAnonymous: false })
  if (auth instanceof NextResponse) return auth
  const userId = auth.id

  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('id')

    if (!videoId) {
      return NextResponse.json({ error: 'Se requiere id' }, { status: 400 })
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
