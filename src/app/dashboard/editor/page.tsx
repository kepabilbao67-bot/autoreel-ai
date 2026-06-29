'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Upload,
  Type,
  Music,
  Play,
  Pause,
  Download,
  Trash2,
  Plus,
  Check,
  X,
  Film,
  RotateCcw,
  Loader2,
} from 'lucide-react'

// ============================================================
// EDITOR DE VIDEO PROFESIONAL - AutoReel AI
// Crea videos reales (WEBM) desde fotos + texto + musica
// Todo funciona en el navegador, sin servidor
// ============================================================

interface TimelineItem {
  id: string
  src: string
  name: string
}

export default function EditorPage() {
  // Estado principal
  const [photos, setPhotos] = useState<TimelineItem[]>([])
  const [text, setText] = useState('')
  const [textPosition, setTextPosition] = useState<'top' | 'center' | 'bottom'>('bottom')
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [musicStyle, setMusicStyle] = useState('')
  const [secondsPerPhoto, setSecondsPerPhoto] = useState(4)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportDone, setExportDone] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const playTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ---- SUBIR FOTOS ----
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const item: TimelineItem = {
          id: crypto.randomUUID(),
          src: ev.target?.result as string,
          name: file.name,
        }
        setPhotos((prev) => [...prev, item])
      }
      reader.readAsDataURL(file)
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    Array.from(e.dataTransfer.files).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const item: TimelineItem = {
          id: crypto.randomUUID(),
          src: ev.target?.result as string,
          name: file.name,
        }
        setPhotos((prev) => [...prev, item])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
    setCurrentPhotoIndex((prev) => Math.max(0, Math.min(prev, photos.length - 2)))
  }

  // ---- REPRODUCIR PREVIEW ----
  useEffect(() => {
    if (isPlaying && photos.length > 1) {
      playTimerRef.current = setInterval(() => {
        setCurrentPhotoIndex((prev) => {
          if (prev >= photos.length - 1) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, secondsPerPhoto * 1000)
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current)
    }
  }, [isPlaying, photos.length, secondsPerPhoto])

  const togglePlay = () => {
    if (photos.length === 0) return
    if (!isPlaying && currentPhotoIndex >= photos.length - 1) setCurrentPhotoIndex(0)
    setIsPlaying(!isPlaying)
  }

  // ---- EXPORTAR VIDEO REAL ----
  const exportVideo = async () => {
    if (photos.length === 0) return

    setIsExporting(true)
    setExportProgress(0)
    setExportDone(false)
    setVideoUrl(null)

    try {
      const WIDTH = 1080
      const HEIGHT = 1920
      const FPS = 24
      const framesPerPhoto = secondsPerPhoto * FPS
      const totalFrames = photos.length * framesPerPhoto
      const FADE_FRAMES = Math.min(12, Math.floor(framesPerPhoto / 3))

      // Crear canvas
      const canvas = document.createElement('canvas')
      canvas.width = WIDTH
      canvas.height = HEIGHT
      const ctx = canvas.getContext('2d')!

      // Cargar todas las imagenes
      const images: HTMLImageElement[] = await Promise.all(
        photos.map(
          (photo) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image()
              img.crossOrigin = 'anonymous'
              img.onload = () => resolve(img)
              img.onerror = reject
              img.src = photo.src
            })
        )
      )

      // Iniciar grabacion
      const stream = canvas.captureStream(FPS)

      // Encontrar codec soportado
      const codecs = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4',
      ]
      let mime = 'video/webm'
      for (const codec of codecs) {
        if (MediaRecorder.isTypeSupported(codec)) {
          mime = codec
          break
        }
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: mime,
        videoBitsPerSecond: 4000000,
      })

      const chunks: Blob[] = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      const done = new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: mime }))
      })

      recorder.start(100) // grabar en intervalos de 100ms

      // Funcion para dibujar un frame
      const drawImage = (img: HTMLImageElement, alpha: number) => {
        ctx.globalAlpha = alpha
        const imgRatio = img.naturalWidth / img.naturalHeight
        const canvasRatio = WIDTH / HEIGHT
        let dw: number, dh: number, dx: number, dy: number
        if (imgRatio > canvasRatio) {
          dh = HEIGHT
          dw = HEIGHT * imgRatio
          dx = (WIDTH - dw) / 2
          dy = 0
        } else {
          dw = WIDTH
          dh = WIDTH / imgRatio
          dx = 0
          dy = (HEIGHT - dh) / 2
        }
        ctx.drawImage(img, dx, dy, dw, dh)
        ctx.globalAlpha = 1
      }

      const drawText = () => {
        if (!text) return
        const size = textSize === 'small' ? 52 : textSize === 'medium' ? 78 : 110
        ctx.font = `bold ${size}px Arial, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        let y: number
        if (textPosition === 'top') y = HEIGHT * 0.12
        else if (textPosition === 'center') y = HEIGHT * 0.5
        else y = HEIGHT * 0.88

        // Sombra
        ctx.shadowColor = 'rgba(0,0,0,0.8)'
        ctx.shadowBlur = 8
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2

        // Borde negro
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 6
        ctx.strokeText(text, WIDTH / 2, y, WIDTH - 80)

        // Texto blanco
        ctx.fillStyle = 'white'
        ctx.fillText(text, WIDTH / 2, y, WIDTH - 80)

        // Reset sombra
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
      }

      // Renderizar frame por frame
      let frame = 0
      for (let i = 0; i < images.length; i++) {
        for (let f = 0; f < framesPerPhoto; f++) {
          // Fondo negro
          ctx.fillStyle = '#000000'
          ctx.fillRect(0, 0, WIDTH, HEIGHT)

          if (f < FADE_FRAMES && i > 0) {
            // Transicion: fade del anterior al actual
            const progress = f / FADE_FRAMES
            drawImage(images[i - 1], 1 - progress)
            drawImage(images[i], progress)
          } else {
            drawImage(images[i], 1)
          }

          // Texto encima
          drawText()

          frame++
          const prog = Math.round((frame / totalFrames) * 100)
          setExportProgress(prog)

          // Esperar al siguiente frame (dar tiempo al MediaRecorder)
          await new Promise((r) => setTimeout(r, 1000 / FPS))
        }
      }

      // Parar grabacion
      recorder.stop()
      const blob = await done

      // Crear URL de descarga
      const url = URL.createObjectURL(blob)
      setVideoUrl(url)
      setExportDone(true)
      setIsExporting(false)
      setExportProgress(100)
    } catch (err) {
      console.error('Error exportando:', err)
      setIsExporting(false)
      alert('Error al exportar. Intenta con menos fotos o un navegador diferente (Chrome recomendado).')
    }
  }

  const downloadVideo = () => {
    if (!videoUrl) return
    const a = document.createElement('a')
    a.href = videoUrl
    a.download = `autoreel-video-${Date.now()}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const resetEditor = () => {
    setPhotos([])
    setText('')
    setMusicStyle('')
    setCurrentPhotoIndex(0)
    setIsPlaying(false)
    setExportDone(false)
    setVideoUrl(null)
    setExportProgress(0)
  }

  const totalDuration = photos.length * secondsPerPhoto

  // ---- RENDER ----
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col gap-3 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-shrink-0 px-1">
        <div className="flex items-center gap-3">
          <Film className="w-5 h-5 text-primary-400" />
          <h1 className="text-lg font-bold">Editor de Video</h1>
          {photos.length > 0 && (
            <span className="text-xs text-dark-muted bg-dark-card px-2 py-0.5 rounded-full">
              {photos.length} fotos · {totalDuration}s
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {exportDone && (
            <button
              onClick={downloadVideo}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Descargar Video
            </button>
          )}
          {!isExporting && photos.length > 0 && !exportDone && (
            <button
              onClick={exportVideo}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-400 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Film className="w-4 h-4" />
              Crear Video
            </button>
          )}
          {exportDone && (
            <button
              onClick={resetEditor}
              className="flex items-center gap-2 px-3 py-2 border border-dark-border text-dark-muted hover:text-white rounded-lg text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Nuevo
            </button>
          )}
        </div>
      </div>

      {/* EXPORT PROGRESS */}
      {isExporting && (
        <div className="flex-shrink-0 bg-primary-500/10 border border-primary-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
            <span className="text-sm text-primary-400 font-medium">
              Creando video... {exportProgress}%
            </span>
          </div>
          <div className="w-full h-2 bg-dark-card rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
          <p className="text-xs text-dark-muted mt-2">
            No cierres esta pagina. Puede tardar unos segundos.
          </p>
        </div>
      )}

      {/* MAIN: PANEL IZQUIERDO + PREVIEW */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-0 overflow-hidden">
        {/* PANEL IZQUIERDO */}
        <div className="w-full lg:w-64 flex-shrink-0 bg-dark-card border border-dark-border rounded-xl overflow-y-auto p-4 space-y-5">
          {/* 1. SUBIR FOTOS */}
          <div>
            <h3 className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-2">
              1. Sube fotos
            </h3>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-dark-border rounded-xl p-5 text-center cursor-pointer hover:border-primary-500/50 transition-colors"
            >
              <Upload className="w-6 h-6 text-primary-400 mx-auto mb-1" />
              <p className="text-xs text-dark-muted">Clic o arrastra imagenes</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </div>

          {/* 2. TEXTO */}
          <div>
            <h3 className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-2">
              2. Texto del video
            </h3>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe aqui..."
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
            />
            <div className="flex gap-1 mt-2">
              {(['top', 'center', 'bottom'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setTextPosition(pos)}
                  className={`flex-1 text-[10px] py-1.5 rounded ${
                    textPosition === pos
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-bg text-dark-muted border border-dark-border'
                  }`}
                >
                  {pos === 'top' ? 'Arriba' : pos === 'center' ? 'Centro' : 'Abajo'}
                </button>
              ))}
            </div>
            <div className="flex gap-1 mt-1.5">
              {(['small', 'medium', 'large'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setTextSize(sz)}
                  className={`flex-1 text-[10px] py-1.5 rounded ${
                    textSize === sz
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-bg text-dark-muted border border-dark-border'
                  }`}
                >
                  {sz === 'small' ? 'S' : sz === 'medium' ? 'M' : 'L'}
                </button>
              ))}
            </div>
          </div>

          {/* 3. MUSICA */}
          <div>
            <h3 className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-2">
              3. Musica
            </h3>
            <div className="space-y-1.5">
              {[
                { id: 'energetico', emoji: '⚡', name: 'Energetico' },
                { id: 'calmado', emoji: '🌊', name: 'Calmado' },
                { id: 'epico', emoji: '🔥', name: 'Epico' },
                { id: 'divertido', emoji: '🎉', name: 'Divertido' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMusicStyle(musicStyle === m.id ? '' : m.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                    musicStyle === m.id
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40'
                      : 'bg-dark-bg border border-dark-border text-dark-muted hover:text-white'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.name}</span>
                  {musicStyle === m.id && <Check className="w-3 h-3 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* 4. DURACION */}
          <div>
            <h3 className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-2">
              4. Duracion por foto: {secondsPerPhoto}s
            </h3>
            <input
              type="range"
              min={2}
              max={10}
              value={secondsPerPhoto}
              onChange={(e) => setSecondsPerPhoto(Number(e.target.value))}
              className="w-full h-1.5 bg-dark-border rounded-full appearance-none cursor-pointer accent-primary-500"
            />
            <div className="flex justify-between text-[10px] text-dark-muted mt-1">
              <span>2s</span>
              <span>10s</span>
            </div>
          </div>
        </div>

        {/* PREVIEW CENTRAL */}
        <div className="flex-1 flex items-center justify-center p-2 min-h-0">
          <div className="relative w-full max-w-[300px] aspect-[9/16] bg-black rounded-2xl overflow-hidden border-2 border-dark-border shadow-xl">
            {photos.length > 0 ? (
              <>
                {/* Foto actual */}
                <img
                  src={photos[currentPhotoIndex]?.src}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
                />

                {/* Texto superpuesto */}
                {text && (
                  <div
                    className={`absolute left-0 right-0 px-4 flex justify-center ${
                      textPosition === 'top'
                        ? 'top-[10%]'
                        : textPosition === 'center'
                        ? 'top-1/2 -translate-y-1/2'
                        : 'bottom-[10%]'
                    }`}
                  >
                    <span
                      className={`font-bold text-white text-center [text-shadow:_2px_2px_8px_rgba(0,0,0,0.9)] ${
                        textSize === 'small'
                          ? 'text-base'
                          : textSize === 'medium'
                          ? 'text-2xl'
                          : 'text-4xl'
                      }`}
                    >
                      {text}
                    </span>
                  </div>
                )}

                {/* Musica indicator */}
                {musicStyle && (
                  <div className="absolute top-3 right-3 bg-black/60 rounded-full px-2 py-1 flex items-center gap-1">
                    <Music className="w-3 h-3 text-white" />
                    <span className="text-[10px] text-white">{musicStyle}</span>
                  </div>
                )}

                {/* Boton play/pause */}
                <button
                  onClick={togglePlay}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>

                {/* Numero de foto */}
                <div className="absolute top-3 left-3 bg-black/60 rounded-full px-2 py-1">
                  <span className="text-[10px] text-white">
                    {currentPhotoIndex + 1}/{photos.length}
                  </span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mb-3">
                  <Upload className="w-7 h-7 text-primary-400" />
                </div>
                <p className="text-sm text-dark-muted font-medium">Sube fotos para empezar</p>
                <p className="text-xs text-dark-muted mt-1">Se veran aqui como un video</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TIMELINE (abajo) */}
      <div className="flex-shrink-0 bg-dark-card border border-dark-border rounded-xl p-3">
        {photos.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                onClick={() => { setCurrentPhotoIndex(i); setIsPlaying(false) }}
                className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  i === currentPhotoIndex
                    ? 'border-primary-500 scale-105'
                    : 'border-transparent hover:border-dark-muted'
                }`}
              >
                <img src={photo.src} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={(e) => { e.stopPropagation(); removePhoto(photo.id) }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  <X className="w-2.5 h-2.5 text-white" />
                </button>
              </div>
            ))}
            {/* Boton agregar mas */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 w-14 h-14 rounded-lg border-2 border-dashed border-dark-border hover:border-primary-500/50 flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5 text-dark-muted" />
            </button>
          </div>
        ) : (
          <p className="text-center text-xs text-dark-muted py-2">
            Las fotos apareceran aqui en orden. Sube imagenes para empezar.
          </p>
        )}
      </div>
    </div>
  )
}
