'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play, Menu, X } from 'lucide-react'

// Navbar compartido para paginas publicas
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AutoReel AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-dark-muted hover:text-white transition-colors">
              Iniciar Sesion
            </Link>
            <Link href="/register" className="btn-primary text-sm">
              Empezar Gratis
            </Link>
          </div>

          <button className="md:hidden text-dark-muted" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass border-t border-dark-border px-4 py-4 space-y-3">
          <Link href="/login" className="block text-dark-muted hover:text-white">
            Iniciar Sesion
          </Link>
          <Link href="/register" className="block btn-primary text-center text-sm">
            Empezar Gratis
          </Link>
        </div>
      )}
    </nav>
  )
}
