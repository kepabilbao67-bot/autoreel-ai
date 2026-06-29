'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Zap, Crown, Building2, ChevronDown, ChevronUp } from 'lucide-react'

// Planes disponibles
const plans = [
  {
    name: 'Starter',
    icon: Zap,
    price: { monthly: 0, annual: 0 },
    description: 'Perfecto para empezar a crear contenido con IA',
    badge: 'Gratis',
    features: [
      { name: '5 videos por mes', included: true },
      { name: 'Templates basicos', included: true },
      { name: 'Resolucion 720p', included: true },
      { name: 'Marca de agua', included: true },
      { name: '1 plataforma', included: true },
      { name: 'Soporte por email', included: true },
      { name: 'Analytics basicos', included: true },
      { name: 'Programador de posts', included: false },
      { name: 'Templates premium', included: false },
      { name: 'API access', included: false },
    ],
    cta: 'Empezar Gratis',
    popular: false,
  },
  {
    name: 'Creator',
    icon: Crown,
    price: { monthly: 19, annual: 15 },
    description: 'Para creadores de contenido que quieren escalar',
    badge: 'Popular',
    features: [
      { name: '50 videos por mes', included: true },
      { name: 'Todos los templates', included: true },
      { name: 'Resolucion 1080p', included: true },
      { name: 'Sin marca de agua', included: true },
      { name: 'Todas las plataformas', included: true },
      { name: 'Soporte prioritario', included: true },
      { name: 'Analytics avanzados', included: true },
      { name: 'Programador de posts', included: true },
      { name: 'Templates premium', included: true },
      { name: 'API access', included: false },
    ],
    cta: 'Comenzar Prueba',
    popular: true,
  },
  {
    name: 'Business',
    icon: Building2,
    price: { monthly: 49, annual: 39 },
    description: 'Para equipos y empresas con necesidades avanzadas',
    badge: 'Empresas',
    features: [
      { name: 'Videos ilimitados', included: true },
      { name: 'Templates personalizados', included: true },
      { name: 'Resolucion 4K', included: true },
      { name: 'Sin marca de agua', included: true },
      { name: 'Todas las plataformas', included: true },
      { name: 'Soporte 24/7', included: true },
      { name: 'Analytics avanzados', included: true },
      { name: 'Programador de posts', included: true },
      { name: 'Templates premium', included: true },
      { name: 'API access completo', included: true },
    ],
    cta: 'Contactar Ventas',
    popular: false,
  },
]

// FAQ de pagos
const faqs = [
  {
    question: 'Puedo cancelar en cualquier momento?',
    answer: 'Si, puedes cancelar tu suscripcion en cualquier momento sin penalizaciones. Seguiras teniendo acceso hasta el final de tu periodo de facturacion actual.',
  },
  {
    question: 'Que metodos de pago aceptan?',
    answer: 'Aceptamos todas las tarjetas de credito y debito principales (Visa, Mastercard, American Express), asi como pagos a traves de PayPal y transferencia bancaria para planes Business.',
  },
  {
    question: 'Hay un periodo de prueba?',
    answer: 'El plan Creator incluye 7 dias de prueba gratuita. No se requiere tarjeta de credito para el plan Starter que es completamente gratis.',
  },
  {
    question: 'Puedo cambiar de plan en cualquier momento?',
    answer: 'Si, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se aplican inmediatamente y se ajusta el cobro de forma proporcional.',
  },
  {
    question: 'Ofrecen descuentos para equipos grandes?',
    answer: 'Si, ofrecemos descuentos por volumen para equipos de mas de 10 personas. Contacta con nuestro equipo de ventas para obtener un presupuesto personalizado.',
  },
  {
    question: 'Cual es la politica de reembolso?',
    answer: 'Ofrecemos una garantia de devolucion de 30 dias en todos los planes de pago. Si no estas satisfecho, te devolvemos el 100% de tu dinero sin preguntas.',
  },
]

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <nav className="border-b border-dark-border bg-dark-bg/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">AutoReel AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-dark-muted hover:text-white text-sm transition-colors">Blog</Link>
            <Link href="/docs" className="text-dark-muted hover:text-white text-sm transition-colors">Docs</Link>
            <Link href="/dashboard" className="px-4 py-2 bg-gradient-purple rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Titulo */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Planes y <span className="gradient-text">Precios</span>
          </h1>
          <p className="text-lg text-dark-muted max-w-2xl mx-auto">
            Elige el plan perfecto para tu nivel de creacion de contenido.
            Todos incluyen acceso a nuestra IA avanzada.
          </p>

          {/* Toggle mensual/anual */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-dark-muted'}`}>Mensual</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? 'bg-primary-500' : 'bg-dark-border'}`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-dark-muted'}`}>
              Anual <span className="text-green-400 text-xs font-medium">-20%</span>
            </span>
          </div>
        </div>

        {/* Planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 transition-all hover:scale-[1.02] ${
                plan.popular
                  ? 'border-primary-500 bg-primary-500/5 shadow-lg shadow-primary-500/10'
                  : 'border-dark-border bg-dark-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-purple rounded-full text-xs font-medium text-white">
                  Mas Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${plan.popular ? 'bg-primary-500/20' : 'bg-dark-hover'}`}>
                  <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-primary-400' : 'text-dark-muted'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                </div>
              </div>

              <p className="text-sm text-dark-muted mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  ${isAnnual ? plan.price.annual : plan.price.monthly}
                </span>
                <span className="text-dark-muted text-sm">/mes</span>
              </div>

              <button
                className={`w-full py-3 rounded-xl font-medium transition-all mb-8 ${
                  plan.popular
                    ? 'bg-gradient-purple text-white hover:opacity-90'
                    : 'bg-dark-hover text-white border border-dark-border hover:border-primary-500/50'
                }`}
              >
                {plan.cta}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-3 text-sm">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-dark-muted flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-dark-text' : 'text-dark-muted'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Garantia */}
        <div className="text-center mb-20 p-8 rounded-2xl border border-dark-border bg-dark-card">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Garantia de 30 dias</h2>
          <p className="text-dark-muted max-w-xl mx-auto">
            Si no estas satisfecho con AutoReel AI, te devolvemos el 100% de tu dinero
            durante los primeros 30 dias. Sin preguntas, sin complicaciones.
          </p>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-dark-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-dark-hover transition-colors"
                >
                  <span className="text-sm font-medium text-white">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-dark-muted flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-dark-muted flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-dark-muted">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
