import Link from 'next/link'
import { Play } from 'lucide-react'

// Layout para paginas de autenticacion
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header con logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
            <Play className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">AutoReel AI</span>
        </Link>
      </div>

      {/* Contenido centrado */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Fondo decorativo */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
