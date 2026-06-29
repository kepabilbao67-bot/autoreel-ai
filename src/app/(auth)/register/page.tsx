'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

// Pagina de registro
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  // Validacion de contrasena en tiempo real
  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validar contrasena
    if (!passwordChecks.length || !passwordChecks.uppercase || !passwordChecks.number) {
      setError('La contrasena no cumple los requisitos')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al registrar')
      }

      window.location.href = '/dashboard'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
        <p className="text-dark-muted mt-2">Empieza a crear videos virales con IA</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="Nombre completo"
          placeholder="Tu nombre"
          icon={<User className="w-5 h-5" />}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          type="email"
          label="Email"
          placeholder="tu@email.com"
          icon={<Mail className="w-5 h-5" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Contrasena"
            placeholder="Minimo 8 caracteres"
            icon={<Lock className="w-5 h-5" />}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-dark-muted hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Indicador de fuerza de contrasena */}
        {formData.password && (
          <div className="space-y-1.5 text-xs">
            <div className={`flex items-center gap-2 ${passwordChecks.length ? 'text-green-400' : 'text-dark-muted'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${passwordChecks.length ? 'bg-green-400' : 'bg-dark-muted'}`} />
              Minimo 8 caracteres
            </div>
            <div className={`flex items-center gap-2 ${passwordChecks.uppercase ? 'text-green-400' : 'text-dark-muted'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${passwordChecks.uppercase ? 'bg-green-400' : 'bg-dark-muted'}`} />
              Al menos una mayuscula
            </div>
            <div className={`flex items-center gap-2 ${passwordChecks.number ? 'text-green-400' : 'text-dark-muted'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${passwordChecks.number ? 'bg-green-400' : 'bg-dark-muted'}`} />
              Al menos un numero
            </div>
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full" size="lg" icon={<UserPlus className="w-5 h-5" />}>
          Crear Cuenta Gratis
        </Button>
      </form>

      <p className="text-center text-sm text-dark-muted">
        Ya tienes cuenta?{' '}
        <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium">
          Inicia sesion
        </Link>
      </p>

      <p className="text-center text-xs text-dark-muted">
        Al registrarte, aceptas nuestros{' '}
        <a href="#" className="underline">Terminos de Servicio</a> y{' '}
        <a href="#" className="underline">Politica de Privacidad</a>
      </p>
    </div>
  )
}
