'use client'

import { useState } from 'react'
import {
  Image as ImageIcon,
  Search,
  Download,
  Film,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

interface ImageResult {
  id: string
  url: string
  thumbnailUrl: string
  photographer: string
  photographerUrl: string
  alt: string
  width: number
  height: number
}

export default function ImagesPage() {
  const [query, setQuery] = useState('')
  const [images, setImages] = useState<ImageResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)

    try {
      const res = await fetch(`/api/images/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setImages(data.images || [])
    } catch {
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (url: string, alt: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${alt.replace(/\s+/g, '-').slice(0, 30)}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    } catch {
      window.open(url, '_blank')
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-primary-400" />
          Banco de Imagenes Gratis
        </h1>
        <p className="text-dark-muted mt-1">
          Busca fotos gratuitas de alta calidad para tus videos
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar imagenes... (ej: naturaleza, tecnologia, comida)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              loading={loading}
              disabled={!query.trim()}
              icon={<Search className="w-4 h-4" />}
            >
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
        </div>
      )}

      {!loading && searched && images.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="w-12 h-12 text-dark-muted mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No se encontraron imagenes</h3>
            <p className="text-sm text-dark-muted">
              Intenta con otros terminos de busqueda
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && images.length > 0 && (
        <>
          <p className="text-sm text-dark-muted">
            {images.length} resultado{images.length !== 1 ? 's' : ''} encontrado{images.length !== 1 ? 's' : ''}
          </p>
          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="break-inside-avoid group relative rounded-xl overflow-hidden border border-dark-border bg-dark-card"
              >
                <div className="relative">
                  <Image
                    src={img.thumbnailUrl}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    className="w-full h-auto object-cover"
                    unoptimized
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleDownload(img.url, img.alt)}
                      icon={<Download className="w-4 h-4" />}
                    >
                      Descargar
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<Film className="w-4 h-4" />}
                    >
                      Usar en Video
                    </Button>
                  </div>
                </div>
                {/* Credit */}
                <div className="p-2 flex items-center justify-between">
                  <a
                    href={img.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-dark-muted hover:text-primary-400 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {img.photographer}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!searched && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="w-12 h-12 text-dark-muted mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Busca imagenes gratuitas</h3>
            <p className="text-sm text-dark-muted">
              Las fotos provienen de Pexels con licencia gratuita para uso comercial
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
