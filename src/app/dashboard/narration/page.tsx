'use client'

import { useState } from 'react'
import { Mic, Play, Pause, Volume2, Loader2, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { motion } from 'framer-motion'

interface VoiceOption {
  id: string
  name: string
  gender: 'masculino' | 'femenino'
  accent: string
  description: string
}

const voiceOptions: VoiceOption[] = [
  { id: 'voice_1', name: 'Carlos', gender: 'masculino', accent: 'Espanol (Espana)', description: 'Voz grave y profesional' },
  { id: 'voice_2', name: 'Alejandro', gender: 'masculino', accent: 'Espanol (Mexico)', description: 'Voz energetica y clara' },
  { id: 'voice_3', name: 'Diego', gender: 'masculino', accent: 'Espanol (Argentina)', description: 'Voz dinamica y expresiva' },
  { id: 'voice_4', name: 'James', gender: 'masculino', accent: 'Ingles (US)', description: 'Voz profunda y calmada' },
  { id: 'voice_5', name: 'Sofia', gender: 'femenino', accent: 'Espanol (Espana)', description: 'Voz suave y elegante' },
  { id: 'voice_6', name: 'Valentina', gender: 'femenino', accent: 'Espanol (Colombia)', description: 'Voz calida y amigable' },
  { id: 'voice_7', name: 'Luna', gender: 'femenino', accent: 'Espanol (Mexico)', description: 'Voz juvenil y vibrante' },
  { id: 'voice_8', name: 'Emma', gender: 'femenino', accent: 'Ingles (UK)', description: 'Voz clara y sofisticada' },
]

export default function NarrationPage() {
  const [script, setScript] = useState('')
  const [selectedVoice, setSelectedVoice] = useState<string>('voice_1')
  const [speed, setSpeed] = useState(1.0)
  const [pitch, setPitch] = useState(1.0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [audioReady, setAudioReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(45)

  const handleGenerate = async () => {
    if (!script.trim()) return

    setIsGenerating(true)
    setProgress(0)
    setAudioReady(false)

    try {
      const res = await fetch('/api/ai/narration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script,
          voiceId: selectedVoice,
          speed,
          pitch,
        }),
      })

      if (res.ok) {
        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 300))
          setProgress(i)
        }
        setAudioReady(true)
      }
    } catch (error) {
      console.error('Error generando narracion:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      // Simulate playback
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            clearInterval(interval)
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
          <Mic className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Narracion IA</h1>
          <p className="text-dark-muted text-sm">Genera narraciones profesionales con voces de IA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Script Input */}
        <div className="space-y-6">
          <Card hover={false}>
            <CardContent>
              <label className="block text-sm font-medium mb-2">Guion / Texto para narrar</label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Escribe o pega aqui el texto que quieres convertir en voz..."
                className="w-full h-48 input-dark resize-none"
              />
              <p className="text-xs text-dark-muted mt-2">
                {script.length} caracteres | ~{Math.ceil(script.split(' ').filter(Boolean).length / 150)} min de audio
              </p>
            </CardContent>
          </Card>

          {/* Speed & Pitch Controls */}
          <Card hover={false}>
            <CardContent>
              <h3 className="text-sm font-medium mb-4">Ajustes de Voz</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dark-muted">Velocidad</span>
                    <span className="text-primary-400">{speed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full accent-primary-500"
                  />
                  <div className="flex justify-between text-xs text-dark-muted">
                    <span>0.5x</span>
                    <span>2.0x</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dark-muted">Tono</span>
                    <span className="text-primary-400">{pitch.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    className="w-full accent-primary-500"
                  />
                  <div className="flex justify-between text-xs text-dark-muted">
                    <span>Grave</span>
                    <span>Agudo</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Voice Selection & Output */}
        <div className="space-y-6">
          <Card hover={false}>
            <CardContent>
              <h3 className="text-sm font-medium mb-3">Selecciona una Voz</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {voiceOptions.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedVoice === voice.id
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-border hover:border-dark-border/80 bg-dark-card'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        voice.gender === 'masculino' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'
                      }`}>
                        {voice.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{voice.name}</p>
                        <p className="text-xs text-dark-muted">{voice.accent}</p>
                      </div>
                    </div>
                    <p className="text-xs text-dark-muted mt-1">{voice.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !script.trim()}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generando narracion...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generar Narracion
              </>
            )}
          </button>

          {/* Progress */}
          {isGenerating && (
            <Card hover={false}>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-muted">Procesando audio...</span>
                    <span className="text-primary-400">{progress}%</span>
                  </div>
                  <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audio Player */}
          {audioReady && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card hover={false}>
                <CardContent>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-primary-400" />
                    Narracion Generada
                  </h3>
                  <div className="bg-dark-bg rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 flex items-center justify-center transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-white" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 rounded-full transition-all"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-dark-muted mt-1">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="btn-primary text-xs px-3 py-1.5">
                        Descargar MP3
                      </button>
                      <button className="px-3 py-1.5 text-xs border border-dark-border rounded-lg hover:bg-dark-card transition-colors">
                        Aplicar a Video
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
