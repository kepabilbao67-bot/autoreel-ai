import { NextResponse } from 'next/server'

// GET - Iniciar flujo OAuth con Google
export async function GET() {
  try {
    // Modo demo: si no hay Supabase configurado, redirigir al dashboard directamente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
      return NextResponse.json({ url: '/dashboard', demo: true })
    }

    // Modo produccion con Supabase
    const { createSupabaseAdmin } = await import('@/lib/supabase')
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
