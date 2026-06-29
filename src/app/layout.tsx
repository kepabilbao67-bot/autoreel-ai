import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AutoReel AI - Crea Videos Virales con Inteligencia Artificial',
  description:
    'Plataforma SaaS impulsada por IA para crear videos automaticos y virales para TikTok, Instagram Reels y YouTube Shorts. Genera contenido profesional en segundos.',
  keywords: [
    'videos IA',
    'TikTok',
    'Instagram Reels',
    'YouTube Shorts',
    'automatizacion',
    'contenido viral',
    'inteligencia artificial',
    'SaaS',
  ],
  authors: [{ name: 'AutoReel AI' }],
  openGraph: {
    title: 'AutoReel AI - Crea Videos Virales con IA',
    description: 'Genera videos profesionales para redes sociales en segundos con IA.',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoReel AI - Videos Virales con IA',
    description: 'Genera videos profesionales para redes sociales en segundos.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
