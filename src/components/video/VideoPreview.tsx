'use client'

import { Play, Pause, Volume2, Maximize2 } from 'lucide-react'
import { useState } from 'react'

// Preview mock de video en formato 9:16 con subtitulos
interface VideoPreviewProps {
  title?: string
  subtitle?: string
  platform?: 'tiktok' | 'reels' | 'shorts'
  duration?: number
  className?: string
}

export function VideoPreview({
  title = 'Tu Video',
  subtitle = 'Los subtitulos apareceran aqui...',
  platform = 'tiktok',
  duration = 30,
  className = '',
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const platformLabels = {
    tiktok: 'TikTok',
    reels: 'Instagram Reels',
    shorts: 'YouTube Shorts',
  }

  return (
    <div className={`relative ${className}`}>
      {/* Contenedor 9:16 */}
      <div className="relative w-full max-w-[280px] mx-auto aspect-[9/16] bg-dark-bg rounded-2xl overflow-hidden border border-dark-border">
        {/* Fondo degradado simulando video */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-dark-bg to-accent-950" />

        {/* Header del video */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="text-xs bg-black/50 px-2 py-1 rounded-full text-white">
            {platformLabels[platform]}
          </span>
          <span className="text-xs bg-black/50 px-2 py-1 rounded-full text-white">
            0:{duration.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Contenido central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
        </div>

        {/* Titulo del video */}
        <div className="absolute bottom-20 left-4 right-4 z-10">
          <p className="text-white font-bold text-sm">{title}</p>
        </div>

        {/* Subtitulos */}
        <div className="absolute bottom-10 left-4 right-4 z-10 text-center">
          <p className="text-white text-sm bg-black/60 px-3 py-1.5 rounded-lg inline-block">
            {subtitle}
          </p>
        </div>

        {/* Controles inferiores */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
          <Volume2 className="w-4 h-4 text-white/70" />
          <Maximize2 className="w-4 h-4 text-white/70" />
        </div>
      </div>
    </div>
  )
}
