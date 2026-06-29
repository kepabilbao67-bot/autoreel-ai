'use client'

import { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'

// Grid de plantillas para seleccionar
interface Template {
  id: string
  name: string
  category: string
  description: string
  color: string
}

const templates: Template[] = [
  { id: '1', name: 'Educativo', category: 'educacion', description: 'Para tutoriales y tips', color: 'from-blue-500 to-cyan-500' },
  { id: '2', name: 'Motivacional', category: 'lifestyle', description: 'Frases e inspiracion', color: 'from-purple-500 to-pink-500' },
  { id: '3', name: 'Producto', category: 'marketing', description: 'Showcase de productos', color: 'from-orange-500 to-red-500' },
  { id: '4', name: 'Receta', category: 'food', description: 'Videos de cocina', color: 'from-green-500 to-emerald-500' },
  { id: '5', name: 'Fitness', category: 'health', description: 'Rutinas de ejercicio', color: 'from-red-500 to-orange-500' },
  { id: '6', name: 'Noticias', category: 'news', description: 'Breaking news style', color: 'from-indigo-500 to-blue-500' },
  { id: '7', name: 'Story Time', category: 'entertainment', description: 'Narracion de historias', color: 'from-violet-500 to-purple-500' },
  { id: '8', name: 'Review', category: 'marketing', description: 'Resenas de productos', color: 'from-amber-500 to-yellow-500' },
]

interface TemplateSelectorProps {
  onSelect?: (template: Template) => void
  selectedId?: string
}

export function TemplateSelector({ onSelect, selectedId }: TemplateSelectorProps) {
  const [category, setCategory] = useState('all')

  const categories = ['all', 'educacion', 'lifestyle', 'marketing', 'food', 'health', 'news', 'entertainment']

  const filtered = category === 'all' ? templates : templates.filter(t => t.category === category)

  return (
    <div className="space-y-4">
      {/* Filtros de categoria */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              category === cat
                ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                : 'border-dark-border text-dark-muted hover:border-primary-500/50'
            }`}
          >
            {cat === 'all' ? 'Todas' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid de plantillas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect?.(template)}
            className={`relative p-4 rounded-xl border transition-all text-left ${
              selectedId === template.id
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-dark-border hover:border-primary-500/50 bg-dark-card'
            }`}
          >
            {selectedId === template.id && (
              <div className="absolute top-2 right-2">
                <Check className="w-4 h-4 text-primary-400" />
              </div>
            )}
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center mb-2`}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-medium text-white">{template.name}</p>
            <p className="text-xs text-dark-muted mt-0.5">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
