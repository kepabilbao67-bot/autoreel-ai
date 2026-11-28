'use client'

import { useState, useEffect } from 'react'
import { useLocalStorageValue, writeLocalStorage } from '@/hooks/useLocalStorage'
import { Download, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_KEY = 'autoreel_pwa_dismissed'

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  // Descartado si la clave existe en localStorage (undefined/null = no descartado)
  const storedDismissed = useLocalStorageValue(DISMISSED_KEY)
  const dismissed = typeof storedDismissed === 'string'

  useEffect(() => {
    // Check if already dismissed
    const wasDismissed = localStorage.getItem(DISMISSED_KEY)
    if (wasDismissed) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Show banner on mobile even without the event (for iOS)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isMobile && !isStandalone && !wasDismissed) {
      setTimeout(() => setShowBanner(true), 3000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowBanner(false)
      }
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    writeLocalStorage(DISMISSED_KEY, 'true')
  }

  if (dismissed || !showBanner) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm"
      >
        <div className="glass rounded-2xl p-4 border border-primary-500/20 shadow-lg shadow-primary-500/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Instalar AutoReel AI</p>
              <p className="text-xs text-dark-muted mt-0.5">
                Accede mas rapido desde tu pantalla de inicio
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="btn-primary text-xs px-3 py-1.5"
                >
                  Instalar
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-xs text-dark-muted hover:text-white px-3 py-1.5 transition-colors"
                >
                  Ahora no
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-dark-muted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
