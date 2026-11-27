import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

// Cliente de Supabase para route handlers que lee y escribe la sesion en
// cookies. Es el que deben usar login/registro/OAuth/logout: el cliente admin
// (service role) no guarda sesion, asi que el middleware y requireApiUser
// nunca veian al usuario como autenticado.
export async function createSupabaseRouteClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}
