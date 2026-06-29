import { NextResponse } from 'next/server'
import { LoginSchema } from '@/lib/validators'

// POST - Inicio de sesion con email y contrasena
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = LoginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Modo demo: si no hay Supabase configurado, permitir acceso con cualquier email/password
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
      // Modo demo - simular login exitoso
      return NextResponse.json({
        user: {
          id: 'demo-user-001',
          email: parsed.data.email,
          full_name: 'Usuario Demo',
        },
        session: { access_token: 'demo-token', expires_at: Date.now() + 86400000 },
        demo: true,
      })
    }

    // Modo produccion con Supabase
    const { createSupabaseAdmin } = await import('@/lib/supabase')
    const supabase = createSupabaseAdmin()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Credenciales invalidas' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
    })
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
