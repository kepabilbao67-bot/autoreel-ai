'use client'

import { useState } from 'react'
import { Search, Filter, Video, MoreVertical, Play, Download, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

// Pagina de lista de videos
const mockVideos = [
  { id: '1', title: '5 Tips de Productividad', platform: 'tiktok', status: 'completed' as const, date: '2025-01-15', duration: 30, views: 1200 },
  { id: '2', title: 'Receta Facil en 60s', platform: 'reels', status: 'completed' as const, date: '2025-01-14', duration: 60, views: 890 },
  { id: '3', title: 'Motivacion Lunes', platform: 'shorts', status: 'processing' as const, date: '2025-01-14', duration: 45, views: 0 },
  { id: '4', title: 'Tutorial de Maquillaje', platform: 'reels', status: 'completed' as const, date: '2025-01-13', duration: 90, views: 2300 },
  { id: '5', title: 'Tips de Fotografia', platform: 'tiktok', status: 'failed' as const, date: '2025-01-12', duration: 30, views: 0 },
  { id: '6', title: 'Rutina de Ejercicios', platform: 'shorts', status: 'draft' as const, date: '2025-01-11', duration: 45, views: 0 },
]

const statusConfig = {
  completed: { label: 'Listo', variant: 'success' as const },
  processing: { label: 'Procesando', variant: 'warning' as const },
  failed: { label: 'Error', variant: 'error' as const },
  draft: { label: 'Borrador', variant: 'default' as const },
}

export default function VideosPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const filteredVideos = mockVideos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || v.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mis Videos</h1>
          <p className="text-dark-muted">{mockVideos.length} videos en total</p>
        </div>
      </div>

      {/* Busqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar videos..."
            icon={<Search className="w-5 h-5" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'completed', 'processing', 'draft', 'failed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-sm rounded-xl border transition-colors ${
                filter === f
                  ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                  : 'border-dark-border text-dark-muted hover:border-primary-500/50'
              }`}
            >
              <Filter className="w-4 h-4 inline-block mr-1" />
              {f === 'all' ? 'Todos' : statusConfig[f as keyof typeof statusConfig]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de videos */}
      <div className="space-y-3">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="!p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <Video className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <p className="font-medium">{video.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant={statusConfig[video.status].variant}>
                      {statusConfig[video.status].label}
                    </Badge>
                    <span className="text-xs text-dark-muted">{video.platform}</span>
                    <span className="text-xs text-dark-muted">{video.duration}s</span>
                    <span className="text-xs text-dark-muted">{video.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {video.views > 0 && (
                  <span className="text-sm text-dark-muted">{video.views.toLocaleString()} vistas</span>
                )}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === video.id ? null : video.id)}
                    className="p-2 rounded-lg hover:bg-dark-hover text-dark-muted"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {menuOpen === video.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 glass rounded-xl border border-dark-border p-1 z-10">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-dark-hover text-left">
                        <Play className="w-4 h-4" />
                        Reproducir
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-dark-hover text-left">
                        <Download className="w-4 h-4" />
                        Descargar
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-dark-hover text-left text-red-400">
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-12 h-12 text-dark-muted mx-auto mb-4" />
          <p className="text-dark-muted">No se encontraron videos</p>
          <Button variant="secondary" className="mt-4">Crear tu primer video</Button>
        </div>
      )}
    </div>
  )
}
