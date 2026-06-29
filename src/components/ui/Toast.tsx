'use client'

import { Toaster } from 'sonner'

// Wrapper de Sonner Toaster con estilos del tema
export function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#12121a',
          border: '1px solid #1e1e2e',
          color: '#e2e8f0',
        },
      }}
      theme="dark"
      richColors
    />
  )
}
