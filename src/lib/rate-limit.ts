// Sistema de rate limiting con sliding window usando Map en memoria

interface RateLimitEntry {
  timestamps: number[]
}

// Almacenamiento en memoria para rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>()

// Limpiar entradas expiradas cada 5 minutos
const CLEANUP_INTERVAL = 5 * 60 * 1000

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    // Eliminar entradas sin timestamps recientes
    if (entry.timestamps.length === 0 || entry.timestamps[entry.timestamps.length - 1] < now - 60000) {
      rateLimitStore.delete(key)
    }
  }
}, CLEANUP_INTERVAL)

interface RateLimitConfig {
  // Numero maximo de requests permitidos en la ventana
  maxRequests: number
  // Ventana de tiempo en milisegundos
  windowMs: number
}

interface RateLimitResult {
  // Si la solicitud esta permitida
  allowed: boolean
  // Requests restantes en la ventana actual
  remaining: number
  // Timestamp cuando se resetea la ventana
  resetAt: number
  // Total de requests permitidos
  limit: number
}

/**
 * Verifica si un identificador (IP, userId) ha excedido el limite de requests.
 * Implementa sliding window para un control mas preciso.
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 60, windowMs: 60000 }
): RateLimitResult {
  const now = Date.now()
  const windowStart = now - config.windowMs

  // Obtener o crear entrada
  let entry = rateLimitStore.get(identifier)
  if (!entry) {
    entry = { timestamps: [] }
    rateLimitStore.set(identifier, entry)
  }

  // Filtrar timestamps dentro de la ventana actual (sliding window)
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart)

  const currentCount = entry.timestamps.length
  const allowed = currentCount < config.maxRequests

  if (allowed) {
    entry.timestamps.push(now)
  }

  // Calcular cuando se resetea (cuando expire el timestamp mas antiguo)
  const resetAt = entry.timestamps.length > 0
    ? entry.timestamps[0] + config.windowMs
    : now + config.windowMs

  return {
    allowed,
    remaining: Math.max(0, config.maxRequests - entry.timestamps.length),
    resetAt,
    limit: config.maxRequests,
  }
}

/**
 * Configuraciones predefinidas para diferentes endpoints
 */
export const RATE_LIMITS = {
  // API general: 60 requests por minuto
  api: { maxRequests: 60, windowMs: 60000 },
  // Autenticacion: 5 intentos por 15 minutos
  auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 },
  // Creacion de videos: 10 por hora
  videoCreation: { maxRequests: 10, windowMs: 60 * 60 * 1000 },
  // Upload de archivos: 20 por hora
  upload: { maxRequests: 20, windowMs: 60 * 60 * 1000 },
  // AI requests: 30 por hora
  ai: { maxRequests: 30, windowMs: 60 * 60 * 1000 },
} as const
