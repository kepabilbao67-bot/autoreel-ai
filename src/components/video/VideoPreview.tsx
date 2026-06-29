'use client'

import { Play, Pause, Volume2, Maximize2, SkipForward, SkipBack } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

// Preview de video con imagenes reales, subtitulos y animaciones
interface VideoPreviewProps {
  title?: string
  subtitle?: string
  platform?: 'tiktok' | 'reels' | 'shorts'
  duration?: number
  className?: string
  images?: string[] // URLs de imagenes subidas
  subtitles?: Array<{ start: number; end: number; text: string }>
  script?: string
}

export function VideoPreview({
  title = 'Tu Video',
  subtitle,
  platform = 'tiktok',
  duration = 30,
  className = '',
  images = [],
  subtitles = [],
  script = '',
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Obtener el subtitulo actual basado en el tiempo
  const getCurrentSubtitle = useCallback(() => {
    if (subtitles.length > 0) {
      const current = subtitles.find(
        (s) => currentTime >= s.start && currentTime < s.end
      )
      return current?.text || ''
    }
    // Si no hay subtitulos, mostrar partes del script
    if (script) {
      const lines = script.split('\n').filter((l) => l.trim().length > 0)
      const lineIndex = Math.floor((currentTime / duration) * lines.length)
      return lines[Math.min(lineIndex, lines.length - 1)] || ''
    }
    return subtitle || ''
  }, [currentTime, subtitles, script, duration, subtitle])

  // Simular reproduccion
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.5
        if (next >= duration) {
          setIsPlaying(false)
          return 0
        }
        return next
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isPlaying, duration])

  // Cambiar imagen basado en el tiempo
  useEffect(() => {
    if (images.length === 0) return
    const timePerImage = duration / images.length
    const newIndex = Math.min(
      Math.floor(currentTime / timePerImage),
      images.length - 1
    )
    setCurrentImageIndex(newIndex)
  }, [currentTime, images, duration])

  const platformLabels = {
    tiktok: 'TikTok',
    reels: 'Instagram Reels',
    shorts: 'YouTube Shorts',
  }

  const progressPercent = (currentTime / duration) * 100

  return (
    <div className={`relative ${className}`}>
      {/* Contenedor 9:16 */}
      <div className="relative w-full max-w-[320px] mx-auto aspect-[9/16] bg-dark-bg rounded-2xl overflow-hidden border border-dark-border shadow-2xl shadow-primary-500/10">
        
        {/* Fondo: imagen real o gradiente */}
        {images.length > 0 ? (
          <>
            {/* Imagen de fondo real */}
            <img
              src={images[currentImageIndex]}
              alt="Video frame"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
            />
            {/* Overlay oscuro para legibilidad */}
            <div className="absolute inset-0 bg-black/30" />
          </>
        ) : (
          <>
            {/* Gradiente de fondo cuando no hay imagenes */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 via-dark-bg to-indigo-900/80" />
            {/* Efecto de particulas/decoracion */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          </>
        )}

        {/* Header del video */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="text-xs bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-white font-medium">
            {platformLabels[platform]}
          </span>
          <span className="text-xs bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-white font-mono">
            {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / 0:{duration.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Indicador de imagen actual */}
        {images.length > 1 && (
          <div className="absolute top-12 left-0 right-0 flex justify-center gap-1 z-10">
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentImageIndex ? 'bg-white w-4' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Boton de play/pause central */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all ${
              isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
        </div>

        {/* Titulo del video (abajo) */}
        <div className="absolute bottom-24 left-4 right-12 z-10">
          <p className="text-white font-bold text-sm drop-shadow-lg line-clamp-2">{title}</p>
        </div>

        {/* Subtitulos animados */}
        <div className="absolute bottom-14 left-3 right-3 z-10 text-center">
          {getCurrentSubtitle() && (
            <p className="text-white text-sm bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg inline-block max-w-full animate-fade-in drop-shadow-lg">
              {getCurrentSubtitle()}
            </p>
          )}
        </div>

        {/* Barra de progreso */}
        <div className="absolute bottom-8 left-4 right-4 z-10">
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Controles inferiores */}
        <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentTime(Math.max(0, currentTime - 5))}>
              <SkipBack className="w-3.5 h-3.5 text-white/70 hover:text-white" />
            </button>
            <Volume2 className="w-3.5 h-3.5 text-white/70" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentTime(Math.min(duration, currentTime + 5))}>
              <SkipForward className="w-3.5 h-3.5 text-white/70 hover:text-white" />
            </button>
            <Maximize2 className="w-3.5 h-3.5 text-white/70" />
          </div>
        </div>

        {/* Lateral TikTok-style (likes, comments, etc) */}
        <div className="absolute right-3 bottom-32 flex flex-col items-center gap-4 z-10">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-lg">❤️</span>
            </div>
            <span className="text-[10px] text-white mt-0.5">24.5K</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-lg">💬</span>
            </div>
            <span className="text-[10px] text-white mt-0.5">892</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-lg">↗️</span>
            </div>
            <span className="text-[10px] text-white mt-0.5">Share</span>
          </div>
        </div>
      </div>

      {/* Controles debajo del preview */}
      {images.length === 0 && (
        <p className="text-center text-xs text-dark-muted mt-3">
          Sube imagenes para verlas en el preview
        </p>
      )}
    </div>
  )
}
