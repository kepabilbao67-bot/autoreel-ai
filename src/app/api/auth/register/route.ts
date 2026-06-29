import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { RegisterSchema } from '@/lib/validators'

// POST - Registro de nuevo usuario
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = RegisterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const supabase = createSupabaseAdmin()

    // Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: { full_name: parsed.data.name },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Crear perfil en la tabla users
    if (authData.user) {
      await supabase.from('users').insert({
        id: authData.user.id,
        email: parsed.data.email,
        full_name: parsed.data.name,
        plan: 'starter',
      })
    }

    return NextResponse.json({
      user: authData.user,
      message: 'Cuenta creada exitosamente',
    })
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
