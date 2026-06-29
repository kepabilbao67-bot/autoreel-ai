'use client'

import Link from 'next/link'
import { Play, Code, Book, Zap, Lock, Server, Database } from 'lucide-react'

// Documentacion de la API
const endpoints = [
  {
    method: 'GET',
    path: '/api/videos',
    description: 'Obtener videos del usuario',
    params: 'userId (query)',
    example: {
      request: 'GET /api/videos?userId=user_123',
      response: '{ "videos": [{ "id": "vid_1", "title": "Mi Video", "status": "completed" }] }',
    },
  },
  {
    method: 'POST',
    path: '/api/videos',
    description: 'Crear un nuevo video',
    params: 'userId, topic, platform, duration, style, language (body)',
    example: {
      request: '{ "userId": "user_123", "topic": "Marketing Digital", "platform": "tiktok", "duration": 30, "style": "professional", "language": "es" }',
      response: '{ "video": { "id": "vid_2", "title": "Marketing Digital", "status": "draft" } }',
    },
  },
  {
    method: 'DELETE',
    path: '/api/videos',
    description: 'Eliminar un video',
    params: 'id, userId (query)',
    example: {
      request: 'DELETE /api/videos?id=vid_1&userId=user_123',
      response: '{ "message": "Video eliminado" }',
    },
  },
  {
    method: 'POST',
    path: '/api/ai/generate',
    description: 'Generar script con IA',
    params: 'topic, platform, style, duration, language (body)',
    example: {
      request: '{ "topic": "Productividad", "platform": "reels", "style": "casual", "duration": 60 }',
      response: '{ "script": "Intro: ...", "title": "5 Tips de Productividad", "hashtags": ["#productividad"] }',
    },
  },
  {
    method: 'GET',
    path: '/api/scheduler',
    description: 'Obtener publicaciones programadas',
    params: 'userId, status (query, opcional)',
    example: {
      request: 'GET /api/scheduler?userId=user_123&status=pending',
      response: '{ "scheduledPosts": [...], "total": 3 }',
    },
  },
  {
    method: 'POST',
    path: '/api/scheduler',
    description: 'Crear publicacion programada',
    params: 'videoId, platform, scheduledAt, userId (body)',
    example: {
      request: '{ "videoId": "vid_1", "platform": "tiktok", "scheduledAt": "2024-02-01T10:00:00Z" }',
      response: '{ "scheduledPost": { "id": "sp_1", "status": "pending" } }',
    },
  },
  {
    method: 'GET',
    path: '/api/notifications',
    description: 'Obtener notificaciones del usuario',
    params: 'Ninguno (usa sesion)',
    example: {
      request: 'GET /api/notifications',
      response: '{ "notifications": [...], "unreadCount": 3 }',
    },
  },
  {
    method: 'POST',
    path: '/api/payments/create-checkout',
    description: 'Crear sesion de checkout',
    params: 'priceId, userId (body)',
    example: {
      request: '{ "priceId": "price_xxx", "userId": "user_123" }',
      response: '{ "url": "https://checkout.stripe.com/..." }',
    },
  },
]

const methodColors: Record<string, string> = {
  GET: 'bg-green-500/10 text-green-400 border-green-500/30',
  POST: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  PUT: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  DELETE: 'bg-red-500/10 text-red-400 border-red-500/30',
}

export default function DocsPage() {
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
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-dark-muted hover:text-white text-sm transition-colors">Precios</Link>
            <Link href="/dashboard" className="px-4 py-2 bg-gradient-purple rounded-lg text-white text-sm font-medium">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Titulo */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Documentacion del <span className="gradient-text">API</span>
          </h1>
          <p className="text-lg text-dark-muted max-w-2xl mx-auto">
            Referencia completa de la API de AutoReel AI. Integra la creacion
            de videos con IA en tus propias aplicaciones.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <a
              href="/api/docs"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dark-border text-dark-muted hover:text-white hover:border-primary-500/50 transition-all text-sm"
            >
              <Code className="w-4 h-4" />
              OpenAPI Spec (JSON)
            </a>
          </div>
        </div>

        {/* Guia rapida */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="p-5 rounded-xl border border-dark-border bg-dark-card">
            <Lock className="w-6 h-6 text-primary-400 mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Autenticacion</h3>
            <p className="text-xs text-dark-muted">Bearer token JWT en el header Authorization</p>
          </div>
          <div className="p-5 rounded-xl border border-dark-border bg-dark-card">
            <Server className="w-6 h-6 text-primary-400 mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Base URL</h3>
            <p className="text-xs text-dark-muted font-mono">https://autoreel.ai/api</p>
          </div>
          <div className="p-5 rounded-xl border border-dark-border bg-dark-card">
            <Database className="w-6 h-6 text-primary-400 mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Rate Limit</h3>
            <p className="text-xs text-dark-muted">60 requests/minuto por usuario</p>
          </div>
        </div>

        {/* Lista de endpoints */}
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Book className="w-6 h-6 text-primary-400" />
          Endpoints
        </h2>

        <div className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <div
              key={index}
              className="rounded-xl border border-dark-border bg-dark-card overflow-hidden"
            >
              {/* Header del endpoint */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-dark-border">
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${methodColors[endpoint.method]}`}>
                  {endpoint.method}
                </span>
                <code className="text-sm text-white font-mono">{endpoint.path}</code>
                <span className="text-sm text-dark-muted ml-auto hidden sm:block">{endpoint.description}</span>
              </div>

              {/* Detalles */}
              <div className="px-5 py-4 space-y-3">
                <p className="text-sm text-dark-muted sm:hidden">{endpoint.description}</p>
                <div>
                  <span className="text-xs font-medium text-dark-muted">Parametros:</span>
                  <p className="text-sm text-dark-text mt-1">{endpoint.params}</p>
                </div>

                {/* Ejemplo request */}
                <div>
                  <span className="text-xs font-medium text-dark-muted">Request:</span>
                  <pre className="mt-1 p-3 rounded-lg bg-dark-bg border border-dark-border overflow-x-auto">
                    <code className="text-xs text-green-400">{endpoint.example.request}</code>
                  </pre>
                </div>

                {/* Ejemplo response */}
                <div>
                  <span className="text-xs font-medium text-dark-muted">Response:</span>
                  <pre className="mt-1 p-3 rounded-lg bg-dark-bg border border-dark-border overflow-x-auto">
                    <code className="text-xs text-blue-400">{endpoint.example.response}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Codigos de error */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Codigos de Estado</h2>
          <div className="rounded-xl border border-dark-border bg-dark-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="px-5 py-3 text-left text-dark-muted font-medium">Codigo</th>
                  <th className="px-5 py-3 text-left text-dark-muted font-medium">Descripcion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                <tr><td className="px-5 py-3 text-green-400 font-mono">200</td><td className="px-5 py-3 text-dark-text">Exito</td></tr>
                <tr><td className="px-5 py-3 text-green-400 font-mono">201</td><td className="px-5 py-3 text-dark-text">Recurso creado</td></tr>
                <tr><td className="px-5 py-3 text-yellow-400 font-mono">400</td><td className="px-5 py-3 text-dark-text">Solicitud invalida</td></tr>
                <tr><td className="px-5 py-3 text-yellow-400 font-mono">401</td><td className="px-5 py-3 text-dark-text">No autenticado</td></tr>
                <tr><td className="px-5 py-3 text-yellow-400 font-mono">429</td><td className="px-5 py-3 text-dark-text">Rate limit excedido</td></tr>
                <tr><td className="px-5 py-3 text-red-400 font-mono">500</td><td className="px-5 py-3 text-dark-text">Error interno del servidor</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
