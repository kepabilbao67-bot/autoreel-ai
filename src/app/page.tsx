'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Zap,
  Video,
  TrendingUp,
  Globe,
  Shield,
  Play,
  ChevronDown,
  Check,
  Star,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react'
import Link from 'next/link'

// Datos de features
const features = [
  {
    icon: Sparkles,
    title: 'Generacion con IA',
    description: 'GPT-4o genera guiones virales optimizados para cada plataforma automaticamente.',
  },
  {
    icon: Zap,
    title: 'Un Solo Clic',
    description: 'Escribe un tema y obtiene video completo con subtitulos, musica y efectos.',
  },
  {
    icon: Video,
    title: 'Multi-Plataforma',
    description: 'Exporta en formato perfecto para TikTok, Instagram Reels y YouTube Shorts.',
  },
  {
    icon: TrendingUp,
    title: 'Detector de Tendencias',
    description: 'IA analiza tendencias en tiempo real para maximizar tu alcance viral.',
  },
  {
    icon: Globe,
    title: 'Multi-Idioma',
    description: 'Genera contenido en mas de 30 idiomas con voces naturales de ElevenLabs.',
  },
  {
    icon: Shield,
    title: 'Libre de Copyright',
    description: 'Toda la musica y assets generados son 100% libres de derechos de autor.',
  },
]

// Pasos
const steps = [
  {
    number: '01',
    title: 'Elige tu Tema',
    description: 'Escribe un tema, pega un enlace o sube contenido. La IA se encarga del resto.',
  },
  {
    number: '02',
    title: 'IA Genera Todo',
    description: 'Guion, voz, subtitulos, musica y efectos visuales generados automaticamente.',
  },
  {
    number: '03',
    title: 'Publica y Crece',
    description: 'Descarga o publica directamente. Analiza resultados y optimiza tu contenido.',
  },
]

// Planes de precios
const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mes',
    description: 'Perfecto para probar la plataforma',
    features: [
      '3 videos por mes',
      'Duracion max 30s',
      'Marca de agua',
      '1 idioma',
      'Soporte por email',
    ],
    cta: 'Empezar Gratis',
    popular: false,
  },
  {
    name: 'Creator',
    price: '$15',
    period: '/mes',
    description: 'Para creadores de contenido serios',
    features: [
      '30 videos por mes',
      'Duracion max 90s',
      'Sin marca de agua',
      '10 idiomas',
      'Voces premium',
      'Detector de tendencias',
      'Soporte prioritario',
    ],
    cta: 'Comenzar Ahora',
    popular: true,
  },
  {
    name: 'Business',
    price: '$49',
    period: '/mes',
    description: 'Para equipos y agencias',
    features: [
      'Videos ilimitados',
      'Duracion ilimitada',
      'Sin marca de agua',
      '30+ idiomas',
      'Voces premium + clonacion',
      'API acceso completo',
      'Publicacion automatica',
      'Manager dedicado',
    ],
    cta: 'Contactar Ventas',
    popular: false,
  },
]

// Testimonios
const testimonials = [
  {
    name: 'Maria Garcia',
    role: 'Creadora de Contenido',
    content: 'AutoReel AI me ahorra 20 horas semanales. Mis videos ahora tienen 5x mas engagement.',
    rating: 5,
  },
  {
    name: 'Carlos Rodriguez',
    role: 'Marketing Manager',
    content: 'Increible herramienta. Generamos 50 videos al mes para nuestros clientes sin esfuerzo.',
    rating: 5,
  },
  {
    name: 'Ana Martinez',
    role: 'Emprendedora Digital',
    content: 'De 1K a 100K seguidores en 3 meses gracias al contenido viral que genera la IA.',
    rating: 5,
  },
]

// FAQ
const faqs = [
  {
    question: 'Como funciona la generacion de videos con IA?',
    answer:
      'Nuestra IA utiliza GPT-4o para crear guiones optimizados, genera voces con ElevenLabs, agrega subtitulos automaticos y compone el video final con musica y efectos. Todo en menos de 2 minutos.',
  },
  {
    question: 'Puedo usar los videos comercialmente?',
    answer:
      'Si, todos los videos generados son 100% tuyos y libres de derechos. Puedes usarlos para cualquier fin comercial sin restricciones.',
  },
  {
    question: 'Que plataformas soporta?',
    answer:
      'Exportamos en formatos optimizados para TikTok (9:16), Instagram Reels (9:16), YouTube Shorts (9:16), y tambien formatos horizontales para YouTube y Facebook.',
  },
  {
    question: 'Puedo cancelar en cualquier momento?',
    answer:
      'Si, no hay contratos. Puedes cancelar, pausar o cambiar tu plan en cualquier momento desde tu panel de control.',
  },
  {
    question: 'Necesito experiencia en edicion de video?',
    answer:
      'No, absolutamente ninguna. La IA se encarga de todo. Solo necesitas escribir un tema o idea y el sistema genera el video completo automaticamente.',
  },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AutoReel AI</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-dark-muted hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-dark-muted hover:text-white transition-colors">
                Precios
              </a>
              <a href="#faq" className="text-dark-muted hover:text-white transition-colors">
                FAQ
              </a>
              <Link href="/login" className="text-dark-muted hover:text-white transition-colors">
                Iniciar Sesion
              </Link>
              <Link href="/register" className="btn-primary text-sm">
                Empezar Gratis
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-dark-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden glass border-t border-dark-border"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-dark-muted hover:text-white">
                Features
              </a>
              <a href="#pricing" className="block text-dark-muted hover:text-white">
                Precios
              </a>
              <a href="#faq" className="block text-dark-muted hover:text-white">
                FAQ
              </a>
              <Link href="/login" className="block text-dark-muted hover:text-white">
                Iniciar Sesion
              </Link>
              <Link href="/register" className="block btn-primary text-center text-sm">
                Empezar Gratis
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Fondo con gradiente */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-dark-muted">Potenciado por GPT-4o + ElevenLabs</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Crea Videos Virales
              <br />
              <span className="gradient-text">con Inteligencia Artificial</span>
            </h1>

            <p className="text-lg sm:text-xl text-dark-muted max-w-2xl mx-auto mb-10">
              Genera videos profesionales para TikTok, Instagram Reels y YouTube Shorts en segundos.
              Sin experiencia en edicion. Solo escribe un tema.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
              >
                Crear mi Primer Video
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#how-it-works"
                className="btn-secondary flex items-center gap-2 text-lg px-8 py-4"
              >
                <Play className="w-5 h-5" />
                Ver Demo
              </a>
            </div>

            <p className="mt-6 text-sm text-dark-muted">
              Gratis para empezar - No requiere tarjeta de credito
            </p>
          </motion.div>

          {/* Typing animation mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="card-glass p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-dark-muted">AutoReel AI Studio</span>
              </div>
              <div className="bg-dark-bg rounded-xl p-6 border border-dark-border">
                <p className="text-dark-muted text-sm mb-2">Tema del video:</p>
                <p className="text-lg text-white font-mono overflow-hidden whitespace-nowrap border-r-2 border-primary-500 animate-typing">
                  &quot;5 trucos de productividad para emprendedores&quot;
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Todo lo que Necesitas para <span className="gradient-text">Crear Contenido Viral</span>
            </h2>
            <p className="text-dark-muted text-lg max-w-2xl mx-auto">
              Herramientas profesionales potenciadas por IA para automatizar todo tu flujo de
              creacion de contenido.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-glass"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-purple flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-dark-muted">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Como <span className="gradient-text">Funciona</span>
            </h2>
            <p className="text-dark-muted text-lg">Tres simples pasos para crear contenido viral</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-purple text-white text-2xl font-bold mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-dark-muted">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Planes para Cada <span className="gradient-text">Creador</span>
            </h2>
            <p className="text-dark-muted text-lg">
              Empieza gratis y escala cuando lo necesites
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`card-glass relative ${plan.popular ? 'border-primary-500 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-purple rounded-full text-xs font-medium text-white">
                    Mas Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-dark-muted text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-dark-muted">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary-400 flex-shrink-0" />
                      <span className="text-sm text-dark-muted">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center w-full py-3 rounded-xl font-medium transition-all ${
                    plan.popular
                      ? 'btn-primary'
                      : 'border border-dark-border hover:border-primary-500 text-dark-text'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-950/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Lo que Dicen Nuestros <span className="gradient-text">Creadores</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-glass"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-dark-muted mb-4">&quot;{testimonial.content}&quot;</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-dark-muted">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Preguntas <span className="gradient-text">Frecuentes</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card-glass"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-dark-muted transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 text-dark-muted"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-glass p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-accent-600/10" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Empieza a Crear Videos Virales Hoy
              </h2>
              <p className="text-dark-muted text-lg mb-8 max-w-xl mx-auto">
                Unete a miles de creadores que ya generan contenido viral con IA.
              </p>
              <Link
                href="/register"
                className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
              >
                Crear Cuenta Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">AutoReel AI</span>
              </div>
              <p className="text-dark-muted text-sm">
                Plataforma lider en creacion de videos con IA para redes sociales.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-dark-muted">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integraciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Compania</h4>
              <ul className="space-y-2 text-sm text-dark-muted">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-dark-muted">
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terminos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-dark-border text-center text-sm text-dark-muted">
            <p>&copy; 2025 AutoReel AI. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
