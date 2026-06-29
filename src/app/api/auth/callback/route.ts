import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

// GET - Callback de OAuth
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
      const supabase = createSupabaseAdmin()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        return NextResponse.redirect(new URL('/login?error=callback_failed', request.url))
      }

      // Crear perfil si no existe
      if (data.user) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.user.id)
          .single()

        if (!existingUser) {
          const insertData = {
            id: data.user.id,
            email: data.user.email || '',
            full_name: (data.user.user_metadata?.full_name as string) || null,
            avatar_url: (data.user.user_metadata?.avatar_url as string) || null,
          }
          await supabase.from('users').insert(insertData)
        }
      }
    }

    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Error en callback:', error)
    return NextResponse.redirect(new URL('/login?error=server_error', request.url))
  }
}
