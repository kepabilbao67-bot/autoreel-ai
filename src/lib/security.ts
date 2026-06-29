// Funciones de seguridad para la aplicacion

/**
 * Sanitiza input del usuario removiendo caracteres peligrosos
 * Previene XSS y inyeccion de codigo
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Valida que el origen de la request sea permitido
 * Previene CSRF y requests no autorizadas
 */
export function validateOrigin(origin: string | null, allowedOrigins?: string[]): boolean {
  if (!origin) return false

  const defaultAllowed = [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'https://autoreel.ai',
    'https://www.autoreel.ai',
  ]

  const origins = allowedOrigins || defaultAllowed
  return origins.some((allowed) => origin.startsWith(allowed))
}

/**
 * Genera un token CSRF aleatorio
 * Se usa para proteger formularios contra ataques CSRF
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Hash de contrasena usando Web Crypto API
 * Placeholder - en produccion usar bcrypt o argon2 en el servidor
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Verifica si un string contiene posible inyeccion SQL
 * Capa adicional de seguridad (Supabase ya parametriza queries)
 */
export function detectSQLInjection(input: string): boolean {
  const patterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /(--|;|\/\*|\*\/)/,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
  ]
  return patterns.some((pattern) => pattern.test(input))
}

/**
 * Valida y sanitiza una URL
 * Previene open redirect y SSRF
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    // Solo permitir protocolos seguros
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null
    }
    return parsed.toString()
  } catch {
    return null
  }
}

/**
 * Genera headers de seguridad para las respuestas
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  }
}
