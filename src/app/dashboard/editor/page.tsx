'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Upload, Music, Play, Pause, Download, Plus, Check, X,
  Film, RotateCcw, Loader2, AlertCircle, Image as ImageIcon,
} from 'lucide-react'

// ============================================================
// EDITOR DE VIDEO - AutoReel AI
// Genera video REAL (WebM) en el navegador
// El canvas DEBE estar en el DOM y visible para que funcione
// ============================================================

interface Photo {
  id: string
  src: string
  name: string
}

export default function EditorPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [text, setText] = useState('')
  const [textPos, setTextPos] = useState<'top' | 'center' | 'bottom'>('bottom')
  const [textSize, setTextSize] = useState(2)
  const [musicStyle, setMusicStyle] = useState('')
  const [secPerPhoto, setSecPerPhoto] = useState(3)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportPct, setExportPct] = useState(0)
  const [downloadReady, setDownloadReady] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [error, setError] = useState('')
  const [statusMsg, setStatusMsg] = useState('')

  const fileRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // ---- SUBIR FOTOS ----
  const addPhotos = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotos((prev) => [
          ...prev,
          { id: `${Date.now()}-${Math.random()}`, src: e.target?.result as string, name: file.name },
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addPhotos(e.target.files)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) addPhotos(e.dataTransfer.files)
  }, [])

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  // ---- PREVIEW PLAYBACK ----
  useEffect(() => {
    if (playing && photos.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIdx((prev) => {
          if (prev >= photos.length - 1) { setPlaying(false); return 0 }
          return prev + 1
        })
      }, secPerPhoto * 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [playing, photos.length, secPerPhoto])

  // ---- DIBUJAR EN CANVAS (para preview en tiempo real) ----
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || photos.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const photo = photos[Math.min(currentIdx, photos.length - 1)]
    if (!photo) return

    const img = new Image()
    img.onload = () => {
      const W = canvas.width
      const H = canvas.height

      // Fondo negro
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, W, H)

      // Dibujar imagen cover
      const ir = img.naturalWidth / img.naturalHeight
      const cr = W / H
      let dw: number, dh: number, dx: number, dy: number
      if (ir > cr) { dh = H; dw = H * ir; dx = (W - dw) / 2; dy = 0 }
      else { dw = W; dh = W / ir; dx = 0; dy = (H - dh) / 2 }
      ctx.drawImage(img, dx, dy, dw, dh)

      // Texto
      if (text) {
        const sz = textSize === 1 ? 28 : textSize === 2 ? 44 : 64
        ctx.font = `bold ${sz}px Arial`
        ctx.textAlign = 'center'
        const y = textPos === 'top' ? H * 0.12 : textPos === 'center' ? H * 0.5 : H * 0.88
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 4
        ctx.strokeText(text, W / 2, y, W - 20)
        ctx.fillStyle = 'white'
        ctx.fillText(text, W / 2, y, W - 20)
      }
    }
    img.src = photo.src
  }, [currentIdx, photos, text, textPos, textSize])

  // ---- EXPORTAR VIDEO ----
  const exportVideo = async () => {
    if (photos.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) { setError('Error: canvas no disponible'); return }

    setExporting(true)
    setExportPct(0)
    setError('')
    setDownloadReady(false)
    setDownloadUrl('')
    setStatusMsg('Preparando...')

    try {
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No se pudo obtener contexto del canvas')

      const W = canvas.width
      const H = canvas.height

      // Cargar todas las imagenes primero
      setStatusMsg('Cargando imagenes...')
      const images: HTMLImageElement[] = []
      for (const photo of photos) {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const i = new Image()
          i.onload = () => resolve(i)
          i.onerror = () => reject(new Error('No se pudo cargar imagen'))
          i.src = photo.src
        })
        images.push(img)
      }

      // Configurar MediaRecorder con el canvas que esta EN el DOM
      setStatusMsg('Iniciando grabacion...')
      const stream = canvas.captureStream(15) // 15 fps

      // Encontrar mime soportado
      let mime = ''
      const mimes = ['video/webm;codecs=vp8', 'video/webm', 'video/mp4']
      for (const m of mimes) {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) {
          mime = m
          break
        }
      }
      if (!mime) throw new Error('Tu navegador no soporta grabar video. Usa Google Chrome por favor.')

      const recorder = new MediaRecorder(stream, { mimeType: mime })
      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      // Promesa que se resuelve cuando para de grabar
      const recordingDone = new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mime })
          resolve(blob)
        }
      })

      // EMPEZAR A GRABAR
      recorder.start(100) // pedir datos cada 100ms
      setStatusMsg('Grabando video...')

      // Esperar un poco para que el recorder se inicialice
      await new Promise(r => setTimeout(r, 200))

      // Dibujar cada foto durante X segundos EN TIEMPO REAL
      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        const startTime = Date.now()
        const duration = secPerPhoto * 1000 // duracion en ms

        // Dibujar esta foto repetidamente durante su duracion
        while (Date.now() - startTime < duration) {
          // Limpiar
          ctx.fillStyle = '#000'
          ctx.fillRect(0, 0, W, H)

          // Dibujar imagen
          const ir = img.naturalWidth / img.naturalHeight
          const cr = W / H
          let dw: number, dh: number, dx: number, dy: number
          if (ir > cr) { dh = H; dw = H * ir; dx = (W - dw) / 2; dy = 0 }
          else { dw = W; dh = W / ir; dx = 0; dy = (H - dh) / 2 }
          ctx.drawImage(img, dx, dy, dw, dh)

          // Texto
          if (text) {
            const sz = textSize === 1 ? 28 : textSize === 2 ? 44 : 64
            ctx.font = `bold ${sz}px Arial`
            ctx.textAlign = 'center'
            const y = textPos === 'top' ? H * 0.12 : textPos === 'center' ? H * 0.5 : H * 0.88
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 4
            ctx.strokeText(text, W / 2, y, W - 20)
            ctx.fillStyle = 'white'
            ctx.fillText(text, W / 2, y, W - 20)
          }

          // Actualizar progreso
          const totalMs = photos.length * duration
          const elapsedMs = i * duration + (Date.now() - startTime)
          setExportPct(Math.min(99, Math.round((elapsedMs / totalMs) * 100)))

          // Esperar 66ms (~15fps)
          await new Promise(r => setTimeout(r, 66))
        }
      }

      // Esperar un frame mas para asegurar que el ultimo frame se graba
      await new Promise(r => setTimeout(r, 300))

      // PARAR GRABACION
      setStatusMsg('Finalizando...')
      recorder.stop()

      // Esperar a que el blob este listo
      const videoBlob = await recordingDone

      // Verificar que tiene contenido
      if (videoBlob.size < 500) {
        throw new Error(`El video esta vacio (${videoBlob.size} bytes). Intenta de nuevo o usa Chrome.`)
      }

      // Crear URL y marcar como listo
      const url = URL.createObjectURL(videoBlob)
      setDownloadUrl(url)
      setDownloadReady(true)
      setExportPct(100)
      setStatusMsg(`Video creado! (${(videoBlob.size / 1024 / 1024).toFixed(1)} MB)`)

      // Auto descargar
      const link = document.createElement('a')
      link.href = url
      link.download = `autoreel-video-${Date.now()}.webm`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(msg)
      setStatusMsg('')
    } finally {
      setExporting(false)
    }
  }

  const totalSec = photos.length * secPerPhoto

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] gap-2 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-1 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-primary-400" />
          <h1 className="text-lg font-bold">Editor de Video</h1>
          {photos.length > 0 && (
            <span className="text-[11px] text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full">
              {photos.length} fotos · {totalSec}s
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {downloadReady && (
            <a href={downloadUrl} download="autoreel-video.webm"
              className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg text-sm font-medium">
              <Download className="w-4 h-4" /> Descargar
            </a>
          )}
          {!exporting && !downloadReady && photos.length > 0 && (
            <button onClick={exportVideo}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-400 text-white rounded-lg text-sm font-medium">
              <Film className="w-4 h-4" /> Crear Video
            </button>
          )}
          {downloadReady && (
            <button onClick={() => { setDownloadReady(false); setDownloadUrl(''); setStatusMsg('') }}
              className="p-2 text-dark-muted hover:text-white"><RotateCcw className="w-4 h-4" /></button>
          )}
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex-shrink-0 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* EXPORT PROGRESS */}
      {(exporting || (downloadReady && statusMsg)) && (
        <div className={`flex-shrink-0 border rounded-xl p-3 ${downloadReady ? 'bg-green-500/10 border-green-500/30' : 'bg-primary-500/10 border-primary-500/30'}`}>
          <div className="flex items-center gap-2">
            {exporting ? <Loader2 className="w-4 h-4 text-primary-400 animate-spin" /> : <Check className="w-4 h-4 text-green-400" />}
            <span className={`text-sm font-medium ${downloadReady ? 'text-green-400' : 'text-primary-300'}`}>{statusMsg} {exporting ? `${exportPct}%` : ''}</span>
          </div>
          {exporting && (
            <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden mt-2">
              <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${exportPct}%` }} />
            </div>
          )}
        </div>
      )}

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col lg:flex-row gap-2 min-h-0 overflow-hidden">
        {/* PANEL IZQUIERDO */}
        <div className="w-full lg:w-52 flex-shrink-0 bg-dark-card border border-dark-border rounded-xl p-3 overflow-y-auto space-y-3">
          <div>
            <p className="text-[11px] font-bold text-dark-muted uppercase mb-1">① Fotos</p>
            <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-dark-border rounded-xl p-3 text-center cursor-pointer hover:border-primary-500/50">
              <Upload className="w-5 h-5 text-primary-400 mx-auto mb-1" />
              <p className="text-[10px] text-dark-muted">Clic o arrastra fotos</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
          </div>

          <div>
            <p className="text-[11px] font-bold text-dark-muted uppercase mb-1">② Texto</p>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Texto del video..."
              className="w-full px-2 py-1.5 bg-dark-bg border border-dark-border rounded-lg text-xs text-white placeholder:text-dark-muted focus:outline-none focus:border-primary-500" />
            <div className="flex gap-1 mt-1.5">
              {(['top', 'center', 'bottom'] as const).map((p) => (
                <button key={p} onClick={() => setTextPos(p)}
                  className={`flex-1 text-[9px] py-1 rounded ${textPos === p ? 'bg-primary-500 text-white' : 'bg-dark-bg text-dark-muted'}`}>
                  {p === 'top' ? 'Arriba' : p === 'center' ? 'Centro' : 'Abajo'}
                </button>
              ))}
            </div>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3].map((s) => (
                <button key={s} onClick={() => setTextSize(s)}
                  className={`flex-1 text-[9px] py-1 rounded ${textSize === s ? 'bg-primary-500 text-white' : 'bg-dark-bg text-dark-muted'}`}>
                  {s === 1 ? 'S' : s === 2 ? 'M' : 'L'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold text-dark-muted uppercase mb-1">③ Musica</p>
            {['⚡Energetico', '🌊Calmado', '🔥Epico', '🎉Divertido'].map((m) => (
              <button key={m} onClick={() => setMusicStyle(musicStyle === m ? '' : m)}
                className={`w-full text-left text-[11px] px-2 py-1.5 rounded mb-0.5 ${
                  musicStyle === m ? 'bg-primary-500/20 text-primary-400' : 'text-dark-muted hover:text-white'
                }`}>
                {m} {musicStyle === m && <Check className="w-3 h-3 inline" />}
              </button>
            ))}
          </div>

          <div>
            <p className="text-[11px] font-bold text-dark-muted uppercase mb-1">④ Seg/foto: {secPerPhoto}s</p>
            <input type="range" min={2} max={8} value={secPerPhoto}
              onChange={(e) => setSecPerPhoto(Number(e.target.value))} className="w-full accent-primary-500" />
          </div>
        </div>

        {/* PREVIEW - CANVAS REAL (visible y funcional) */}
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <div className="relative">
            {/* Este canvas ES el video. Esta en el DOM y visible = captureStream funciona */}
            <canvas
              ref={canvasRef}
              width={360}
              height={640}
              className="rounded-2xl border-2 border-dark-border shadow-2xl bg-black max-h-[60vh] w-auto"
            />

            {/* Overlay cuando no hay fotos */}
            {photos.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl">
                <ImageIcon className="w-10 h-10 text-dark-muted mb-2" />
                <p className="text-sm text-dark-muted">Sube fotos para empezar</p>
              </div>
            )}

            {/* Musica badge */}
            {musicStyle && photos.length > 0 && (
              <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-0.5 flex items-center gap-1">
                <Music className="w-3 h-3 text-white" /><span className="text-[9px] text-white">{musicStyle}</span>
              </div>
            )}

            {/* Play/Pause */}
            {photos.length > 1 && !exporting && (
              <button
                onClick={() => { if (!playing && currentIdx >= photos.length - 1) setCurrentIdx(0); setPlaying(!playing) }}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/25 backdrop-blur flex items-center justify-center hover:bg-white/40">
                {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
              </button>
            )}

            {/* Counter */}
            {photos.length > 0 && (
              <div className="absolute top-2 left-2 bg-black/60 rounded-full px-2 py-0.5">
                <span className="text-[9px] text-white">{currentIdx + 1}/{photos.length}</span>
              </div>
            )}

            {/* Exporting indicator */}
            {exporting && (
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                <div className="bg-black/80 rounded-xl px-4 py-3 text-center">
                  <Loader2 className="w-6 h-6 text-primary-400 animate-spin mx-auto mb-1" />
                  <p className="text-xs text-white">Grabando...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="flex-shrink-0 bg-dark-card border border-dark-border rounded-xl p-2 overflow-x-auto">
        {photos.length > 0 ? (
          <div className="flex gap-1.5 items-center">
            {photos.map((p, i) => (
              <div key={p.id} onClick={() => { setCurrentIdx(i); setPlaying(false) }}
                className={`relative flex-shrink-0 w-11 h-11 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  i === currentIdx ? 'border-primary-500 scale-110' : 'border-transparent hover:border-white/30'
                }`}>
                <img src={p.src} alt="" className="w-full h-full object-cover" />
                <button onClick={(e) => { e.stopPropagation(); removePhoto(p.id) }}
                  className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="w-2 h-2 text-white" />
                </button>
              </div>
            ))}
            <button onClick={() => fileRef.current?.click()}
              className="flex-shrink-0 w-11 h-11 rounded-lg border-2 border-dashed border-dark-border flex items-center justify-center hover:border-primary-500/50">
              <Plus className="w-3 h-3 text-dark-muted" />
            </button>
          </div>
        ) : (
          <p className="text-center text-[10px] text-dark-muted py-1">Sube fotos y apareceran aqui</p>
        )}
      </div>
    </div>
  )
}
