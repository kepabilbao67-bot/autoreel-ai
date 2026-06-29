// Logger simple con niveles, timestamps y formato para produccion

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: unknown
  context?: string
}

// Determinar si estamos en produccion
const isProduction = process.env.NODE_ENV === 'production'

// Colores para desarrollo (console)
const levelColors: Record<LogLevel, string> = {
  info: '\x1b[36m',   // Cyan
  warn: '\x1b[33m',   // Amarillo
  error: '\x1b[31m',  // Rojo
  debug: '\x1b[90m',  // Gris
}

const resetColor = '\x1b[0m'

/**
 * Formatea un log entry para produccion (JSON) o desarrollo (legible)
 */
function formatLog(entry: LogEntry): string {
  if (isProduction) {
    // En produccion, formato JSON estructurado para servicios de logging
    const logObj: Record<string, unknown> = {
      level: entry.level,
      msg: entry.message,
      ts: entry.timestamp,
    }
    if (entry.context) logObj.ctx = entry.context
    if (entry.data) logObj.data = entry.data
    return JSON.stringify(logObj)
  }

  // En desarrollo, formato legible con colores
  const color = levelColors[entry.level]
  const prefix = `${color}[${entry.level.toUpperCase()}]${resetColor}`
  const time = new Date(entry.timestamp).toLocaleTimeString()
  const ctx = entry.context ? ` [${entry.context}]` : ''
  return `${prefix} ${time}${ctx}: ${entry.message}`
}

/**
 * Crea un log entry y lo imprime
 */
function log(level: LogLevel, message: string, data?: unknown, context?: string): void {
  // En produccion, no mostrar logs de debug
  if (isProduction && level === 'debug') return

  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    data,
    context,
  }

  const formatted = formatLog(entry)

  switch (level) {
    case 'error':
      console.error(formatted, data ? data : '')
      break
    case 'warn':
      console.warn(formatted, data ? data : '')
      break
    case 'debug':
      console.debug(formatted, data ? data : '')
      break
    default:
      console.log(formatted, data ? data : '')
  }
}

/**
 * Logger principal de la aplicacion
 * Uso: logger.info('Mensaje', { datos }, 'contexto')
 */
export const logger = {
  info: (message: string, data?: unknown, context?: string) =>
    log('info', message, data, context),

  warn: (message: string, data?: unknown, context?: string) =>
    log('warn', message, data, context),

  error: (message: string, data?: unknown, context?: string) =>
    log('error', message, data, context),

  debug: (message: string, data?: unknown, context?: string) =>
    log('debug', message, data, context),
}

/**
 * Crea un logger con contexto prefijado
 * Uso: const log = createLogger('AuthService')
 */
export function createLogger(context: string) {
  return {
    info: (message: string, data?: unknown) => log('info', message, data, context),
    warn: (message: string, data?: unknown) => log('warn', message, data, context),
    error: (message: string, data?: unknown) => log('error', message, data, context),
    debug: (message: string, data?: unknown) => log('debug', message, data, context),
  }
}
