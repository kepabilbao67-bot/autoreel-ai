'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Upload,
  Music,
  Play,
  Pause,
  Download,
  Plus,
  Check,
  X,
  Film,
  RotateCcw,
  Loader2,
  AlertCircle,
} from 'lucide-react'

// ============================================================
// EDITOR DE VIDEO - AutoReel AI
// Crea videos REALES desde fotos + texto
// Usa un canvas VISIBLE para que captureStream funcione
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
  const exportCanvasRef = useRef<HTMLCanvasElement>(null)

  // Subir fotos
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

  // Preview playback
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

  // ========== EXPORTAR VIDEO ==========
  const exportVideo = async () => {
    if (photos.length === 0) return

    setExporting(true)
    setExportPct(0)
    setError('')
    setDownloadReady(false)
    setDownloadUrl('')
    setStatusMsg('Preparando...')

    try {
      // Usar el canvas que esta EN el DOM (visible)
      const canvas = exportCanvasRef.current
      if (!canvas) throw new Error('Canvas no encontrado')
      
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No se pudo crear contexto 2D')

      const W = canvas.width
      const H = canvas.height

      // Cargar imagenes
      setStatusMsg('Cargando imagenes...')
      const images: HTMLImageElement[] = []
      for (const photo of photos) {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const i = new Image()
          i.onload = () => resolve(i)
          i.onerror = () => reject(new Error(`No se pudo cargar: ${photo.name}`))
          i.src = photo.src
        })
        images.push(img)
      }

      // Verificar MediaRecorder
      setStatusMsg('Iniciando grabacion...')
      const stream = canvas.captureStream(10)
      
      let mime = ''
      for (const m of ['video/webm;codecs=vp8', 'video/webm', 'video/mp4']) {
        if (MediaRecorder.isTypeSupported(m)) { mime = m; break }
      }
      if (!mime) throw new Error('Tu navegador no soporta crear videos. Usa Google Chrome.')

      const recorder = new MediaRecorder(stream, { mimeType: mime })
      const chunks: Blob[] = []
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data) }

      const blobPromise = new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mime })
          resolve(blob)
        }
      })

      // EMPEZAR A GRABAR
      recorder.start()
      setStatusMsg('Grabando video...')

      // Funciones de dibujo
      const drawImage = (img: HTMLImageElement) => {
        const ir = img.naturalWidth / img.naturalHeight
        const cr = W / H
        let dw: number, dh: number, dx: number, dy: number
        if (ir > cr) { dh = H; dw = H * ir; dx = (W - dw) / 2; dy = 0 }
        else { dw = W; dh = W / ir; dx = 0; dy = (H - dh) / 2 }
        ctx.drawImage(img, dx, dy, dw, dh)
      }

      const drawText = () => {
        if (!text) return
        const sz = textSize === 1 ? 36 : textSize === 2 ? 56 : 80
        ctx.font = `bold ${sz}px Arial`
        ctx.textAlign = 'center'
        const y = textPos === 'top' ? H * 0.12 : textPos === 'center' ? H * 0.5 : H * 0.88
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 6
        ctx.strokeText(text, W / 2, y, W - 40)
        ctx.fillStyle = 'white'
        ctx.fillText(text, W / 2, y, W - 40)
      }

      // Renderizar cada foto por X segundos (usando intervalos reales de tiempo)
      const msPerPhoto = secPerPhoto * 1000
      const frameInterval = 100 // dibujar cada 100ms (10fps)

      for (let i = 0; i < images.length; i++) {
        const startTime = Date.now()
        
        // Dibujar esta foto durante secPerPhoto segundos
        while (Date.now() - startTime < msPerPhoto) {
          ctx.fillStyle = '#000'
          ctx.fillRect(0, 0, W, H)
          drawImage(images[i])
          drawText()
          
          // Actualizar progreso
          const elapsed = (i * msPerPhoto) + (Date.now() - startTime)
          const total = images.length * msPerPhoto
          setExportPct(Math.min(99, Math.round((elapsed / total) * 100)))

          // Esperar al siguiente frame
          await new Promise(r => setTimeout(r, frameInterval))
        }
      }

      // Parar grabacion
      setStatusMsg('Finalizando...')
      recorder.stop()

      // Esperar el blob
      const blob = await blobPromise

      if (blob.size < 1000) {
        throw new Error(`El video generado esta vacio (${blob.size} bytes). Intenta con Chrome.`)
      }

      // Crear URL y descargar
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setDownloadReady(true)
      setExporting(false)
      setExportPct(100)
      setStatusMsg(`Video creado (${(blob.size / 1024 / 1024).toFixed(1)} MB)`)

      // Auto descargar
      const a = document.createElement('a')
      a.href = url
      a.download = `autoreel-video-${Date.now()}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(`Error: ${msg}`)
      setExporting(false)
      setStatusMsg('')
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
              <Download className="w-4 h-4" /> Descargar Video
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
      {exporting && (
        <div className="flex-shrink-0 bg-primary-500/10 border border-primary-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
            <span className="text-sm text-primary-300 font-medium">{statusMsg} {exportPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-dark-bg rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${exportPct}%` }} />
          </div>
        </div>
      )}

      {/* STATUS MSG cuando termina */}
      {statusMsg && !exporting && downloadReady && (
        <div className="flex-shrink-0 bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-400 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{statusMsg} - El video se descargo automaticamente.</span>
        </div>
      )}

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col lg:flex-row gap-2 min-h-0 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-56 flex-shrink-0 bg-dark-card border border-dark-border rounded-xl p-3 overflow-y-auto space-y-4">
          <div>
            <p className="text-[11px] font-bold text-dark-muted uppercase mb-2">① Fotos</p>
            <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-dark-border rounded-xl p-4 text-center cursor-pointer hover:border-primary-500/50">
              <Upload className="w-5 h-5 text-primary-400 mx-auto mb-1" />
              <p className="text-[11px] text-dark-muted">Clic o arrastra fotos</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
          </div>

          <div>
            <p className="text-[11px] font-bold text-dark-muted uppercase mb-2">② Texto</p>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Texto del video..."
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-primary-500" />
            <div className="flex gap-1 mt-2">
              {(['top', 'center', 'bottom'] as const).map((p) => (
                <button key={p} onClick={() => setTextPos(p)}
                  className={`flex-1 text-[10px] py-1 rounded ${textPos === p ? 'bg-primary-500 text-white' : 'bg-dark-bg text-dark-muted'}`}>
                  {p === 'top' ? 'Arriba' : p === 'center' ? 'Centro' : 'Abajo'}
                </button>
              ))}
            </div>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3].map((s) => (
                <button key={s} onClick={() => setTextSize(s)}
                  className={`flex-1 text-[10px] py-1 rounded ${textSize === s ? 'bg-primary-500 text-white' : 'bg-dark-bg text-dark-muted'}`}>
                  {s === 1 ? 'Pequeño' : s === 2 ? 'Mediano' : 'Grande'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold text-dark-muted uppercase mb-2">③ Musica</p>
            {['⚡ Energetico', '🌊 Calmado', '🔥 Epico', '🎉 Divertido'].map((m) => (
              <button key={m} onClick={() => setMusicStyle(musicStyle === m ? '' : m)}
                className={`w-full text-left text-xs px-3 py-1.5 rounded-lg mb-1 ${
                  musicStyle === m ? 'bg-primary-500/20 text-primary-400' : 'text-dark-muted hover:text-white'
                }`}>
                {m} {musicStyle === m && <Check className="w-3 h-3 inline ml-1" />}
              </button>
            ))}
          </div>

          <div>
            <p className="text-[11px] font-bold text-dark-muted uppercase mb-1">④ Seg/foto: {secPerPhoto}s</p>
            <input type="range" min={2} max={8} value={secPerPhoto}
              onChange={(e) => setSecPerPhoto(Number(e.target.value))} className="w-full accent-primary-500" />
          </div>
        </div>

        {/* PREVIEW + CANVAS DE EXPORTACION */}
        <div className="flex-1 flex items-center justify-center min-h-[300px] relative">
          {/* Canvas REAL para exportar (visible pero pequeño durante export, oculto normalmente) */}
          <canvas
            ref={exportCanvasRef}
            width={720}
            height={1280}
            className={`absolute rounded-2xl border-2 border-primary-500 ${
              exporting ? 'w-[200px] aspect-[9/16] top-2 right-2 z-20 opacity-90' : 'w-0 h-0 opacity-0'
            }`}
          />

          {/* Preview normal */}
          <div className="relative w-full max-w-[280px] aspect-[9/16] bg-black rounded-2xl overflow-hidden border-2 border-dark-border shadow-2xl">
            {photos.length > 0 ? (
              <>
                <img src={photos[Math.min(currentIdx, photos.length - 1)]?.src} alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700" />
                {text && (
                  <div className={`absolute left-0 right-0 px-3 flex justify-center ${
                    textPos === 'top' ? 'top-[8%]' : textPos === 'center' ? 'top-1/2 -translate-y-1/2' : 'bottom-[8%]'
                  }`}>
                    <span className={`font-bold text-white text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] ${
                      textSize === 1 ? 'text-sm' : textSize === 2 ? 'text-xl' : 'text-3xl'
                    }`}>{text}</span>
                  </div>
                )}
                {musicStyle && (
                  <div className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-0.5 flex items-center gap-1">
                    <Music className="w-3 h-3 text-white" /><span className="text-[9px] text-white">{musicStyle}</span>
                  </div>
                )}
                <button onClick={() => { if (photos.length > 1) { if (!playing && currentIdx >= photos.length - 1) setCurrentIdx(0); setPlaying(!playing) } }}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/25 backdrop-blur flex items-center justify-center">
                  {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
                </button>
                <div className="absolute top-2 left-2 bg-black/50 rounded-full px-2 py-0.5">
                  <span className="text-[9px] text-white">{currentIdx + 1}/{photos.length}</span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <Upload className="w-10 h-10 text-dark-muted mb-2" />
                <p className="text-sm text-dark-muted">Sube fotos para empezar</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="flex-shrink-0 bg-dark-card border border-dark-border rounded-xl p-2.5 overflow-x-auto">
        {photos.length > 0 ? (
          <div className="flex gap-1.5 items-center">
            {photos.map((p, i) => (
              <div key={p.id} onClick={() => { setCurrentIdx(i); setPlaying(false) }}
                className={`relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  i === currentIdx ? 'border-primary-500 scale-110' : 'border-transparent hover:border-white/30'
                }`}>
                <img src={p.src} alt="" className="w-full h-full object-cover" />
                <button onClick={(e) => { e.stopPropagation(); removePhoto(p.id) }}
                  className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="w-2 h-2 text-white" />
                </button>
              </div>
            ))}
            <button onClick={() => fileRef.current?.click()}
              className="flex-shrink-0 w-12 h-12 rounded-lg border-2 border-dashed border-dark-border flex items-center justify-center hover:border-primary-500/50">
              <Plus className="w-4 h-4 text-dark-muted" />
            </button>
          </div>
        ) : (
          <p className="text-center text-[11px] text-dark-muted py-1">Sube fotos y apareceran aqui</p>
        )}
      </div>
    </div>
  )
}
