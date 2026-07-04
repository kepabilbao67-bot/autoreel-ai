'use client'

import { useState } from 'react'
import { Languages, Copy, Save, Loader2, Check, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { useVideoHistory } from '@/hooks/useVideoHistory'
import { motion } from 'framer-motion'

interface LanguageOption {
  code: string
  name: string
  flag: string
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'Ingles', flag: '🇺🇸' },
  { code: 'pt', name: 'Portugues', flag: '🇧🇷' },
  { code: 'fr', name: 'Frances', flag: '🇫🇷' },
  { code: 'de', name: 'Aleman', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: 'Japones', flag: '🇯🇵' },
  { code: 'ko', name: 'Coreano', flag: '🇰🇷' },
  { code: 'zh', name: 'Chino', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabe', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ru', name: 'Ruso', flag: '🇷🇺' },
  { code: 'nl', name: 'Holandes', flag: '🇳🇱' },
  { code: 'pl', name: 'Polaco', flag: '🇵🇱' },
  { code: 'tr', name: 'Turco', flag: '🇹🇷' },
  { code: 'sv', name: 'Sueco', flag: '🇸🇪' },
  { code: 'th', name: 'Tailandes', flag: '🇹🇭' },
]

export default function TranslatePage() {
  const { videos, addVideo } = useVideoHistory()
  const [selectedVideoId, setSelectedVideoId] = useState('')
  const [customScript, setCustomScript] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('')
  const [translatedScript, setTranslatedScript] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const selectedVideo = videos.find((v) => v.id === selectedVideoId)
  const originalScript = selectedVideo?.script || customScript

  const handleTranslate = async () => {
    if (!originalScript.trim() || !targetLanguage) return

    setIsTranslating(true)
    setTranslatedScript('')

    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: originalScript,
          targetLanguage,
          sourceLanguage: 'es',
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setTranslatedScript(data.translatedScript)
      }
    } catch (error) {
      console.error('Error traduciendo:', error)
    } finally {
      setIsTranslating(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translatedScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveAsNew = () => {
    if (!translatedScript || !selectedVideo) return

    const targetLang = languages.find((l) => l.code === targetLanguage)
    addVideo({
      title: `${selectedVideo.title} (${targetLang?.name || targetLanguage})`,
      topic: selectedVideo.topic,
      platform: selectedVideo.platform,
      language: targetLanguage,
      style: selectedVideo.style,
      duration: selectedVideo.duration,
      script: translatedScript,
      hashtags: selectedVideo.hashtags,
      viralityScore: selectedVideo.viralityScore,
      templateId: selectedVideo.templateId,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
          <Languages className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Traducir Video</h1>
          <p className="text-dark-muted text-sm">Traduce tus guiones a mas de 15 idiomas</p>
        </div>
      </div>

      {/* Selection Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Select Video */}
        <Card hover={false}>
          <CardContent>
            <label className="block text-sm font-medium mb-2">Seleccionar Video del Historial</label>
            <select
              value={selectedVideoId}
              onChange={(e) => {
                setSelectedVideoId(e.target.value)
                setCustomScript('')
              }}
              className="w-full input-dark"
            >
              <option value="">-- Selecciona un video --</option>
              {videos.map((video) => (
                <option key={video.id} value={video.id}>
                  {video.title} ({video.platform})
                </option>
              ))}
            </select>
            {!videos.length && (
              <p className="text-xs text-dark-muted mt-2">No hay videos en el historial. Escribe un guion manualmente.</p>
            )}
            {!selectedVideoId && (
              <div className="mt-3">
                <label className="block text-xs text-dark-muted mb-1">O escribe un guion:</label>
                <textarea
                  value={customScript}
                  onChange={(e) => setCustomScript(e.target.value)}
                  placeholder="Pega aqui el guion a traducir..."
                  className="w-full h-24 input-dark resize-none text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Select Language */}
        <Card hover={false}>
          <CardContent>
            <label className="block text-sm font-medium mb-2">Idioma de Destino</label>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setTargetLanguage(lang.code)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                    targetLanguage === lang.code
                      ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                      : 'border-dark-border hover:border-dark-border/80 text-dark-muted hover:text-white'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Translate Button */}
      <button
        onClick={handleTranslate}
        disabled={isTranslating || !originalScript.trim() || !targetLanguage}
        className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isTranslating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Traduciendo...
          </>
        ) : (
          <>
            <Languages className="w-5 h-5" />
            Traducir Guion
          </>
        )}
      </button>

      {/* Side by Side Results */}
      {translatedScript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {/* Original */}
          <Card hover={false}>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🇪🇸</span>
                <h3 className="text-sm font-medium">Original (Espanol)</h3>
              </div>
              <div className="bg-dark-bg rounded-xl p-4 text-sm text-dark-muted whitespace-pre-wrap max-h-64 overflow-y-auto">
                {originalScript}
              </div>
            </CardContent>
          </Card>

          {/* Translated */}
          <Card hover={false}>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">
                  {languages.find((l) => l.code === targetLanguage)?.flag || '🌍'}
                </span>
                <h3 className="text-sm font-medium">
                  Traduccion ({languages.find((l) => l.code === targetLanguage)?.name})
                </h3>
                <ArrowRight className="w-4 h-4 text-primary-400 ml-auto" />
              </div>
              <div className="bg-dark-bg rounded-xl p-4 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                {translatedScript}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCopy}
                  className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copiado!' : 'Copiar Traduccion'}
                </button>
                {selectedVideo && (
                  <button
                    onClick={handleSaveAsNew}
                    className="px-3 py-1.5 text-xs border border-dark-border rounded-lg hover:bg-dark-card transition-colors flex items-center gap-1"
                  >
                    {saved ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Save className="w-3.5 h-3.5" />}
                    {saved ? 'Guardado!' : 'Guardar como Nuevo'}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
