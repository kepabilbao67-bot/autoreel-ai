'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Image as ImageIcon,
  Download,
  Type,
  Palette,
  Upload,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

const presetBackgrounds = [
  { name: 'Morado', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Oceano', value: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)' },
  { name: 'Fuego', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Noche', value: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)' },
  { name: 'Sol', value: 'linear-gradient(135deg, #F7971E 0%, #FFD200 100%)' },
  { name: 'Verde', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { name: 'Rojo', value: '#dc2626' },
  { name: 'Azul', value: '#2563eb' },
  { name: 'Negro', value: '#000000' },
  { name: 'Blanco', value: '#ffffff' },
]

export default function ThumbnailsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('Tu Titulo Aqui')
  const [fontSize, setFontSize] = useState(48)
  const [fontColor, setFontColor] = useState('#ffffff')
  const [selectedBg, setSelectedBg] = useState(presetBackgrounds[0].value)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  // Declarada antes de renderCanvas (que la usa) y memorizada con sus dependencias.
  const drawText = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!title) return
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.fillStyle = fontColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Text shadow
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2

    // Word wrap
    const words = title.split(' ')
    const lines: string[] = []
    let currentLine = ''
    const maxWidth = width * 0.8

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    lines.push(currentLine)

    const lineHeight = fontSize * 1.3
    const totalHeight = lines.length * lineHeight
    const startY = height / 2 - totalHeight / 2 + lineHeight / 2

    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, startY + i * lineHeight)
    })

    // Reset shadow
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
  }, [title, fontSize, fontColor])

  // Render canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 1280
    const height = 720
    canvas.width = width
    canvas.height = height

    // Draw background
    if (uploadedImage) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height)
        drawText(ctx, width, height)
      }
      img.src = uploadedImage
    } else {
      if (selectedBg.startsWith('linear-gradient')) {
        // Parse gradient
        const colors = selectedBg.match(/#[a-fA-F0-9]{6}/g) || ['#667eea', '#764ba2']
        const angleMatch = selectedBg.match(/(\d+)deg/)
        const angle = angleMatch ? parseInt(angleMatch[1]) : 135
        const radians = (angle - 90) * (Math.PI / 180)
        const x1 = width / 2 - (Math.cos(radians) * width) / 2
        const y1 = height / 2 - (Math.sin(radians) * height) / 2
        const x2 = width / 2 + (Math.cos(radians) * width) / 2
        const y2 = height / 2 + (Math.sin(radians) * height) / 2
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
        gradient.addColorStop(0, colors[0])
        gradient.addColorStop(1, colors[1] || colors[0])
        ctx.fillStyle = gradient
      } else {
        ctx.fillStyle = selectedBg
      }
      ctx.fillRect(0, 0, width, height)
      drawText(ctx, width, height)
    }
  }, [drawText, selectedBg, uploadedImage])


  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `thumbnail-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-primary-400" />
          Generador de Thumbnails
        </h1>
        <p className="text-dark-muted mt-1">
          Crea thumbnails atractivos para tus videos con texto personalizado
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          {/* Text input */}
          <Card>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Type className="w-4 h-4 text-primary-400" />
                  <h3 className="font-semibold text-sm">Texto</h3>
                </div>
                <Input
                  label="Titulo del thumbnail"
                  placeholder="Escribe tu titulo..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Tamano de fuente: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-dark-card rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Color del texto
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={fontColor}
                      onChange={(e) => setFontColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-dark-border cursor-pointer"
                    />
                    <span className="text-sm text-dark-muted">{fontColor}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image upload */}
          <Card>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Upload className="w-4 h-4 text-primary-400" />
                <h3 className="font-semibold text-sm">Imagen de fondo</h3>
              </div>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-dark-border rounded-xl p-4 text-center hover:border-primary-500/50 transition-colors cursor-pointer"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-dark-muted mx-auto mb-1" />
                <p className="text-xs text-dark-muted">
                  Arrastra una imagen o haz clic
                </p>
              </div>
              {uploadedImage && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => setUploadedImage(null)}
                  icon={<RefreshCw className="w-3 h-3" />}
                >
                  Quitar imagen
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Preset backgrounds */}
          <Card>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-primary-400" />
                <h3 className="font-semibold text-sm">Fondos predefinidos</h3>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {presetBackgrounds.map((bg) => (
                  <button
                    key={bg.name}
                    onClick={() => {
                      setSelectedBg(bg.value)
                      setUploadedImage(null)
                    }}
                    title={bg.name}
                    className={`w-full aspect-square rounded-lg border-2 transition-all ${
                      selectedBg === bg.value && !uploadedImage
                        ? 'border-primary-500 scale-110'
                        : 'border-dark-border hover:border-primary-500/50'
                    }`}
                    style={{ background: bg.value }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Canvas Preview */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Vista Previa</h3>
                <Button
                  onClick={handleDownload}
                  icon={<Download className="w-4 h-4" />}
                >
                  Descargar Thumbnail
                </Button>
              </div>
              <div className="rounded-xl overflow-hidden border border-dark-border">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto"
                  style={{ aspectRatio: '16/9' }}
                />
              </div>
              <p className="text-xs text-dark-muted mt-2 text-center">
                1280 x 720px - formato PNG
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
