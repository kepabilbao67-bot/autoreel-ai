// Sistema de tracking de eventos para analytics

// Tipos de eventos que se pueden trackear
type AnalyticsEvent =
  | 'page_view'
  | 'video_created'
  | 'video_completed'
  | 'video_shared'
  | 'subscription_started'
  | 'subscription_canceled'
  | 'template_used'
  | 'ai_generation_started'
  | 'ai_generation_completed'
  | 'user_registered'
  | 'user_login'
  | 'upload_started'
  | 'upload_completed'
  | 'scheduled_post_created'
  | 'notification_clicked'

interface EventProperties {
  [key: string]: string | number | boolean | undefined
}

interface TrackingPayload {
  event: AnalyticsEvent
  properties?: EventProperties
  timestamp: string
  userId?: string
  sessionId?: string
  page?: string
}

// Cola de eventos para batch sending
const eventQueue: TrackingPayload[] = []
const BATCH_SIZE = 10
const FLUSH_INTERVAL = 30000 // 30 segundos

/**
 * Genera un ID de sesion unico
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server'

  let sessionId = sessionStorage.getItem('autoreel_session_id')
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    sessionStorage.setItem('autoreel_session_id', sessionId)
  }
  return sessionId
}

/**
 * Envia los eventos acumulados al backend
 */
async function flushEvents(): Promise<void> {
  if (eventQueue.length === 0) return

  const events = eventQueue.splice(0, BATCH_SIZE)

  try {
    // En produccion, enviar a endpoint de analytics
    if (process.env.NODE_ENV === 'production') {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      })
    } else {
      // En desarrollo, solo log en consola
      console.log('[Analytics]', events.map((e) => `${e.event}: ${JSON.stringify(e.properties)}`))
    }
  } catch (error) {
    // No bloquear la aplicacion por errores de analytics
    console.warn('[Analytics] Error enviando eventos:', error)
    // Re-encolar los eventos fallidos
    eventQueue.unshift(...events)
  }
}

// Flush periodico de eventos
if (typeof window !== 'undefined') {
  setInterval(flushEvents, FLUSH_INTERVAL)

  // Flush al cerrar la pagina
  window.addEventListener('beforeunload', () => {
    flushEvents()
  })
}

/**
 * Trackea un evento de analytics
 * @param event - Nombre del evento
 * @param properties - Propiedades adicionales del evento
 * @param userId - ID del usuario (opcional)
 */
export function track(
  event: AnalyticsEvent,
  properties?: EventProperties,
  userId?: string
): void {
  const payload: TrackingPayload = {
    event,
    properties,
    timestamp: new Date().toISOString(),
    userId,
    sessionId: typeof window !== 'undefined' ? getSessionId() : 'server',
    page: typeof window !== 'undefined' ? window.location.pathname : undefined,
  }

  eventQueue.push(payload)

  // Flush inmediato si se alcanza el batch size
  if (eventQueue.length >= BATCH_SIZE) {
    flushEvents()
  }
}

/**
 * Trackea una vista de pagina
 */
export function trackPageView(page: string, userId?: string): void {
  track('page_view', { page }, userId)
}

/**
 * Trackea inicio de creacion de video
 */
export function trackVideoCreated(platform: string, style: string, userId?: string): void {
  track('video_created', { platform, style }, userId)
}

/**
 * Trackea inicio de suscripcion
 */
export function trackSubscriptionStarted(plan: string, userId?: string): void {
  track('subscription_started', { plan }, userId)
}
