import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/shared/ThemeProvider'

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
    <html lang="es" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
