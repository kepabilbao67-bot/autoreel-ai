'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play, Mail, MapPin, Clock, Send, MessageSquare, Phone, Globe } from 'lucide-react'

// Pagina de contacto con formulario y mapa conceptual
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // En produccion, enviar a API
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <nav className="border-b border-dark-border bg-dark-bg/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">AutoReel AI</span>
          </Link>
          <Link href="/dashboard" className="px-4 py-2 bg-gradient-purple rounded-lg text-white text-sm font-medium">
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Titulo */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            <span className="gradient-text">Contactanos</span>
          </h1>
          <p className="text-lg text-dark-muted max-w-2xl mx-auto">
            Estamos aqui para ayudarte. Envianos un mensaje y te responderemos
            en menos de 24 horas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulario */}
          <div className="rounded-2xl border border-dark-border bg-dark-card p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Mensaje Enviado!</h3>
                <p className="text-dark-muted">
                  Gracias por contactarnos. Te responderemos pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Nombre</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-dark-border text-white placeholder:text-dark-muted focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-dark-border text-white placeholder:text-dark-muted focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Asunto</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-dark-border text-white focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="soporte">Soporte Tecnico</option>
                    <option value="ventas">Ventas y Planes</option>
                    <option value="facturacion">Facturacion</option>
                    <option value="partnership">Partnership</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Mensaje</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-dark-border text-white placeholder:text-dark-muted focus:outline-none focus:border-primary-500 transition-colors resize-none"
                    placeholder="Describe tu consulta..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-purple rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Enviar Mensaje
                </button>
              </form>
            )}
          </div>

          {/* Info de contacto y mapa conceptual */}
          <div className="space-y-6">
            {/* Tarjetas de info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-dark-border bg-dark-card">
                <Mail className="w-6 h-6 text-primary-400 mb-3" />
                <h3 className="text-sm font-semibold text-white mb-1">Email</h3>
                <p className="text-sm text-dark-muted">soporte@autoreel.ai</p>
              </div>
              <div className="p-5 rounded-xl border border-dark-border bg-dark-card">
                <MessageSquare className="w-6 h-6 text-primary-400 mb-3" />
                <h3 className="text-sm font-semibold text-white mb-1">Chat en Vivo</h3>
                <p className="text-sm text-dark-muted">Lun-Vie, 9:00-18:00</p>
              </div>
              <div className="p-5 rounded-xl border border-dark-border bg-dark-card">
                <Clock className="w-6 h-6 text-primary-400 mb-3" />
                <h3 className="text-sm font-semibold text-white mb-1">Respuesta</h3>
                <p className="text-sm text-dark-muted">Menos de 24 horas</p>
              </div>
              <div className="p-5 rounded-xl border border-dark-border bg-dark-card">
                <Globe className="w-6 h-6 text-primary-400 mb-3" />
                <h3 className="text-sm font-semibold text-white mb-1">Idiomas</h3>
                <p className="text-sm text-dark-muted">Espanol e Ingles</p>
              </div>
            </div>

            {/* Mapa conceptual de soporte */}
            <div className="p-6 rounded-xl border border-dark-border bg-dark-card">
              <h3 className="text-lg font-bold text-white mb-4">Centro de Ayuda</h3>
              <div className="relative">
                {/* Nodo central */}
                <div className="flex items-center justify-center mb-6">
                  <div className="px-4 py-2 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-sm font-medium">
                    Soporte AutoReel
                  </div>
                </div>
                {/* Nodos conectados */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-dark-bg border border-dark-border text-center">
                    <Phone className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <p className="text-xs text-dark-muted">Soporte Tecnico</p>
                  </div>
                  <div className="p-3 rounded-lg bg-dark-bg border border-dark-border text-center">
                    <Mail className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <p className="text-xs text-dark-muted">Facturacion</p>
                  </div>
                  <div className="p-3 rounded-lg bg-dark-bg border border-dark-border text-center">
                    <MessageSquare className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <p className="text-xs text-dark-muted">Ventas</p>
                  </div>
                  <div className="p-3 rounded-lg bg-dark-bg border border-dark-border text-center">
                    <Globe className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                    <p className="text-xs text-dark-muted">Partnerships</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ubicacion */}
            <div className="p-6 rounded-xl border border-dark-border bg-dark-card">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-bold text-white">Ubicacion</h3>
              </div>
              <p className="text-dark-muted text-sm">
                AutoReel AI - Equipo 100% remoto<br />
                Con presencia en Espana, Mexico y Argentina
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
