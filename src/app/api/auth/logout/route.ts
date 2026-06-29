import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

// POST - Cerrar sesion
export async function POST() {
  try {
    const supabase = createSupabaseAdmin()
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
