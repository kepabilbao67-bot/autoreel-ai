'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'

// Pagina de terminos y condiciones completos
export default function TermsPage() {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">Terminos y Condiciones</h1>
        <p className="text-dark-muted mb-8">Ultima actualizacion: Enero 2024</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Aceptacion de los Terminos</h2>
            <p className="text-dark-muted leading-relaxed">
              Al acceder y utilizar AutoReel AI (&quot;el Servicio&quot;), usted acepta estar sujeto a estos Terminos y Condiciones. Si no esta de acuerdo con alguna parte de estos terminos, no podra acceder al servicio. Estos terminos se aplican a todos los visitantes, usuarios y demas personas que accedan o utilicen el Servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Descripcion del Servicio</h2>
            <p className="text-dark-muted leading-relaxed">
              AutoReel AI es una plataforma SaaS que permite a los usuarios crear videos automaticos para redes sociales utilizando inteligencia artificial. El servicio incluye generacion de scripts, edicion automatica, programacion de publicaciones y analytics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Cuentas de Usuario</h2>
            <p className="text-dark-muted leading-relaxed">
              Al crear una cuenta, usted garantiza que la informacion proporcionada es precisa y completa. Es responsable de mantener la confidencialidad de su cuenta y contrasena, y acepta la responsabilidad por todas las actividades que ocurran bajo su cuenta. Debe notificarnos inmediatamente ante cualquier uso no autorizado.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Uso Aceptable</h2>
            <p className="text-dark-muted leading-relaxed mb-3">El usuario se compromete a no utilizar el servicio para:</p>
            <ul className="list-disc list-inside text-dark-muted space-y-2">
              <li>Crear contenido ilegal, difamatorio u ofensivo</li>
              <li>Violar derechos de propiedad intelectual de terceros</li>
              <li>Distribuir malware o codigo malicioso</li>
              <li>Realizar actividades de spam o phishing</li>
              <li>Intentar acceder a cuentas de otros usuarios</li>
              <li>Sobrecargar intencionalmente los servidores del servicio</li>
              <li>Revender el servicio sin autorizacion previa</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Propiedad Intelectual</h2>
            <p className="text-dark-muted leading-relaxed">
              El contenido generado por el usuario a traves de nuestra plataforma pertenece al usuario. Sin embargo, AutoReel AI retiene todos los derechos sobre la plataforma, tecnologia, algoritmos y materiales propietarios. Se concede al usuario una licencia limitada, no exclusiva y revocable para usar el servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Pagos y Suscripciones</h2>
            <p className="text-dark-muted leading-relaxed">
              Las suscripciones se facturan de forma mensual o anual segun el plan seleccionado. Los precios pueden cambiar con notificacion previa de 30 dias. Las cancelaciones toman efecto al final del periodo de facturacion actual. Se ofrece garantia de devolucion de 30 dias para nuevos suscriptores.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Limitacion de Responsabilidad</h2>
            <p className="text-dark-muted leading-relaxed">
              AutoReel AI no sera responsable por danos indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar el servicio. Nuestra responsabilidad total no excedera el monto pagado por el usuario en los ultimos 12 meses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Disponibilidad del Servicio</h2>
            <p className="text-dark-muted leading-relaxed">
              Nos esforzamos por mantener el servicio disponible 24/7, pero no garantizamos un tiempo de actividad del 100%. Pueden ocurrir interrupciones por mantenimiento programado o circunstancias imprevistas. Notificaremos con anticipacion los periodos de mantenimiento planificados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Terminacion</h2>
            <p className="text-dark-muted leading-relaxed">
              Podemos suspender o terminar su acceso al servicio de forma inmediata, sin previo aviso, por conductas que consideremos violatorias de estos terminos o perjudiciales para otros usuarios o para la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Modificaciones</h2>
            <p className="text-dark-muted leading-relaxed">
              Nos reservamos el derecho de modificar estos terminos en cualquier momento. Los cambios entraran en vigor inmediatamente despues de su publicacion en el sitio web. El uso continuado del servicio constituye la aceptacion de los terminos modificados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contacto</h2>
            <p className="text-dark-muted leading-relaxed">
              Si tiene preguntas sobre estos Terminos y Condiciones, puede contactarnos en legal@autoreel.ai o a traves de nuestra <Link href="/contact" className="text-primary-400 hover:text-primary-300">pagina de contacto</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
