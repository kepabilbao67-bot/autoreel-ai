import Link from 'next/link'
import { Play } from 'lucide-react'

// Footer compartido
export function Footer() {
  return (
    <footer className="border-t border-dark-border py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AutoReel AI</span>
            </Link>
            <p className="text-dark-muted text-sm">
              Plataforma lider en creacion de videos con IA para redes sociales.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Producto</h4>
            <ul className="space-y-2 text-sm text-dark-muted">
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Precios</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Compania</h4>
            <ul className="space-y-2 text-sm text-dark-muted">
              <li><Link href="#" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-dark-muted">
              <li><Link href="#" className="hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terminos</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-dark-border text-center text-sm text-dark-muted">
          <p>&copy; 2025 AutoReel AI. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
