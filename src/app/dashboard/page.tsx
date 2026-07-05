'use client'

import { useState } from 'react'
import {
  Video,
  Eye,
  TrendingUp,
  Zap,
  Plus,
  Clock,
  ArrowUpRight,
  Sparkles,
  PlusCircle,
  Film,
  ImageIcon,
  CalendarDays,
  Music,
  Mic,
  Star,
  Rocket,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

// Pagina principal del dashboard con widgets mejorados
const stats = [
  { label: 'Videos Creados', value: '12', icon: Video, change: '+3 este mes', color: 'text-primary-400', bgColor: 'bg-primary-500/10' },
  { label: 'Vistas Totales', value: '8.4K', icon: Eye, change: '+24%', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { label: 'Engagement', value: '6.2%', icon: TrendingUp, change: '+1.8%', color: 'text-green-400', bgColor: 'bg-green-500/10' },
  { label: 'Videos Restantes', value: '18', icon: Zap, change: 'de 30/mes', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
]

const recentVideos = [
  { id: '1', title: '5 Tips de Productividad', platform: 'tiktok', status: 'completed', date: 'Hace 2h', views: '1.2K' },
  { id: '2', title: 'Receta Facil en 60s', platform: 'reels', status: 'completed', date: 'Hace 5h', views: '890' },
  { id: '3', title: 'Motivacion Lunes', platform: 'shorts', status: 'processing', date: 'Hace 1d', views: '-' },
]

// Datos mock de actividad semanal
const weeklyActivity = [
  { day: 'Lun', videos: 3, max: 5 },
  { day: 'Mar', videos: 1, max: 5 },
  { day: 'Mie', videos: 4, max: 5 },
  { day: 'Jue', videos: 2, max: 5 },
  { day: 'Vie', videos: 5, max: 5 },
  { day: 'Sab', videos: 2, max: 5 },
  { day: 'Dom', videos: 0, max: 5 },
]

// Acciones rapidas mejoradas
const quickActions = [
  { href: '/dashboard/create', label: 'Crear Video', description: 'Generacion con IA', icon: PlusCircle, gradient: 'from-primary-600 to-accent-600' },
  { href: '/dashboard/editor', label: 'Editor', description: 'Edicion avanzada', icon: Film, gradient: 'from-blue-600 to-cyan-600' },
  { href: '/dashboard/thumbnails', label: 'Thumbnail', description: 'Genera portadas', icon: ImageIcon, gradient: 'from-pink-600 to-rose-600' },
  { href: '/dashboard/calendar', label: 'Calendario', description: 'Planifica contenido', icon: CalendarDays, gradient: 'from-green-600 to-emerald-600' },
  { href: '/dashboard/music', label: 'Musica', description: 'Biblioteca audio', icon: Music, gradient: 'from-orange-600 to-amber-600' },
  { href: '/dashboard/narration', label: 'Narracion', description: 'Voz con IA', icon: Mic, gradient: 'from-violet-600 to-purple-600' },
]

// Novedades / Changelog
const changelog = [
  { title: 'Narracion con IA', description: 'Genera voces naturales para tus videos', isNew: true },
  { title: 'Traduccion automatica', description: 'Traduce tus scripts a 15+ idiomas', isNew: true },
  { title: 'Auto-Publicacion', description: 'Conecta TikTok, Instagram y YouTube', isNew: true },
  { title: 'Gestion de Equipo', description: 'Invita miembros y asigna roles', isNew: false },
]

export default function DashboardPage() {
  const [aiQuery, setAiQuery] = useState('')

  // Abrir el chatbot con una pregunta desde el input rapido
  const handleAiQuery = () => {
    if (!aiQuery.trim()) return
    const chatButton = document.querySelector('[aria-label="Abrir asistente IA"]') as HTMLButtonElement
    if (chatButton) chatButton.click()
    setTimeout(() => {
      const chatInput = document.querySelector('[placeholder="Escribe tu pregunta..."]') as HTMLInputElement
      if (chatInput) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
        nativeInputValueSetter?.call(chatInput, aiQuery)
        chatInput.dispatchEvent(new Event('input', { bubbles: true }))
        chatInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      }
    }, 400)
    setAiQuery('')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-dark-muted">Bienvenido de vuelta. Aqui tienes un resumen de tu actividad.</p>
        </div>
        <Link href="/dashboard/create">
          <Button icon={<Plus className="w-4 h-4" />}>Crear Video</Button>
        </Link>
      </div>

      {/* Seccion Pregunta a la IA */}
      <div className="relative overflow-hidden rounded-2xl border border-primary-500/20 bg-gradient-to-r from-primary-500/5 via-dark-card to-primary-500/5 p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-purple flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Pregunta a la IA</h3>
              <p className="text-xs text-dark-muted">Ideas, tendencias, horarios y mas</p>
            </div>
          </div>
          <div className="flex-1 w-full sm:w-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiQuery()}
                placeholder="Ej: Dame ideas para un video de cocina..."
                className="flex-1 bg-dark-hover/50 border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-colors"
              />
              <button
                onClick={handleAiQuery}
                className="px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Preguntar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats mejoradas con iconos y gradientes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-500/5">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-dark-muted uppercase tracking-wide">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-400" />
                    <p className="text-xs text-green-400">{stat.change}</p>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Acciones rapidas prominentes */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary-400" />
          Acciones Rapidas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group relative overflow-hidden rounded-xl border border-dark-border bg-dark-card p-4 text-center hover:border-primary-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
            >
              <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-white">{action.label}</p>
              <p className="text-[11px] text-dark-muted mt-0.5">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Grid principal: Videos + Actividad semanal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Videos recientes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Videos Recientes</CardTitle>
                <Link href="/dashboard/videos" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                  Ver todos
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentVideos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-bg/50 border border-dark-border hover:border-dark-hover transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                        <Video className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{video.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant={video.status === 'completed' ? 'success' : 'warning'}>
                            {video.status === 'completed' ? 'Listo' : 'Procesando'}
                          </Badge>
                          <span className="text-xs text-dark-muted">{video.platform}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{video.views} vistas</p>
                      <p className="text-xs text-dark-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actividad semanal con grafico de barras CSS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-400" />
              Actividad Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-40 mb-4">
              {weeklyActivity.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end h-28">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-500"
                      style={{ height: `${(day.videos / day.max) * 100}%`, minHeight: day.videos > 0 ? '8px' : '2px' }}
                    />
                  </div>
                  <span className="text-[10px] text-dark-muted">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-dark-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-muted">Total esta semana</span>
                <span className="text-sm font-semibold text-primary-400">
                  {weeklyActivity.reduce((sum, d) => sum + d.videos, 0)} videos
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Novedades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Novedades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {changelog.map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-dark-bg/50 border border-dark-border hover:border-primary-500/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{item.title}</span>
                  {item.isNew && (
                    <Badge variant="info" className="text-[9px] px-1.5 py-0">NUEVO</Badge>
                  )}
                </div>
                <p className="text-xs text-dark-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
