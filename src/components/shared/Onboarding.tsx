'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Layout, Share2, X, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const STORAGE_KEY = 'autoreel_onboarding_completed'

interface OnboardingStep {
  icon: React.ReactNode
  title: string
  description: string
}

const steps: OnboardingStep[] = [
  {
    icon: <Sparkles className="w-10 h-10 text-primary-400" />,
    title: 'Crea tu primer video',
    description:
      'Con un solo clic, nuestra IA genera un guion completo, subtitulos, hashtags y sugerencias de musica para tu video viral.',
  },
  {
    icon: <Layout className="w-10 h-10 text-primary-400" />,
    title: 'Personaliza con plantillas',
    description:
      'Elige entre mas de 15 plantillas profesionales organizadas por categoria. Desde educacion hasta gaming, hay una plantilla perfecta para ti.',
  },
  {
    icon: <Share2 className="w-10 h-10 text-primary-400" />,
    title: 'Comparte en redes sociales',
    description:
      'Exporta tu contenido y compartelo directamente en WhatsApp, Twitter, Facebook, LinkedIn y Telegram con un solo clic.',
  },
]

export function Onboarding() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY)
    if (!completed) {
      setIsOpen(true)
    }
  }, [])

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsOpen(false)
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleSkip} />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-2xl p-8 shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-dark-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
                {steps[currentStep].icon}
              </div>
              <h2 className="text-xl font-bold mb-3">{steps[currentStep].title}</h2>
              <p className="text-dark-muted text-sm leading-relaxed">
                {steps[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mt-8 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-6 bg-primary-500'
                    : index < currentStep
                    ? 'bg-primary-500/50'
                    : 'bg-dark-border'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-dark-muted hover:text-white transition-colors"
            >
              Saltar
            </button>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handlePrev}
                  icon={<ChevronLeft className="w-4 h-4" />}
                >
                  Atras
                </Button>
              )}
              <Button size="sm" onClick={handleNext} icon={<ChevronRight className="w-4 h-4" />}>
                {currentStep === steps.length - 1 ? 'Empezar' : 'Siguiente'}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
