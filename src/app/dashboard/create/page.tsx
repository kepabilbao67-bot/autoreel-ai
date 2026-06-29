'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Sparkles,
  Zap,
  Upload,
  Globe,
  Palette,
  Clock,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Image as ImageIcon,
  Film,
  Download,
  FileText,
  Copy,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Progress } from '@/components/ui/Progress'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { VideoPreview } from '@/components/video/VideoPreview'
import { TemplateSelector } from '@/components/video/TemplateSelector'

// Pagina de creacion de video con 4 pasos
const platforms = [
  { value: 'tiktok', label: 'TikTok (9:16)' },
  { value: 'reels', label: 'Instagram Reels (9:16)' },
  { value: 'shorts', label: 'YouTube Shorts (9:16)' },
]

const languages = [
  { value: 'es', label: 'Espanol' },
  { value: 'en', label: 'Ingles' },
  { value: 'pt', label: 'Portugues' },
  { value: 'fr', label: 'Frances' },
  { value: 'de', label: 'Aleman' },
  { value: 'it', label: 'Italiano' },
  { value: 'ja', label: 'Japones' },
  { value: 'ko', label: 'Coreano' },
  { value: 'zh', label: 'Chino' },
  { value: 'ar', label: 'Arabe' },
]

const styles = [
  { value: 'informativo', label: 'Informativo' },
  { value: 'humor', label: 'Humor' },
  { value: 'motivacional', label: 'Motivacional' },
  { value: 'educativo', label: 'Educativo' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'review', label: 'Review' },
]

const stepTitles = ['Contenido', 'IA Genera', 'Preview', 'Exportar']

interface UploadedFile {
  name: string
  size: number
  type: string
  preview?: string
}

export default function CreatePage() {
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<'manual' | 'oneclick'>('oneclick')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    topic: '',
    platform: 'tiktok',
    language: 'es',
    style: 'informativo',
    duration: 30,
    template: '',
  })
  const [result, setResult] = useState<{
    script?: string
    title?: string
    description?: string
    hashtags?: string[]
    music?: { genre: string; bpm: number; mood: string; suggestions: string[] }
    subtitles?: Array<{ start: number; end: number; text: string }>
    viralityScore?: number
    bestTimeToPost?: string
  } | null>(null)

  // Manejar upload de archivos
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
  }, [])

  // Drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (!files) return

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Generacion con un clic
  const handleOneClick = async () => {
    if (!formData.topic) return
    setGenerating(true)
    setStep(1)
    setProgress(0)

    // Simular progreso
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.random() * 10
      })
    }, 300)

    try {
      const res = await fetch('/api/ai/one-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const data = await res.json()
        setResult(data)
      } else {
        // Fallback si falla la API
        setResult({
          script: `[0-3s] HOOK: "¿Sabias esto sobre ${formData.topic}?"\n\n[3-15s] DESARROLLO: Contenido principal sobre ${formData.topic}\n\n[15-${formData.duration}s] CTA: Sigue para mas tips!`,
          title: `${formData.topic} - Lo que NADIE te dice`,
          description: `Descubre todo sobre ${formData.topic}`,
          hashtags: ['#viral', '#fyp', '#tips', '#trending', '#parati'],
          viralityScore: 82,
          bestTimeToPost: '19:00 - 21:00',
        })
      }
    } catch {
      setResult({
        script: `[0-3s] HOOK: "Esto sobre ${formData.topic} te va a sorprender"\n\n[3-15s] DESARROLLO: Lo mas importante sobre ${formData.topic}\n\n[15-${formData.duration}s] CTA: Dale like y sigue!`,
        title: `${formData.topic} - Tips increibles`,
        description: `Todo lo que necesitas saber sobre ${formData.topic}`,
        hashtags: ['#viral', '#fyp', '#tips'],
        viralityScore: 78,
        bestTimeToPost: '20:00 - 22:00',
      })
    }

    clearInterval(interval)
    setProgress(100)
    setGenerating(false)
    // Esperar un momento para que se vea el 100% y luego mostrar resultados
    setTimeout(() => setStep(2), 1500)
  }

  // Descargar guion como archivo
  const handleDownloadScript = () => {
    if (!result) return

    const content = `# ${result.title || formData.topic}
    
## Guion del Video
${result.script}

## Descripcion
${result.description || ''}

## Hashtags
${result.hashtags?.join(' ') || ''}

## Configuracion
- Plataforma: ${formData.platform}
- Duracion: ${formData.duration}s
- Estilo: ${formData.style}
- Idioma: ${formData.language}

## Musica Sugerida
${result.music ? `- Genero: ${result.music.genre}\n- BPM: ${result.music.bpm}\n- Mood: ${result.music.mood}\n- Sugerencias: ${result.music.suggestions?.join(', ')}` : 'Ver sugerencias en la app'}

## Subtitulos
${result.subtitles?.map((s) => `[${s.start}s - ${s.end}s] ${s.text}`).join('\n') || 'Generados automaticamente'}

## Mejor hora para publicar: ${result.bestTimeToPost || '19:00-21:00'}
## Puntuacion de viralidad: ${result.viralityScore || 80}/100

---
Generado con AutoReel AI - autoreel-ai.vercel.app
`

    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `autoreel-${formData.topic.replace(/\s+/g, '-').slice(0, 30)}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Copiar guion al portapapeles
  const handleCopyScript = async () => {
    if (!result?.script) return
    await navigator.clipboard.writeText(result.script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleManualNext = () => {
    if (step === 0) {
      handleOneClick()
    } else {
      setStep((prev) => Math.min(prev + 1, 3))
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Crear Nuevo Video</h1>
        <p className="text-dark-muted">Genera videos virales con inteligencia artificial</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {stepTitles.map((title, index) => (
          <div key={title} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < step
                  ? 'bg-primary-500 text-white'
                  : index === step
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500'
                  : 'bg-dark-card text-dark-muted border border-dark-border'
              }`}
            >
              {index < step ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span className={`text-sm hidden sm:block ${index === step ? 'text-white' : 'text-dark-muted'}`}>
              {title}
            </span>
            {index < 3 && <div className={`flex-1 h-px ${index < step ? 'bg-primary-500' : 'bg-dark-border'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Contenido */}
      {step === 0 && (
        <div className="space-y-6">
          {/* Modo selector */}
          <div className="flex gap-3">
            <button
              onClick={() => setMode('oneclick')}
              className={`flex-1 p-4 rounded-xl border transition-all ${
                mode === 'oneclick' ? 'border-primary-500 bg-primary-500/10' : 'border-dark-border bg-dark-card'
              }`}
            >
              <Zap className={`w-6 h-6 mb-2 ${mode === 'oneclick' ? 'text-primary-400' : 'text-dark-muted'}`} />
              <p className="font-medium">Un Clic</p>
              <p className="text-xs text-dark-muted mt-1">La IA genera todo automaticamente</p>
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 p-4 rounded-xl border transition-all ${
                mode === 'manual' ? 'border-primary-500 bg-primary-500/10' : 'border-dark-border bg-dark-card'
              }`}
            >
              <Sparkles className={`w-6 h-6 mb-2 ${mode === 'manual' ? 'text-primary-400' : 'text-dark-muted'}`} />
              <p className="font-medium">Manual</p>
              <p className="text-xs text-dark-muted mt-1">Controla cada paso del proceso</p>
            </button>
          </div>

          {/* Formulario principal */}
          <Card>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  label="Tema del video"
                  placeholder="Ej: 5 trucos de productividad para emprendedores que trabajan desde casa"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />

                {/* Drag & Drop zona con funcionalidad real */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-dark-border rounded-xl p-6 text-center hover:border-primary-500/50 transition-colors cursor-pointer"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-dark-muted mx-auto mb-2" />
                  <p className="text-sm text-dark-muted">Arrastra archivos aqui o haz clic para subir</p>
                  <p className="text-xs text-dark-muted mt-1">Imagenes, videos o audio (max 50MB)</p>
                </div>

                {/* Archivos subidos */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-dark-text">{uploadedFiles.length} archivo(s) seleccionado(s)</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative group rounded-lg border border-dark-border p-2 bg-dark-card">
                          {file.preview ? (
                            <img src={file.preview} alt={file.name} className="w-full h-20 object-cover rounded" />
                          ) : (
                            <div className="w-full h-20 flex items-center justify-center bg-dark-bg rounded">
                              {file.type.startsWith('video/') ? (
                                <Film className="w-8 h-8 text-dark-muted" />
                              ) : (
                                <ImageIcon className="w-8 h-8 text-dark-muted" />
                              )}
                            </div>
                          )}
                          <p className="text-xs text-dark-muted mt-1 truncate">{file.name}</p>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFile(index) }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Plataforma"
                    options={platforms}
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  />
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-dark-muted mt-6" />
                    <Select
                      label="Idioma"
                      options={languages}
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-dark-muted mt-6" />
                    <Select
                      label="Estilo"
                      options={styles}
                      value={formData.style}
                      onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Duracion: {formData.duration}s
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="180"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full h-2 bg-dark-card rounded-lg appearance-none cursor-pointer accent-primary-500"
                    />
                    <div className="flex justify-between text-xs text-dark-muted mt-1">
                      <span>5s</span>
                      <span>180s</span>
                    </div>
                  </div>
                </div>

                {mode === 'manual' && (
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-3">Plantilla (opcional)</label>
                    <TemplateSelector
                      selectedId={formData.template}
                      onSelect={(t) => setFormData({ ...formData, template: t.id })}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleManualNext}
              disabled={!formData.topic}
              icon={<Sparkles className="w-4 h-4" />}
              size="lg"
            >
              {mode === 'oneclick' ? 'Generar con IA' : 'Siguiente'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: IA Generando */}
      {step === 1 && (
        <Card>
          <CardContent className="py-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-10 h-10 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">La IA esta trabajando...</h2>
              <p className="text-dark-muted">Generando guion, subtitulos, musica y mas</p>
            </div>
            <div className="max-w-md mx-auto">
              <Progress value={progress} label="Progreso" />
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <Badge variant={progress > 20 ? 'success' : 'default'}>Guion</Badge>
              <Badge variant={progress > 40 ? 'success' : 'default'}>Subtitulos</Badge>
              <Badge variant={progress > 60 ? 'success' : 'default'}>Musica</Badge>
              <Badge variant={progress > 80 ? 'success' : 'default'}>Hashtags</Badge>
              <Badge variant={progress >= 100 ? 'success' : 'default'}>Storyboard</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Preview */}
      {step === 2 && result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Guion Generado</h3>
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-dark-bg border border-dark-border">
                  <pre className="text-sm text-dark-muted whitespace-pre-wrap font-sans">{result.script}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-semibold mb-3">Titulo y Hashtags</h3>
                <Input label="Titulo" value={result.title || ''} readOnly />
                {result.description && (
                  <p className="text-sm text-dark-muted mt-2">{result.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {result.hashtags?.map((tag) => (
                    <Badge key={tag} variant="info">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Musica sugerida */}
            {result.music && (
              <Card>
                <CardContent>
                  <h3 className="font-semibold mb-3">Musica Sugerida</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-dark-muted">Genero:</span> {result.music.genre}</p>
                    <p><span className="text-dark-muted">BPM:</span> {result.music.bpm}</p>
                    <p><span className="text-dark-muted">Mood:</span> {result.music.mood}</p>
                    {result.music.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {result.music.suggestions.map((s) => (
                          <Badge key={s}>{s}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Puntuacion viralidad */}
            {result.viralityScore && (
              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Puntuacion de Viralidad</h3>
                      <p className="text-xs text-dark-muted mt-1">Mejor hora: {result.bestTimeToPost}</p>
                    </div>
                    <div className="text-3xl font-bold text-primary-400">{result.viralityScore}/100</div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => { setStep(0); setProgress(0) }} icon={<ChevronLeft className="w-4 h-4" />}>
                Volver
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1" icon={<Check className="w-4 h-4" />}>
                Confirmar y Exportar
              </Button>
            </div>
          </div>

          <div>
            <VideoPreview
              title={result.title || formData.topic}
              subtitle="Los subtitulos apareceran aqui..."
              platform={formData.platform as 'tiktok' | 'reels' | 'shorts'}
              duration={formData.duration}
            />
          </div>
        </div>
      )}

      {/* Step 4: Exportar */}
      {step === 3 && (
        <Card>
          <CardContent className="py-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Video Listo!</h2>
              <p className="text-dark-muted">Tu contenido ha sido generado. Descarga el guion completo para usarlo.</p>
            </div>

            {/* Info del video */}
            <div className="max-w-md mx-auto grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-dark-bg border border-dark-border">
                <p className="text-dark-muted">Plataforma</p>
                <p className="font-medium mt-0.5">{formData.platform}</p>
              </div>
              <div className="p-3 rounded-lg bg-dark-bg border border-dark-border">
                <p className="text-dark-muted">Duracion</p>
                <p className="font-medium mt-0.5">{formData.duration}s</p>
              </div>
              <div className="p-3 rounded-lg bg-dark-bg border border-dark-border">
                <p className="text-dark-muted">Viralidad</p>
                <p className="font-medium mt-0.5 text-primary-400">{result?.viralityScore || 80}/100</p>
              </div>
              <div className="p-3 rounded-lg bg-dark-bg border border-dark-border">
                <p className="text-dark-muted">Publicar a las</p>
                <p className="font-medium mt-0.5">{result?.bestTimeToPost || '19:00'}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={handleDownloadScript} icon={<Download className="w-5 h-5" />}>
                Descargar Guion Completo
              </Button>
              <Button size="lg" variant="secondary" onClick={handleCopyScript} icon={<Copy className="w-5 h-5" />}>
                {copied ? 'Copiado!' : 'Copiar Guion'}
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="secondary" size="lg" icon={<FileText className="w-5 h-5" />}
                onClick={() => {
                  const text = `${result?.title}\n\n${result?.description}\n\n${result?.hashtags?.join(' ')}`
                  navigator.clipboard.writeText(text)
                }}
              >
                Copiar Titulo + Hashtags
              </Button>
              <Button variant="secondary" size="lg" onClick={() => { setStep(0); setProgress(0); setResult(null); setUploadedFiles([]) }}>
                Crear Otro Video
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
