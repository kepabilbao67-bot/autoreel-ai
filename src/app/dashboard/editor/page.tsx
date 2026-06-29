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
  ImagePlus,
  Check,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'

// Types
interface TimelineImage {
  id: string
  src: string
  name: string
}

interface TextOverlay {
  text: string
  position: 'top' | 'center' | 'bottom'
  size: 'small' | 'medium' | 'large'
}

type MusicOption = {
  id: string
  name: string
  emoji: string
}

const musicOptions: MusicOption[] = [
  { id: 'energetic', name: 'Energetico', emoji: '⚡' },
  { id: 'calm', name: 'Calmado', emoji: '🌊' },
  { id: 'epic', name: 'Epico', emoji: '🔥' },
  { id: 'fun', name: 'Divertido', emoji: '🎉' },
]

export default function EditorPage() {
  // State
  const [uploadedImages, setUploadedImages] = useState<TimelineImage[]>([])
  const [timeline, setTimeline] = useState<TimelineImage[]>([])
  const [textOverlay, setTextOverlay] = useState<TextOverlay>({
    text: '',
    position: 'bottom',
    size: 'medium',
  })
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [secondsPerPhoto, setSecondsPerPhoto] = useState(4)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null)
  const [activeTab, setActiveTab] = useState<'photos' | 'text' | 'music'>('photos')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const newImage: TimelineImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          src: ev.target?.result as string,
          name: file.name,
        }
        setUploadedImages((prev) => [...prev, newImage])
        setTimeline((prev) => [...prev, newImage])
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const newImage: TimelineImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          src: ev.target?.result as string,
          name: file.name,
        }
        setUploadedImages((prev) => [...prev, newImage])
        setTimeline((prev) => [...prev, newImage])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  // Add image to timeline
  const addToTimeline = (image: TimelineImage) => {
    setTimeline((prev) => [...prev, { ...image, id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}` }])
  }

  // Remove from timeline
  const removeFromTimeline = (id: string) => {
    setTimeline((prev) => prev.filter((img) => img.id !== id))
    if (currentIndex >= timeline.length - 1) {
      setCurrentIndex(Math.max(0, timeline.length - 2))
    }
  }

  // Playback
  useEffect(() => {
    if (isPlaying && timeline.length > 0) {
      playIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= timeline.length - 1) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, secondsPerPhoto * 1000)
    }

    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current)
    }
  }, [isPlaying, timeline.length, secondsPerPhoto])

  const togglePlay = () => {
    if (timeline.length === 0) return
    if (!isPlaying && currentIndex >= timeline.length - 1) {
      setCurrentIndex(0)
    }
    setIsPlaying(!isPlaying)
  }

  // Draw frame on canvas
  const drawFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      width: number,
      height: number,
      opacity: number = 1
    ) => {
      ctx.globalAlpha = opacity
      // Fill black background
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      // Draw image cover-fit
      const imgRatio = img.width / img.height
      const canvasRatio = width / height
      let drawW: number, drawH: number, drawX: number, drawY: number

      if (imgRatio > canvasRatio) {
        drawH = height
        drawW = height * imgRatio
        drawX = (width - drawW) / 2
        drawY = 0
      } else {
        drawW = width
        drawH = width / imgRatio
        drawX = 0
        drawY = (height - drawH) / 2
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH)

      // Draw text overlay
      if (textOverlay.text) {
        ctx.globalAlpha = 1
        const fontSize =
          textOverlay.size === 'small' ? 48 : textOverlay.size === 'medium' ? 72 : 96
        ctx.font = `bold ${fontSize}px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillStyle = 'white'
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 4

        let textY: number
        if (textOverlay.position === 'top') textY = height * 0.15
        else if (textOverlay.position === 'center') textY = height * 0.5
        else textY = height * 0.85

        ctx.strokeText(textOverlay.text, width / 2, textY)
        ctx.fillText(textOverlay.text, width / 2, textY)
      }

      ctx.globalAlpha = 1
    },
    [textOverlay]
  )

  // Export video
  const exportVideo = async () => {
    if (timeline.length === 0) return

    setIsExporting(true)
    setExportProgress(0)
    setExportedBlob(null)

    const width = 1080
    const height = 1920
    const fps = 30
    const framesPerPhoto = secondsPerPhoto * fps
    const transitionFrames = Math.min(15, Math.floor(framesPerPhoto / 4)) // fade frames

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!

    const stream = canvas.captureStream(fps)
    
    // Detectar codec soportado
    let mimeType = 'video/webm'
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      mimeType = 'video/webm;codecs=vp9'
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
      mimeType = 'video/webm;codecs=vp8'
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      mimeType = 'video/webm'
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4'
    }

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 5000000,
    })

    const chunks: Blob[] = []
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }

    const exportPromise = new Promise<Blob>((resolve) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        resolve(blob)
      }
    })

    mediaRecorder.start()

    // Load all images
    const loadedImages: HTMLImageElement[] = await Promise.all(
      timeline.map(
        (item) =>
          new Promise<HTMLImageElement>((resolve) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.src = item.src
          })
      )
    )

    const totalFrames = framesPerPhoto * timeline.length
    let frameCount = 0

    // Render frames
    for (let i = 0; i < loadedImages.length; i++) {
      for (let f = 0; f < framesPerPhoto; f++) {
        // Transition logic
        if (f < transitionFrames && i > 0) {
          // Fade in from previous
          const progress = f / transitionFrames
          drawFrame(ctx, loadedImages[i - 1], width, height, 1 - progress)
          drawFrame(ctx, loadedImages[i], width, height, progress)
        } else {
          drawFrame(ctx, loadedImages[i], width, height, 1)
        }

        frameCount++
        setExportProgress(Math.round((frameCount / totalFrames) * 100))

        // Wait for next frame
        await new Promise((resolve) => setTimeout(resolve, 1000 / fps))
      }
    }

    mediaRecorder.stop()
    const blob = await exportPromise
    setExportedBlob(blob)
    setIsExporting(false)
    setExportProgress(100)

    // Descargar automaticamente
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `video-autoreel-${Date.now()}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Download exported video
  const downloadVideo = () => {
    if (!exportedBlob) return
    const url = URL.createObjectURL(exportedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `video-autoreel-${Date.now()}.webm`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalDuration = timeline.length * secondsPerPhoto

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-64px)] gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h1 className="text-xl font-bold text-white">Editor de Video</h1>
        <div className="flex items-center gap-3">
          {exportedBlob && (
            <Button variant="secondary" icon={<Download className="w-4 h-4" />} onClick={downloadVideo}>
              Descargar
            </Button>
          )}
          <Button
            icon={<Download className="w-4 h-4" />}
            onClick={exportVideo}
            loading={isExporting}
            disabled={timeline.length === 0 || isExporting}
          >
            Exportar Video
          </Button>
        </div>
      </div>

      {/* Export progress */}
      {isExporting && (
        <div className="flex-shrink-0 bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-muted">Exportando video...</span>
            <span className="text-sm text-primary-400">{exportProgress}%</span>
          </div>
          <Progress value={exportProgress} max={100} />
        </div>
      )}

      {/* Main area: left panel + preview */}
      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        {/* Left Panel - Tools */}
        <div className="w-full lg:w-72 flex-shrink-0 bg-dark-card border border-dark-border rounded-xl overflow-hidden flex flex-col">
          {/* Tab buttons */}
          <div className="flex border-b border-dark-border">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium transition-colors ${
                activeTab === 'photos'
                  ? 'text-primary-400 border-b-2 border-primary-500'
                  : 'text-dark-muted hover:text-white'
              }`}
            >
              <ImagePlus className="w-4 h-4" />
              Fotos
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium transition-colors ${
                activeTab === 'text'
                  ? 'text-primary-400 border-b-2 border-primary-500'
                  : 'text-dark-muted hover:text-white'
              }`}
            >
              <Type className="w-4 h-4" />
              Texto
            </button>
            <button
              onClick={() => setActiveTab('music')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium transition-colors ${
                activeTab === 'music'
                  ? 'text-primary-400 border-b-2 border-primary-500'
                  : 'text-dark-muted hover:text-white'
              }`}
            >
              <Music className="w-4 h-4" />
              Musica
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Photos tab */}
            {activeTab === 'photos' && (
              <div className="space-y-4">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-dark-border rounded-xl p-6 text-center hover:border-primary-500/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-dark-muted mx-auto mb-2" />
                  <p className="text-sm text-dark-muted">Arrastra fotos aqui</p>
                  <p className="text-xs text-dark-muted mt-1">o haz clic para seleccionar</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />

                {uploadedImages.length > 0 && (
                  <div>
                    <p className="text-xs text-dark-muted mb-2">
                      Fotos subidas ({uploadedImages.length}) - clic para agregar
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {uploadedImages.map((img) => (
                        <button
                          key={img.id}
                          onClick={() => addToTimeline(img)}
                          className="aspect-square rounded-lg overflow-hidden border border-dark-border hover:border-primary-500 transition-colors relative group"
                        >
                          <img
                            src={img.src}
                            alt={img.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/20 transition-colors flex items-center justify-center">
                            <ImagePlus className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Text tab */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-dark-muted block mb-1.5">Texto del video</label>
                  <input
                    type="text"
                    value={textOverlay.text}
                    onChange={(e) =>
                      setTextOverlay((prev) => ({ ...prev, text: e.target.value }))
                    }
                    placeholder="Escribe tu texto aqui..."
                    className="w-full px-3 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-dark-muted block mb-1.5">Posicion</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['top', 'center', 'bottom'] as const).map((pos) => (
                      <button
                        key={pos}
                        onClick={() =>
                          setTextOverlay((prev) => ({ ...prev, position: pos }))
                        }
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          textOverlay.position === pos
                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                            : 'bg-dark-bg border border-dark-border text-dark-muted hover:text-white'
                        }`}
                      >
                        {pos === 'top' ? 'Arriba' : pos === 'center' ? 'Centro' : 'Abajo'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-dark-muted block mb-1.5">Tamano</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['small', 'medium', 'large'] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() =>
                          setTextOverlay((prev) => ({ ...prev, size: sz }))
                        }
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          textOverlay.size === sz
                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                            : 'bg-dark-bg border border-dark-border text-dark-muted hover:text-white'
                        }`}
                      >
                        {sz === 'small'
                          ? 'Pequeno'
                          : sz === 'medium'
                          ? 'Mediano'
                          : 'Grande'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Music tab */}
            {activeTab === 'music' && (
              <div className="space-y-2">
                <p className="text-xs text-dark-muted mb-3">
                  Selecciona el estilo de musica
                </p>
                {musicOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() =>
                      setSelectedMusic(selectedMusic === option.id ? null : option.id)
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      selectedMusic === option.id
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'bg-dark-bg border border-dark-border text-dark-muted hover:text-white hover:border-dark-border'
                    }`}
                  >
                    <span className="text-lg">{option.emoji}</span>
                    <span>{option.name}</span>
                    {selectedMusic === option.id && (
                      <Check className="w-4 h-4 ml-auto text-primary-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center - Preview */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="relative w-full max-w-[280px] lg:max-w-[320px] aspect-[9/16] bg-dark-card border border-dark-border rounded-2xl overflow-hidden flex items-center justify-center">
            {timeline.length > 0 && timeline[currentIndex] ? (
              <>
                <img
                  src={timeline[currentIndex].src}
                  alt="Preview"
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                {/* Text overlay preview */}
                {textOverlay.text && (
                  <div
                    className={`absolute left-0 right-0 flex justify-center px-4 ${
                      textOverlay.position === 'top'
                        ? 'top-[12%]'
                        : textOverlay.position === 'center'
                        ? 'top-1/2 -translate-y-1/2'
                        : 'bottom-[12%]'
                    }`}
                  >
                    <span
                      className={`font-bold text-white text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
                        textOverlay.size === 'small'
                          ? 'text-sm'
                          : textOverlay.size === 'medium'
                          ? 'text-xl'
                          : 'text-3xl'
                      }`}
                    >
                      {textOverlay.text}
                    </span>
                  </div>
                )}
                {/* Music indicator */}
                {selectedMusic && (
                  <div className="absolute top-3 right-3 bg-black/50 rounded-full px-2 py-1 flex items-center gap-1">
                    <Music className="w-3 h-3 text-primary-400" />
                    <span className="text-[10px] text-white">
                      {musicOptions.find((m) => m.id === selectedMusic)?.name}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-6">
                <ImagePlus className="w-12 h-12 text-dark-muted mx-auto mb-3" />
                <p className="text-sm text-dark-muted">Sube fotos para empezar</p>
              </div>
            )}

            {/* Play button overlay */}
            {timeline.length > 0 && (
              <button
                onClick={togglePlay}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary-500/90 hover:bg-primary-500 flex items-center justify-center transition-colors shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Timeline - Bottom */}
      <div className="flex-shrink-0 bg-dark-card border border-dark-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <span className="text-xs text-dark-muted">Timeline</span>
            <span className="text-xs text-primary-400">
              {timeline.length} fotos &middot; {totalDuration}s total
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-dark-muted">Duracion por foto:</span>
            <input
              type="range"
              min={2}
              max={10}
              value={secondsPerPhoto}
              onChange={(e) => setSecondsPerPhoto(Number(e.target.value))}
              className="w-20 h-1.5 bg-dark-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500"
            />
            <span className="text-xs text-primary-400 w-6">{secondsPerPhoto}s</span>
          </div>
        </div>

        {timeline.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {timeline.map((img, index) => (
              <div
                key={img.id}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsPlaying(false)
                }}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                  index === currentIndex
                    ? 'border-primary-500'
                    : 'border-dark-border hover:border-dark-muted'
                }`}
              >
                <img
                  src={img.src}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFromTimeline(img.id)
                  }}
                  className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors"
                >
                  <X className="w-2.5 h-2.5 text-white" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center">
                  <span className="text-[9px] text-white">{secondsPerPhoto}s</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-xs text-dark-muted">
              Sube fotos y apareceran aqui en el timeline
            </p>
          </div>
        )}
      </div>

      {/* Hidden canvas for export */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
