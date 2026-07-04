'use client'

import { useState } from 'react'
import {
  History,
  Search,
  Trash2,
  Clock,
  Film,
  Hash,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useVideoHistory } from '@/hooks/useVideoHistory'

export default function HistoryPage() {
  const { videos, removeVideo, clearHistory } = useVideoHistory()
  const [search, setSearch] = useState('')
  const [filterPlatform, setFilterPlatform] = useState<string>('all')

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(search.toLowerCase()) ||
      video.topic.toLowerCase().includes(search.toLowerCase())
    const matchesPlatform = filterPlatform === 'all' || video.platform === filterPlatform
    return matchesSearch && matchesPlatform
  })

  const platformColors: Record<string, string> = {
    tiktok: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    reels: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    shorts: 'bg-red-500/10 text-red-400 border-red-500/30',
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <History className="w-6 h-6 text-primary-400" />
            Historial de Videos
          </h1>
          <p className="text-dark-muted mt-1">
            {videos.length} video{videos.length !== 1 ? 's' : ''} generado{videos.length !== 1 ? 's' : ''}
          </p>
        </div>
        {videos.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm('Borrar todo el historial?')) clearHistory()
            }}
            icon={<Trash2 className="w-4 h-4" />}
          >
            Limpiar
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar por titulo o tema..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2">
              {['all', 'tiktok', 'reels', 'shorts'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => setFilterPlatform(platform)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterPlatform === platform
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                      : 'bg-dark-card border border-dark-border text-dark-muted hover:text-white'
                  }`}
                >
                  {platform === 'all' ? 'Todos' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video List */}
      {filteredVideos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Film className="w-12 h-12 text-dark-muted mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No hay videos</h3>
            <p className="text-sm text-dark-muted">
              {videos.length === 0
                ? 'Los videos que generes apareceran aqui automaticamente'
                : 'No se encontraron resultados para tu busqueda'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredVideos.map((video) => (
            <Card key={video.id}>
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{video.title}</h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          platformColors[video.platform] || 'bg-dark-hover text-dark-text border-dark-border'
                        }`}
                      >
                        {video.platform}
                      </span>
                    </div>
                    <p className="text-sm text-dark-muted mb-2 truncate">{video.topic}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-dark-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.duration}s
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {video.viralityScore}/100
                      </span>
                      <span>
                        {new Date(video.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {video.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {video.hashtags.slice(0, 5).map((tag) => (
                          <Badge key={tag} variant="info">
                            <Hash className="w-2.5 h-2.5 mr-0.5" />
                            {tag.replace('#', '')}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVideo(video.id)}
                    className="text-dark-muted hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
