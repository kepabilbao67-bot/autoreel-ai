'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type User = Database['public']['Tables']['users']['Row']

// Hook para obtener el usuario actual
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseClient()

    async function getUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const { data, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (fetchError) throw fetchError
          setUser(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al obtener usuario')
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Escuchar cambios de autenticacion
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null)
      } else {
        getUser()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading, error }
}
