'use client'

import { useState } from 'react'
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

export default function CreatePage() {
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<'manual' | 'oneclick'>('oneclick')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
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
    hashtags?: string[]
  } | null>(null)

  // Generacion con un clic
  const handleOneClick = async () => {
    if (!formData.topic) return
    setGenerating(true)
    setStep(1)

    // Simular progreso
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + Math.random() * 15
      })
    }, 500)

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
        // Mock result para demo
        setResult({
          script: `Hook: Sabes cual es el secreto de los emprendedores exitosos?\n\n${formData.topic}\n\n1. Planifica tu dia la noche anterior\n2. Enfocate en 3 tareas clave\n3. Automatiza lo repetitivo\n\nCTA: Guarda este video y sigue para mas tips!`,
          title: formData.topic,
          hashtags: ['#productividad', '#emprendedor', '#tips', '#viral', '#motivacion'],
        })
      }
    } catch {
      setResult({
        script: `Hook: Descubre como transformar tu contenido!\n\n${formData.topic}\n\nDesarrollo del tema con puntos clave...\n\nCTA: Sigue para mas contenido como este!`,
        title: formData.topic,
        hashtags: ['#viral', '#contenido', '#tips'],
      })
    }

    clearInterval(interval)
    setProgress(100)
    setGenerating(false)
    setTimeout(() => setStep(2), 500)
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

                {/* Drag & Drop zona */}
                <div className="border-2 border-dashed border-dark-border rounded-xl p-6 text-center hover:border-primary-500/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-dark-muted mx-auto mb-2" />
                  <p className="text-sm text-dark-muted">Arrastra archivos aqui o haz clic para subir</p>
                  <p className="text-xs text-dark-muted mt-1">Imagenes, videos o audio de referencia</p>
                </div>

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
            <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto animate-pulse-slow">
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
                <h3 className="font-semibold mb-3">Guion Generado</h3>
                <div className="p-4 rounded-xl bg-dark-bg border border-dark-border">
                  <pre className="text-sm text-dark-muted whitespace-pre-wrap font-sans">{result.script}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-semibold mb-3">Titulo y Hashtags</h3>
                <Input
                  label="Titulo"
                  value={result.title || ''}
                  readOnly
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {result.hashtags?.map((tag) => (
                    <Badge key={tag} variant="info">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(0)} icon={<ChevronLeft className="w-4 h-4" />}>
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
              <p className="text-dark-muted">Tu video ha sido generado exitosamente</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg">Descargar Video</Button>
              <Button variant="secondary" size="lg" onClick={() => { setStep(0); setProgress(0); setResult(null) }}>
                Crear Otro Video
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
