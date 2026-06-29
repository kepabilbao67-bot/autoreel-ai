'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

// Pagina de recuperacion de contrasena
export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al enviar email')
      }

      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold">Email enviado</h1>
        <p className="text-dark-muted">
          Si existe una cuenta con {email}, recibiras un enlace para restablecer tu contrasena.
        </p>
        <Link href="/login" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver a login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Recuperar contrasena</h1>
        <p className="text-dark-muted mt-2">Te enviaremos un enlace para restablecer tu contrasena</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          placeholder="tu@email.com"
          icon={<Mail className="w-5 h-5" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Enviar enlace
        </Button>
      </form>

      <p className="text-center text-sm text-dark-muted">
        <Link href="/login" className="text-primary-400 hover:text-primary-300 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Volver a login
        </Link>
      </p>
    </div>
  )
}
