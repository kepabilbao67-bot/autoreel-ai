'use client'

import { motion } from 'framer-motion'

// Barra de progreso animada
interface ProgressProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Progress({ value, max = 100, label, showPercentage = true, size = 'md' }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm text-dark-muted">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-primary-400">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-dark-card rounded-full ${sizeStyles[size]} overflow-hidden border border-dark-border`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`${sizeStyles[size]} rounded-full bg-gradient-to-r from-primary-500 to-accent-500`}
        />
      </div>
    </div>
  )
}
