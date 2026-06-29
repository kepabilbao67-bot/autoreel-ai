'use client'

import { useState } from 'react'
import { Sparkles, Star, Crown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

// Galeria de plantillas
const categories = ['Todas', 'Educacion', 'Marketing', 'Lifestyle', 'Entretenimiento', 'Fitness', 'Comida']

const templates = [
  { id: '1', name: 'Tutorial Rapido', category: 'Educacion', description: 'Explica un concepto en 60 segundos', color: 'from-blue-500 to-cyan-500', premium: false, uses: 1240 },
  { id: '2', name: 'Producto Showcase', category: 'Marketing', description: 'Muestra tu producto con estilo', color: 'from-orange-500 to-red-500', premium: false, uses: 890 },
  { id: '3', name: 'Story Time', category: 'Entretenimiento', description: 'Narra una historia cautivadora', color: 'from-purple-500 to-pink-500', premium: true, uses: 2100 },
  { id: '4', name: 'Receta Express', category: 'Comida', description: 'Recetas en formato rapido', color: 'from-green-500 to-emerald-500', premium: false, uses: 1560 },
  { id: '5', name: 'Motivacion Diaria', category: 'Lifestyle', description: 'Frases y motivacion visual', color: 'from-yellow-500 to-orange-500', premium: false, uses: 980 },
  { id: '6', name: 'Workout Flow', category: 'Fitness', description: 'Rutinas de ejercicio dinamicas', color: 'from-red-500 to-pink-500', premium: true, uses: 760 },
  { id: '7', name: 'Tips & Tricks', category: 'Educacion', description: 'Lista de consejos practicos', color: 'from-indigo-500 to-violet-500', premium: false, uses: 2300 },
  { id: '8', name: 'Before/After', category: 'Marketing', description: 'Transformaciones visuales', color: 'from-teal-500 to-cyan-500', premium: true, uses: 1890 },
]

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('Todas')

  const filtered = activeCategory === 'Todas'
    ? templates
    : templates.filter((t) => t.category === activeCategory)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plantillas</h1>
        <p className="text-dark-muted">Elige una plantilla para empezar rapidamente</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-sm rounded-xl border transition-all ${
              activeCategory === cat
                ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                : 'border-dark-border text-dark-muted hover:border-primary-500/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de plantillas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((template) => (
          <Card key={template.id} className="!p-0 overflow-hidden">
            <div className={`h-32 bg-gradient-to-br ${template.color} relative`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white/80" />
              </div>
              {template.premium && (
                <div className="absolute top-2 right-2">
                  <Badge variant="warning" className="flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    PRO
                  </Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm">{template.name}</h3>
              <p className="text-xs text-dark-muted mt-1">{template.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-dark-muted flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {template.uses.toLocaleString()} usos
                </span>
                <Button size="sm" variant={template.premium ? 'outline' : 'primary'}>
                  {template.premium ? 'Pro' : 'Usar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
