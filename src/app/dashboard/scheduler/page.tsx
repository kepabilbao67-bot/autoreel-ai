'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

// Tipo de publicacion programada
interface ScheduledPost {
  id: string
  video_title: string
  platform: string
  scheduled_at: string
  status: 'pending' | 'published' | 'failed'
}

// Colores por plataforma
const platformColors: Record<string, string> = {
  tiktok: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  reels: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  shorts: 'bg-red-500/10 text-red-400 border-red-500/30',
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-400' },
  published: { label: 'Publicado', color: 'text-green-400' },
  failed: { label: 'Error', color: 'text-red-400' },
}

// Obtener dias de la semana actual
function getWeekDays(baseDate: Date): Date[] {
  const startOfWeek = new Date(baseDate)
  const day = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
  startOfWeek.setDate(diff)

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date
  })
}

const dayNames = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

export default function SchedulerPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPost, setNewPost] = useState({
    videoId: '',
    platform: 'tiktok',
    scheduledAt: '',
  })

  const weekDays = getWeekDays(currentWeek)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      setLoading(true)
      const res = await fetch('/api/scheduler')
      if (res.ok) {
        const data = await res.json()
        setPosts(data.scheduledPosts || [])
      }
    } catch (error) {
      console.error('Error cargando publicaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  async function createPost() {
    try {
      const res = await fetch('/api/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      })
      if (res.ok) {
        setShowCreateModal(false)
        setNewPost({ videoId: '', platform: 'tiktok', scheduledAt: '' })
        fetchPosts()
      }
    } catch (error) {
      console.error('Error creando publicacion:', error)
    }
  }

  async function deletePost(id: string) {
    try {
      await fetch(`/api/scheduler?id=${id}`, { method: 'DELETE' })
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error('Error eliminando publicacion:', error)
    }
  }

  function navigateWeek(direction: number) {
    const newDate = new Date(currentWeek)
    newDate.setDate(newDate.getDate() + direction * 7)
    setCurrentWeek(newDate)
  }

  // Obtener posts para un dia especifico
  function getPostsForDay(date: Date): ScheduledPost[] {
    return posts.filter((post) => {
      const postDate = new Date(post.scheduled_at)
      return postDate.toDateString() === date.toDateString()
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Publicaciones Programadas</h1>
          <p className="text-dark-muted text-sm mt-1">Programa y gestiona tus publicaciones en redes sociales</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-purple rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nueva Programacion
        </button>
      </div>

      {/* Vista semanal - Navegacion */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateWeek(-1)}
          className="p-2 rounded-lg text-dark-muted hover:text-white hover:bg-dark-hover transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-white">
          {weekDays[0].toLocaleDateString('es-ES', { month: 'long', day: 'numeric' })} - {weekDays[6].toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
        <button
          onClick={() => navigateWeek(1)}
          className="p-2 rounded-lg text-dark-muted hover:text-white hover:bg-dark-hover transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendario semanal */}
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
        {weekDays.map((date, index) => {
          const dayPosts = getPostsForDay(date)
          const isToday = date.toDateString() === new Date().toDateString()

          return (
            <div
              key={index}
              className={`rounded-xl border p-3 min-h-[120px] ${
                isToday ? 'border-primary-500/50 bg-primary-500/5' : 'border-dark-border bg-dark-card'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-dark-muted">{dayNames[index]}</span>
                <span className={`text-sm font-bold ${isToday ? 'text-primary-400' : 'text-white'}`}>
                  {date.getDate()}
                </span>
              </div>
              <div className="space-y-1.5">
                {dayPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`px-2 py-1.5 rounded-lg border text-[10px] ${platformColors[post.platform] || 'bg-dark-hover text-dark-text border-dark-border'}`}
                  >
                    <p className="font-medium truncate">{post.video_title}</p>
                    <p className="opacity-75">
                      {new Date(post.scheduled_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Lista de publicaciones */}
      <div className="rounded-xl border border-dark-border bg-dark-card overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-border">
          <h3 className="text-sm font-semibold text-white">Todas las Publicaciones</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-dark-muted text-sm">Cargando...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-dark-muted mx-auto mb-3" />
            <p className="text-dark-muted text-sm">No hay publicaciones programadas</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-border">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{post.video_title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${platformColors[post.platform]}`}>
                      {post.platform}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-dark-muted">
                      <Clock className="w-3 h-3" />
                      {new Date(post.scheduled_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className={`text-xs font-medium ${statusLabels[post.status]?.color || 'text-dark-muted'}`}>
                      {statusLabels[post.status]?.label || post.status}
                    </span>
                  </div>
                </div>
                {post.status === 'pending' && (
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 rounded-lg text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de creacion */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-dark-border bg-dark-card p-6 z-10">
            <h3 className="text-lg font-bold text-white mb-4">Nueva Publicacion Programada</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Video ID</label>
                <input
                  type="text"
                  value={newPost.videoId}
                  onChange={(e) => setNewPost({ ...newPost, videoId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-white placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
                  placeholder="ID del video a publicar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Plataforma</label>
                <select
                  value={newPost.platform}
                  onChange={(e) => setNewPost({ ...newPost, platform: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="tiktok">TikTok</option>
                  <option value="reels">Instagram Reels</option>
                  <option value="shorts">YouTube Shorts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Fecha y Hora</label>
                <input
                  type="datetime-local"
                  value={newPost.scheduledAt}
                  onChange={(e) => setNewPost({ ...newPost, scheduledAt: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-dark-border text-dark-muted hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={createPost}
                className="flex-1 py-2.5 rounded-xl bg-gradient-purple text-white font-medium hover:opacity-90"
              >
                Programar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
