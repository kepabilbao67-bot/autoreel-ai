'use client'

import { WifiOff, RefreshCw } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-primary-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Sin Conexion</h1>
        <p className="text-dark-muted mb-6">
          Parece que no tienes conexion a internet. Algunas funciones no estan disponibles offline.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary px-6 py-3 inline-flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Reintentar
        </button>
        <p className="text-xs text-dark-muted mt-4">
          Tus videos guardados y configuracion estan disponibles offline.
        </p>
      </div>
    </div>
  )
}
