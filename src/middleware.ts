import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware para proteger rutas del dashboard
// Si Supabase no esta configurado, permite el acceso (modo demo)
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Si no hay variables de Supabase configuradas, modo demo (permite todo)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'https://your-project.supabase.co') {
    // Modo demo: permitir acceso a todo sin autenticacion
    return response
  }

  // Si Supabase esta configurado, verificar autenticacion
  try {
    const { createServerClient } = await import('@supabase/ssr')

    let authResponse = response

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          authResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            authResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    const { data: { session } } = await supabase.auth.getSession()

    // Proteger rutas del dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard') && !session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirigir al dashboard si ya esta autenticado
    if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return authResponse
  } catch {
    // Si hay cualquier error con Supabase, permitir acceso (modo demo)
    return response
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
