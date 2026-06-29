'use client'

import { useState, useCallback } from 'react'
import { useUser } from './useUser'

// Hook para gestionar la suscripcion
export function useSubscription() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentPlan = user?.plan || 'starter'

  // Crear sesion de checkout para upgrade
  const upgradePlan = useCallback(async (plan: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      if (!res.ok) throw new Error('Error al crear sesion de pago')
      const data = await res.json()

      // Redirigir a Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  // Verificar limites del plan
  const checkLimit = useCallback((videosCreated: number) => {
    const limits: Record<string, number> = {
      starter: 3,
      creator: 30,
      business: -1,
    }

    const limit = limits[currentPlan] || 3
    if (limit === -1) return { allowed: true, remaining: Infinity }
    return { allowed: videosCreated < limit, remaining: Math.max(0, limit - videosCreated) }
  }, [currentPlan])

  return { currentPlan, loading, error, upgradePlan, checkLimit }
}
