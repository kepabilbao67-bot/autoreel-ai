import { NextResponse } from 'next/server'

// Notificaciones mock para el sistema
// En produccion se conectaria a Supabase
const mockNotifications = [
  {
    id: '1',
    title: 'Video completado',
    message: 'Tu video "Marketing Digital 2024" se ha procesado exitosamente.',
    type: 'success' as const,
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    title: 'Nuevo template disponible',
    message: 'Se ha agregado el template "Tendencias Tech" a la galeria.',
    type: 'info' as const,
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    title: 'Publicacion programada enviada',
    message: 'Tu video fue publicado automaticamente en TikTok.',
    type: 'success' as const,
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '4',
    title: 'Limite de plan cercano',
    message: 'Has usado 8 de 10 videos disponibles este mes. Considera actualizar tu plan.',
    type: 'warning' as const,
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
]

// GET - Obtener notificaciones del usuario
export async function GET() {
  try {
    // En produccion, se filtraria por userId desde la sesion
    return NextResponse.json({
      notifications: mockNotifications,
      unreadCount: mockNotifications.filter((n) => !n.read).length,
    })
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Marcar notificacion como leida
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { notificationId, action } = body

    if (action === 'markRead' && notificationId) {
      // En produccion, actualizar en base de datos
      return NextResponse.json({ success: true, message: 'Notificacion marcada como leida' })
    }

    if (action === 'markAllRead') {
      // En produccion, actualizar todas las del usuario
      return NextResponse.json({ success: true, message: 'Todas las notificaciones marcadas como leidas' })
    }

    return NextResponse.json(
      { error: 'Accion no valida' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error actualizando notificacion:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
