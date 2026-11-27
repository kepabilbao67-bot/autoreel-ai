import { NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'

// POST - Cerrar sesion
export async function POST() {
  try {
    // Borra las cookies de sesion del usuario
    const supabase = await createSupabaseRouteClient()
    await supabase.auth.signOut()

    return NextResponse.json({ message: 'Sesion cerrada' })
  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
