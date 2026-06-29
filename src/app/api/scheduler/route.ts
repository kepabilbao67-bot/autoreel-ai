import { NextResponse } from 'next/server'

// Publicaciones programadas mock
// En produccion se conectaria a la tabla scheduled_posts de Supabase
const mockScheduledPosts = [
  {
    id: 'sp1',
    user_id: 'user1',
    video_id: 'vid1',
    video_title: 'Tips de Marketing Digital',
    platform: 'tiktok',
    scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    status: 'pending' as const,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sp2',
    user_id: 'user1',
    video_id: 'vid2',
    video_title: 'Tutorial React Hooks',
    platform: 'reels',
    scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    status: 'pending' as const,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sp3',
    user_id: 'user1',
    video_id: 'vid3',
    video_title: 'AI para Negocios',
    platform: 'shorts',
    scheduled_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    status: 'published' as const,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

// GET - Obtener publicaciones programadas del usuario
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    let posts = [...mockScheduledPosts]

    // Filtrar por estado si se proporciona
    if (status) {
      posts = posts.filter((p) => p.status === status)
    }

    // Ordenar por fecha programada
    posts.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())

    return NextResponse.json({
      scheduledPosts: posts,
      total: posts.length,
    })
  } catch (error) {
    console.error('Error obteniendo publicaciones programadas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva publicacion programada
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { videoId, platform, scheduledAt, userId } = body

    // Validar campos requeridos
    if (!videoId || !platform || !scheduledAt) {
      return NextResponse.json(
        { error: 'Se requiere videoId, platform y scheduledAt' },
        { status: 400 }
      )
    }

    // Validar que la fecha sea futura
    if (new Date(scheduledAt) <= new Date()) {
      return NextResponse.json(
        { error: 'La fecha programada debe ser en el futuro' },
        { status: 400 }
      )
    }

    // Validar plataforma
    const validPlatforms = ['tiktok', 'reels', 'shorts']
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: 'Plataforma no valida. Opciones: tiktok, reels, shorts' },
        { status: 400 }
      )
    }

    // En produccion, insertar en Supabase
    const newPost = {
      id: `sp_${Date.now()}`,
      user_id: userId || 'user1',
      video_id: videoId,
      video_title: 'Nuevo Video Programado',
      platform,
      scheduled_at: scheduledAt,
      status: 'pending' as const,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({ scheduledPost: newPost }, { status: 201 })
  } catch (error) {
    console.error('Error creando publicacion programada:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Cancelar publicacion programada
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('id')

    if (!postId) {
      return NextResponse.json(
        { error: 'Se requiere el ID de la publicacion' },
        { status: 400 }
      )
    }

    // En produccion, eliminar de Supabase
    return NextResponse.json({ message: 'Publicacion programada cancelada', id: postId })
  } catch (error) {
    console.error('Error eliminando publicacion programada:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
