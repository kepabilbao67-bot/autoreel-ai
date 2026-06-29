'use client'

import { useState, useCallback } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Video = Database['public']['Tables']['videos']['Row']

// Hook para gestionar videos del usuario
export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Obtener todos los videos
  const fetchVideos = useCallback(async () => {
    const supabase = createSupabaseClient()
    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error: fetchError } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setVideos(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener videos')
    } finally {
      setLoading(false)
    }
  }, [])

  // Crear un nuevo video
  const createVideo = useCallback(async (videoData: Database['public']['Tables']['videos']['Insert']) => {
    const supabase = createSupabaseClient()
    setError(null)

    try {
      const { data, error: insertError } = await supabase
        .from('videos')
        .insert(videoData)
        .select()
        .single()

      if (insertError) throw insertError
      setVideos((prev) => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear video')
      return null
    }
  }, [])

  // Eliminar un video
  const deleteVideo = useCallback(async (videoId: string) => {
    const supabase = createSupabaseClient()
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId)

      if (deleteError) throw deleteError
      setVideos((prev) => prev.filter((v) => v.id !== videoId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar video')
    }
  }, [])

  return { videos, loading, error, fetchVideos, createVideo, deleteVideo }
}
