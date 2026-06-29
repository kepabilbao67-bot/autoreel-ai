import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

// GET - Iniciar flujo OAuth con Google
export async function GET() {
  try {
    const supabase = createSupabaseAdmin()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ url: data.url })
  } catch (error) {
    console.error('Error en Google auth:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
