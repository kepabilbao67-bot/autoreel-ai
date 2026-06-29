'use client'

import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Tag, Play } from 'lucide-react'

// Articulos mock del blog
const articles = [
  {
    id: '1',
    title: 'Guia Completa de Video Marketing en 2024: Estrategias que Funcionan',
    excerpt: 'Descubre las estrategias mas efectivas de video marketing para hacer crecer tu marca en redes sociales. Desde TikTok hasta YouTube Shorts, te mostramos como crear contenido viral.',
    category: 'Video Marketing',
    author: 'Maria Garcia',
    date: '2024-01-15',
    readTime: '8 min',
    image: '/blog/video-marketing.jpg',
    tags: ['marketing', 'video', 'estrategia'],
  },
  {
    id: '2',
    title: 'SEO para Videos: Como Posicionar tu Contenido en YouTube y TikTok',
    excerpt: 'Aprende las tecnicas de SEO especificas para video que te ayudaran a aparecer en los primeros resultados de busqueda y en las paginas de descubrimiento.',
    category: 'SEO',
    author: 'Carlos Lopez',
    date: '2024-01-10',
    readTime: '6 min',
    image: '/blog/seo-videos.jpg',
    tags: ['seo', 'youtube', 'tiktok'],
  },
  {
    id: '3',
    title: 'Tendencias de Contenido en Video para 2024: Lo que Viene',
    excerpt: 'Un analisis profundo de las tendencias emergentes en creacion de video: IA generativa, videos verticales, micro-contenido y mas. Preparate para el futuro.',
    category: 'Tendencias',
    author: 'Ana Martinez',
    date: '2024-01-05',
    readTime: '10 min',
    image: '/blog/tendencias.jpg',
    tags: ['tendencias', 'ia', '2024'],
  },
  {
    id: '4',
    title: 'Como Usar IA para Crear Videos Virales en Menos de 5 Minutos',
    excerpt: 'Tutorial paso a paso para usar herramientas de inteligencia artificial en la creacion de videos cortos que capturan la atencion de tu audiencia.',
    category: 'Tutorial',
    author: 'David Rodriguez',
    date: '2024-01-02',
    readTime: '5 min',
    image: '/blog/ia-videos.jpg',
    tags: ['ia', 'tutorial', 'viral'],
  },
  {
    id: '5',
    title: 'Monetizacion en Redes Sociales: De 0 a Ingresos con Video',
    excerpt: 'Estrategias probadas para monetizar tu contenido en video. Desde programas de creadores hasta patrocinios y ventas directas.',
    category: 'Monetizacion',
    author: 'Laura Sanchez',
    date: '2023-12-28',
    readTime: '7 min',
    image: '/blog/monetizacion.jpg',
    tags: ['monetizacion', 'ingresos', 'creadores'],
  },
  {
    id: '6',
    title: 'Mejores Practicas para Reels de Instagram: Guia Definitiva',
    excerpt: 'Todo lo que necesitas saber para crear Reels exitosos: formatos, duracion ideal, hooks, musica y algoritmo de Instagram.',
    category: 'Instagram',
    author: 'Pedro Jimenez',
    date: '2023-12-20',
    readTime: '9 min',
    image: '/blog/reels-guide.jpg',
    tags: ['instagram', 'reels', 'guia'],
  },
]

const categories = ['Todos', 'Video Marketing', 'SEO', 'Tendencias', 'Tutorial', 'Monetizacion', 'Instagram']

export default function BlogPage() {
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
            Blog de <span className="gradient-text">AutoReel AI</span>
          </h1>
          <p className="text-lg text-dark-muted max-w-2xl mx-auto">
            Consejos, tutoriales y tendencias sobre video marketing,
            IA y creacion de contenido para redes sociales.
          </p>
        </div>

        {/* Categorias */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full text-sm border border-dark-border text-dark-muted hover:text-white hover:border-primary-500/50 hover:bg-primary-500/10 transition-all"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articulo destacado */}
        <div className="mb-12 rounded-2xl border border-dark-border bg-dark-card overflow-hidden hover:border-primary-500/30 transition-colors">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="bg-gradient-to-br from-primary-500/20 to-accent-500/20 p-8 flex items-center justify-center min-h-[250px]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-primary-400" />
                </div>
                <p className="text-dark-muted text-sm">Articulo Destacado</p>
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className="text-xs font-medium text-primary-400 mb-2">{articles[0].category}</span>
              <h2 className="text-2xl font-bold text-white mb-3">{articles[0].title}</h2>
              <p className="text-dark-muted text-sm mb-4">{articles[0].excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-dark-muted mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(articles[0].date).toLocaleDateString('es-ES')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {articles[0].readTime}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 cursor-pointer">
                Leer mas <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Grid de articulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(1).map((article) => (
            <article
              key={article.id}
              className="rounded-xl border border-dark-border bg-dark-card overflow-hidden hover:border-primary-500/30 transition-all hover:shadow-lg hover:shadow-primary-500/5"
            >
              {/* Imagen placeholder */}
              <div className="h-40 bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center">
                <Tag className="w-8 h-8 text-primary-400/50" />
              </div>

              <div className="p-5">
                <span className="text-xs font-medium text-primary-400">{article.category}</span>
                <h3 className="text-base font-bold text-white mt-2 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-dark-muted mb-4 line-clamp-2">{article.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-dark-muted">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary-400" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
