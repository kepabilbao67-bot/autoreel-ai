import { NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// Protege las rutas de API que consumen servicios de pago (OpenAI, Replicate,
// ElevenLabs) o almacenamiento. Uso al inicio de cada handler:
//
//   const auth = await requireApiUser(request, 'ai')
//   if (auth instanceof NextResponse) return auth
//
// - Con Supabase configurado: exige sesion valida (auth.getUser verifica el
//   token contra Supabase) y aplica rate limit por usuario.
// - Sin Supabase (modo demo): solo deja pasar si NO hay ninguna clave de
//   proveedor de pago configurada (las rutas devuelven respuestas mock) o si
//   ALLOW_ANONYMOUS_AI=true. Asi un despliegue demo con clave real no queda
//   abierto a que cualquiera gaste el saldo. Aplica rate limit por IP.

export type ApiBucket = keyof typeof RATE_LIMITS

export interface ApiUser {
  id: string | null // null en modo demo anonimo
  email: string | null
  anonymous: boolean
}

export interface AuthenticatedApiUser extends ApiUser {
  id: string
  anonymous: false
}

interface RequireOptions {
  // false para endpoints baratos de sondeo (p.ej. consultar estado)
  rateLimit?: boolean
  // false para endpoints que necesitan un usuario real (datos, pagos):
  // en modo demo sin Supabase responden 503 en vez de dejar pasar.
  allowAnonymous?: boolean
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && key && url !== 'https://your-project.supabase.co')
}

function hasRealKey(value: string | undefined, placeholders: string[] = []): boolean {
  return Boolean(value && !placeholders.includes(value) && !value.includes('your-'))
}

export function hasPaidProviderConfigured(): boolean {
  return (
    hasRealKey(process.env.OPENAI_API_KEY, ['sk-placeholder']) ||
    hasRealKey(process.env.REPLICATE_API_TOKEN) ||
    hasRealKey(process.env.ELEVENLABS_API_KEY)
  )
}

function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

function parseCookies(header: string | null): { name: string; value: string }[] {
  if (!header) return []
  return header.split(';').flatMap((part) => {
    const idx = part.indexOf('=')
    if (idx < 0) return []
    const name = part.slice(0, idx).trim()
    if (!name) return []
    let value = part.slice(idx + 1).trim()
    try {
      value = decodeURIComponent(value)
    } catch {
      /* deja el valor tal cual */
    }
    return [{ name, value }]
  })
}

function tooManyRequests(resetAt: number): NextResponse {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))
  return NextResponse.json(
    { error: 'Has alcanzado el limite de uso. Intentalo mas tarde.' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  )
}

export async function requireApiUser(
  request: Request,
  bucket: ApiBucket,
  options: RequireOptions & { allowAnonymous: false }
): Promise<AuthenticatedApiUser | NextResponse>
export async function requireApiUser(
  request: Request,
  bucket: ApiBucket,
  options?: RequireOptions
): Promise<ApiUser | NextResponse>
export async function requireApiUser(
  request: Request,
  bucket: ApiBucket,
  options: RequireOptions = {}
): Promise<ApiUser | NextResponse> {
  const applyRateLimit = options.rateLimit !== false

  if (!isSupabaseConfigured()) {
    if (options.allowAnonymous === false) {
      return NextResponse.json(
        { error: 'Autenticacion no configurada. Configura Supabase.' },
        { status: 503 }
      )
    }
    if (hasPaidProviderConfigured() && process.env.ALLOW_ANONYMOUS_AI !== 'true') {
      return NextResponse.json(
        { error: 'Autenticacion no configurada. Configura Supabase para usar la IA.' },
        { status: 503 }
      )
    }
    if (applyRateLimit) {
      const rl = rateLimit(`anon:${bucket}:${clientIp(request)}`, RATE_LIMITS[bucket])
      if (!rl.allowed) return tooManyRequests(rl.resetAt)
    }
    return { id: null, email: null, anonymous: true }
  }

  let userId: string | null = null
  let email: string | null = null
  try {
    const { createServerClient } = await import('@supabase/ssr')
    const cookies = parseCookies(request.headers.get('cookie'))
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookies,
          // Los route handlers no necesitan refrescar la sesion aqui; el
          // middleware del dashboard se encarga de renovar cookies.
          setAll: () => {},
        },
      }
    )
    const { data, error } = await supabase.auth.getUser()
    if (!error && data.user) {
      userId = data.user.id
      email = data.user.email ?? null
    }
  } catch (error) {
    console.error('Error verificando sesion:', error)
  }

  if (!userId) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  if (applyRateLimit) {
    const rl = rateLimit(`user:${bucket}:${userId}`, RATE_LIMITS[bucket])
    if (!rl.allowed) return tooManyRequests(rl.resetAt)
  }

  return { id: userId, email, anonymous: false }
}
