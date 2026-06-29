'use client'

import Link from 'next/link'
import { Play, Shield } from 'lucide-react'

// Politica de privacidad completa GDPR-ready
export default function PrivacyPage() {
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
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-primary-400" />
          <h1 className="text-4xl font-bold text-white">Politica de Privacidad</h1>
        </div>
        <p className="text-dark-muted mb-8">Ultima actualizacion: Enero 2024 | Cumplimiento GDPR</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Responsable del Tratamiento</h2>
            <p className="text-dark-muted leading-relaxed">
              AutoReel AI (&quot;nosotros&quot;, &quot;nuestro&quot;) es el responsable del tratamiento de sus datos personales. Nos comprometemos a proteger su privacidad y a tratar sus datos de acuerdo con el Reglamento General de Proteccion de Datos (GDPR) y la legislacion aplicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Datos que Recopilamos</h2>
            <p className="text-dark-muted leading-relaxed mb-3">Recopilamos los siguientes tipos de datos:</p>
            <ul className="list-disc list-inside text-dark-muted space-y-2">
              <li><strong className="text-white">Datos de cuenta:</strong> nombre, email, foto de perfil</li>
              <li><strong className="text-white">Datos de uso:</strong> videos creados, interacciones con la plataforma</li>
              <li><strong className="text-white">Datos tecnicos:</strong> direccion IP, tipo de navegador, dispositivo</li>
              <li><strong className="text-white">Datos de pago:</strong> procesados de forma segura a traves de Stripe</li>
              <li><strong className="text-white">Contenido:</strong> scripts, videos y assets que cree en la plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Base Legal del Tratamiento</h2>
            <p className="text-dark-muted leading-relaxed mb-3">Procesamos sus datos en base a:</p>
            <ul className="list-disc list-inside text-dark-muted space-y-2">
              <li><strong className="text-white">Ejecucion de contrato:</strong> para proveer el servicio solicitado</li>
              <li><strong className="text-white">Consentimiento:</strong> para comunicaciones de marketing</li>
              <li><strong className="text-white">Interes legitimo:</strong> para mejorar nuestros servicios y seguridad</li>
              <li><strong className="text-white">Obligacion legal:</strong> para cumplir con requisitos fiscales y legales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Finalidad del Tratamiento</h2>
            <p className="text-dark-muted leading-relaxed mb-3">Utilizamos sus datos para:</p>
            <ul className="list-disc list-inside text-dark-muted space-y-2">
              <li>Proporcionar y mantener el servicio</li>
              <li>Procesar pagos y gestionar suscripciones</li>
              <li>Enviar notificaciones relacionadas con el servicio</li>
              <li>Mejorar la experiencia del usuario y la plataforma</li>
              <li>Prevenir fraude y garantizar la seguridad</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Sus Derechos (GDPR)</h2>
            <p className="text-dark-muted leading-relaxed mb-3">Bajo el GDPR, usted tiene derecho a:</p>
            <ul className="list-disc list-inside text-dark-muted space-y-2">
              <li><strong className="text-white">Acceso:</strong> solicitar una copia de sus datos personales</li>
              <li><strong className="text-white">Rectificacion:</strong> corregir datos inexactos o incompletos</li>
              <li><strong className="text-white">Supresion:</strong> solicitar la eliminacion de sus datos</li>
              <li><strong className="text-white">Portabilidad:</strong> recibir sus datos en formato estructurado</li>
              <li><strong className="text-white">Oposicion:</strong> oponerse al tratamiento de sus datos</li>
              <li><strong className="text-white">Limitacion:</strong> restringir el procesamiento de sus datos</li>
              <li><strong className="text-white">Retirar consentimiento:</strong> en cualquier momento sin efecto retroactivo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Comparticion de Datos</h2>
            <p className="text-dark-muted leading-relaxed mb-3">Compartimos datos unicamente con:</p>
            <ul className="list-disc list-inside text-dark-muted space-y-2">
              <li><strong className="text-white">Stripe:</strong> procesamiento de pagos</li>
              <li><strong className="text-white">Supabase:</strong> almacenamiento de datos (servidores en EU)</li>
              <li><strong className="text-white">OpenAI:</strong> generacion de contenido con IA</li>
              <li><strong className="text-white">Vercel:</strong> hosting de la aplicacion</li>
            </ul>
            <p className="text-dark-muted leading-relaxed mt-3">
              Todos nuestros proveedores cumplen con los estandares GDPR y tienen acuerdos de procesamiento de datos vigentes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Retencion de Datos</h2>
            <p className="text-dark-muted leading-relaxed">
              Conservamos sus datos mientras mantenga una cuenta activa o segun sea necesario para proporcionarle servicios. Tras la eliminacion de su cuenta, eliminaremos sus datos personales en un plazo de 30 dias, excepto cuando debamos retenerlos por obligaciones legales (hasta 5 anos para datos fiscales).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Cookies y Tecnologias</h2>
            <p className="text-dark-muted leading-relaxed">
              Utilizamos cookies esenciales para el funcionamiento del servicio y cookies analiticas (con su consentimiento) para mejorar la experiencia. Puede gestionar sus preferencias de cookies en cualquier momento desde la configuracion de su navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Seguridad</h2>
            <p className="text-dark-muted leading-relaxed">
              Implementamos medidas tecnicas y organizativas apropiadas para proteger sus datos, incluyendo encriptacion en transito (TLS) y en reposo, control de acceso basado en roles, y auditorias de seguridad regulares.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Transferencias Internacionales</h2>
            <p className="text-dark-muted leading-relaxed">
              Cuando transferimos datos fuera del Espacio Economico Europeo, nos aseguramos de que existan garantias adecuadas, como Clausulas Contractuales Tipo aprobadas por la Comision Europea.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contacto y Reclamaciones</h2>
            <p className="text-dark-muted leading-relaxed">
              Para ejercer sus derechos o realizar consultas sobre privacidad, contacte con nuestro Delegado de Proteccion de Datos en privacy@autoreel.ai. Tambien tiene derecho a presentar una reclamacion ante la autoridad de proteccion de datos correspondiente.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
