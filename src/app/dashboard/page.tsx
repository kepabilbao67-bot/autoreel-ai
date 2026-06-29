'use client'

import { useState } from 'react'
import { Video, Eye, TrendingUp, Zap, Plus, Clock, ArrowUpRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

// Pagina principal del dashboard
const stats = [
  { label: 'Videos Creados', value: '12', icon: Video, change: '+3 este mes', color: 'text-primary-400' },
  { label: 'Vistas Totales', value: '8.4K', icon: Eye, change: '+24%', color: 'text-blue-400' },
  { label: 'Engagement', value: '6.2%', icon: TrendingUp, change: '+1.8%', color: 'text-green-400' },
  { label: 'Videos Restantes', value: '18', icon: Zap, change: 'de 30/mes', color: 'text-yellow-400' },
]

const recentVideos = [
  { id: '1', title: '5 Tips de Productividad', platform: 'tiktok', status: 'completed', date: 'Hace 2h', views: '1.2K' },
  { id: '2', title: 'Receta Facil en 60s', platform: 'reels', status: 'completed', date: 'Hace 5h', views: '890' },
  { id: '3', title: 'Motivacion Lunes', platform: 'shorts', status: 'processing', date: 'Hace 1d', views: '-' },
]

const trends = [
  { topic: 'IA para emprendedores', score: 92 },
  { topic: 'Recetas rapidas saludables', score: 87 },
  { topic: 'Rutinas matutinas productivas', score: 84 },
  { topic: 'Tips de finanzas personales', score: 79 },
]

export default function DashboardPage() {
  const [aiQuery, setAiQuery] = useState('')

  // Abrir el chatbot con una pregunta desde el input rapido
  const handleAiQuery = () => {
    if (!aiQuery.trim()) return
    // Disparar click en el boton flotante del chatbot y enviar el mensaje
    const chatButton = document.querySelector('[aria-label="Abrir asistente IA"]') as HTMLButtonElement
    if (chatButton) chatButton.click()
    // Esperar a que se abra el chat y poner el texto en el input
    setTimeout(() => {
      const chatInput = document.querySelector('[placeholder="Escribe tu pregunta..."]') as HTMLInputElement
      if (chatInput) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
        nativeInputValueSetter?.call(chatInput, aiQuery)
        chatInput.dispatchEvent(new Event('input', { bubbles: true }))
        // Simular Enter
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
      <div className="relative overflow-hidden rounded-2xl border border-primary-500/20 bg-gradient-to-r from-primary-500/5 via-dark-bg to-primary-500/5 p-6">
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={stat.label} className="transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-500/5">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-muted">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-dark-muted mt-1">{stat.change}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-dark-hover flex items-center justify-center ${stat.color}`} style={{ animationDelay: `${index * 100}ms` }}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Videos recientes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Videos Recientes</CardTitle>
                <Link href="/dashboard/videos" className="text-sm text-primary-400 hover:text-primary-300">
                  Ver todos
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentVideos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-bg/50 border border-dark-border">
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

        {/* Tendencias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-400" />
              Tendencias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-2.5 rounded-lg bg-dark-bg/50">
                  <span className="text-sm">{trend.topic}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-primary-400 font-medium">{trend.score}%</span>
                    <ArrowUpRight className="w-3 h-3 text-green-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accesos rapidos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard/create" className="card-glass flex items-center gap-4 p-4 hover:border-primary-500/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-purple flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium">Generacion Rapida</p>
            <p className="text-xs text-dark-muted">Un clic para crear video</p>
          </div>
        </Link>
        <Link href="/dashboard/templates" className="card-glass flex items-center gap-4 p-4 hover:border-primary-500/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-blue flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium">Usar Plantilla</p>
            <p className="text-xs text-dark-muted">Elige una plantilla predefinida</p>
          </div>
        </Link>
        <Link href="/dashboard/analytics" className="card-glass flex items-center gap-4 p-4 hover:border-primary-500/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium">Ver Analiticas</p>
            <p className="text-xs text-dark-muted">Revisa tu rendimiento</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
