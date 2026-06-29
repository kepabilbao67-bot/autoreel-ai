import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

// POST - Enviar email de recuperacion de contrasena
export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Siempre devolver exito para no revelar si el email existe
    return NextResponse.json({ message: 'Si el email existe, recibiras un enlace' })
  } catch (error) {
    console.error('Error en forgot-password:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
