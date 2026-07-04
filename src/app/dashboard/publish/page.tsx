'use client'

import { useState, useEffect } from 'react'
import { Send, Link2, Check, Clock, Video, Loader2, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useVideoHistory } from '@/hooks/useVideoHistory'
import { motion } from 'framer-motion'

interface ConnectedAccount {
  platform: string
  username: string
  connected: boolean
  connectedAt: string
  avatar: string
}

const platformConfig: Record<string, { name: string; color: string; icon: string }> = {
  tiktok: { name: 'TikTok', color: 'bg-pink-500/10 text-pink-400 border-pink-500/30', icon: '🎵' },
  instagram: { name: 'Instagram', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: '📸' },
  youtube: { name: 'YouTube', color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: '▶️' },
}

const STORAGE_KEY = 'autoreel_connected_accounts'

export default function PublishPage() {
  const { videos } = useVideoHistory()
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([])
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [connectStep, setConnectStep] = useState<'connecting' | 'success'>('connecting')

  // Publish form state
  const [selectedVideoId, setSelectedVideoId] = useState('')
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [scheduleTime, setScheduleTime] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [published, setPublished] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setAccounts(JSON.parse(stored))
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  const saveAccounts = (newAccounts: ConnectedAccount[]) => {
    setAccounts(newAccounts)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAccounts))
  }

  const handleConnect = (platform: string) => {
    setConnectingPlatform(platform)
    setConnectStep('connecting')
    setShowConnectModal(true)

    // Simulate OAuth flow
    setTimeout(() => {
      const newAccount: ConnectedAccount = {
        platform,
        username: `@autoreel_${platform}`,
        connected: true,
        connectedAt: new Date().toISOString(),
        avatar: platform[0].toUpperCase(),
      }
      const updated = [...accounts.filter((a) => a.platform !== platform), newAccount]
      saveAccounts(updated)
      setConnectStep('success')
    }, 2500)
  }

  const handleDisconnect = (platform: string) => {
    const updated = accounts.filter((a) => a.platform !== platform)
    saveAccounts(updated)
  }

  const toggleAccountSelection = (platform: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    )
  }

  const handlePublish = async () => {
    if (!selectedVideoId || selectedAccounts.length === 0) return
    setIsPublishing(true)

    // Simulate publish
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsPublishing(false)
    setPublished(true)
    setTimeout(() => setPublished(false), 5000)
  }

  const connectedAccounts = accounts.filter((a) => a.connected)
  const isAccountConnected = (platform: string) =>
    accounts.some((a) => a.platform === platform && a.connected)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
          <Send className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Publicar</h1>
          <p className="text-dark-muted text-sm">Conecta tus redes sociales y publica directamente</p>
        </div>
      </div>

      {/* Connected Accounts */}
      <Card hover={false}>
        <CardContent>
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary-400" />
            Cuentas Conectadas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(platformConfig).map(([key, config]) => {
              const connected = isAccountConnected(key)
              const account = accounts.find((a) => a.platform === key)
              return (
                <div
                  key={key}
                  className={`p-4 rounded-xl border ${
                    connected ? config.color : 'border-dark-border bg-dark-card'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{config.name}</p>
                      {connected && (
                        <p className="text-xs text-dark-muted">{account?.username}</p>
                      )}
                    </div>
                    {connected && (
                      <Badge variant="success" className="ml-auto text-[10px]">
                        Conectado
                      </Badge>
                    )}
                  </div>
                  {connected ? (
                    <button
                      onClick={() => handleDisconnect(key)}
                      className="w-full text-xs px-3 py-1.5 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      Desconectar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(key)}
                      className="w-full btn-primary text-xs py-1.5"
                    >
                      Conectar {config.name}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Publish Form - Only shows when at least one account connected */}
      {connectedAccounts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card hover={false}>
            <CardContent>
              <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                <Video className="w-4 h-4 text-primary-400" />
                Publicar Video
              </h3>

              <div className="space-y-4">
                {/* Select Video */}
                <div>
                  <label className="block text-sm text-dark-muted mb-1">Seleccionar Video</label>
                  <select
                    value={selectedVideoId}
                    onChange={(e) => setSelectedVideoId(e.target.value)}
                    className="w-full input-dark"
                  >
                    <option value="">-- Elige un video --</option>
                    {videos.map((video) => (
                      <option key={video.id} value={video.id}>
                        {video.title} ({video.platform})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Accounts */}
                <div>
                  <label className="block text-sm text-dark-muted mb-2">Publicar en:</label>
                  <div className="flex gap-2 flex-wrap">
                    {connectedAccounts.map((account) => {
                      const config = platformConfig[account.platform]
                      const selected = selectedAccounts.includes(account.platform)
                      return (
                        <button
                          key={account.platform}
                          onClick={() => toggleAccountSelection(account.platform)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                            selected
                              ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                              : 'border-dark-border text-dark-muted hover:text-white'
                          }`}
                        >
                          <span>{config?.icon}</span>
                          <span>{config?.name}</span>
                          {selected && <Check className="w-3.5 h-3.5" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-sm text-dark-muted mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Programar (opcional)
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full input-dark"
                  />
                </div>

                {/* Publish Button */}
                <button
                  onClick={handlePublish}
                  disabled={isPublishing || !selectedVideoId || selectedAccounts.length === 0}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Publicando...
                    </>
                  ) : published ? (
                    <>
                      <Check className="w-5 h-5" />
                      Publicado con Exito!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {scheduleTime ? 'Programar Publicacion' : 'Publicar Ahora'}
                    </>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* OAuth Modal */}
      <Modal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        title={`Conectar ${connectingPlatform ? platformConfig[connectingPlatform]?.name : ''}`}
        size="sm"
      >
        <div className="text-center py-6">
          {connectStep === 'connecting' ? (
            <>
              <Loader2 className="w-12 h-12 text-primary-400 animate-spin mx-auto mb-4" />
              <p className="text-sm text-dark-muted">Conectando...</p>
              <p className="text-xs text-dark-muted mt-1">Autorizando con {connectingPlatform ? platformConfig[connectingPlatform]?.name : ''}...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-sm font-medium">Cuenta conectada exitosamente!</p>
              <p className="text-xs text-dark-muted mt-1">
                @autoreel_{connectingPlatform} vinculada
              </p>
              <button
                onClick={() => setShowConnectModal(false)}
                className="btn-primary text-sm px-4 py-2 mt-4"
              >
                Continuar
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
