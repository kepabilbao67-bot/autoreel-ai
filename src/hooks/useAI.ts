'use client'

import { useState, useCallback } from 'react'

// Hook para interactuar con las APIs de IA
export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generar guion
  const generateScript = useCallback(async (params: {
    topic: string
    platform: string
    duration: number
    style: string
    language: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ai/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      if (!res.ok) throw new Error('Error al generar guion')
      const data = await res.json()
      return data.script
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Generar hashtags
  const generateHashtags = useCallback(async (params: {
    topic: string
    platform: string
    language: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ai/generate-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      if (!res.ok) throw new Error('Error al generar hashtags')
      return await res.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Generacion con un clic
  const oneClickGenerate = useCallback(async (params: {
    topic: string
    platform: string
    duration: number
    style: string
    language: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ai/one-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      if (!res.ok) throw new Error('Error en generacion automatica')
      return await res.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Detectar tendencias
  const detectTrends = useCallback(async (params: { niche: string; platform: string }) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ai/detect-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      if (!res.ok) throw new Error('Error al detectar tendencias')
      return await res.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, generateScript, generateHashtags, oneClickGenerate, detectTrends }
}
