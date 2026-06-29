import { generateScript, generateSubtitles, suggestMusic, generateHashtags, generateStoryboard, generateColorPalette } from './openai'

// Motor de IA principal - coordina todos los servicios

// Generacion con un solo clic
export async function oneClickGenerate(params: {
  topic: string
  platform: 'tiktok' | 'reels' | 'shorts'
  duration: number
  style: string
  language: string
}) {
  const { topic, platform, duration, style, language } = params

  // Generar todos los elementos en paralelo donde sea posible
  const script = await generateScript({ topic, platform, duration, style, language })

  // Una vez tenemos el guion, generamos el resto en paralelo
  const [subtitles, music, hashtags, storyboard, colors] = await Promise.all([
    generateSubtitles(script, duration),
    suggestMusic({ topic, style, mood: style }),
    generateHashtags({ topic, platform, language }),
    generateStoryboard(script, duration),
    generateColorPalette({ topic, mood: style }),
  ])

  return {
    script,
    subtitles,
    music,
    hashtags: hashtags.hashtags || [],
    title: hashtags.title || topic,
    description: hashtags.description || '',
    storyboard: storyboard.scenes || [],
    colors,
    metadata: {
      platform,
      duration,
      style,
      language,
      generatedAt: new Date().toISOString(),
    },
  }
}

// Calcular score de viralidad
export function viralityScore(params: {
  hookStrength: number // 1-10 - que tan fuerte es el gancho
  trendAlignment: number // 1-10 - alineacion con tendencias
  emotionalImpact: number // 1-10 - impacto emocional
  ctaClarity: number // 1-10 - claridad del call to action
  pacing: number // 1-10 - ritmo del contenido
}): { score: number; grade: string; suggestions: string[] } {
  const { hookStrength, trendAlignment, emotionalImpact, ctaClarity, pacing } = params

  const weights = {
    hookStrength: 0.25,
    trendAlignment: 0.2,
    emotionalImpact: 0.25,
    ctaClarity: 0.15,
    pacing: 0.15,
  }

  const score = Math.round(
    hookStrength * weights.hookStrength * 10 +
    trendAlignment * weights.trendAlignment * 10 +
    emotionalImpact * weights.emotionalImpact * 10 +
    ctaClarity * weights.ctaClarity * 10 +
    pacing * weights.pacing * 10
  )

  let grade: string
  if (score >= 90) grade = 'S'
  else if (score >= 80) grade = 'A'
  else if (score >= 70) grade = 'B'
  else if (score >= 60) grade = 'C'
  else grade = 'D'

  const suggestions: string[] = []
  if (hookStrength < 7) suggestions.push('Mejora el hook inicial - usa una pregunta impactante o dato sorprendente')
  if (trendAlignment < 7) suggestions.push('Alinea mejor con tendencias actuales - usa sonidos o formatos trending')
  if (emotionalImpact < 7) suggestions.push('Aumenta el impacto emocional - cuenta una historia personal')
  if (ctaClarity < 7) suggestions.push('Mejora el CTA - se mas especifico sobre la accion que quieres')
  if (pacing < 7) suggestions.push('Ajusta el ritmo - mantiene cambios de escena cada 2-3 segundos')

  return { score, grade, suggestions }
}

// Analisis de sentimiento del contenido
export function sentimentAnalysis(text: string): {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  emotions: { emotion: string; score: number }[]
} {
  // Analisis basico de sentimiento por palabras clave
  const positiveWords = ['increible', 'genial', 'excelente', 'mejor', 'facil', 'rapido', 'gratis', 'nuevo', 'secreto', 'truco']
  const negativeWords = ['malo', 'terrible', 'error', 'problema', 'dificil', 'caro', 'peor', 'nunca', 'imposible']

  const words = text.toLowerCase().split(/\s+/)
  let positiveCount = 0
  let negativeCount = 0

  words.forEach((word) => {
    if (positiveWords.some((pw) => word.includes(pw))) positiveCount++
    if (negativeWords.some((nw) => word.includes(nw))) negativeCount++
  })

  const total = positiveCount + negativeCount || 1
  let sentiment: 'positive' | 'negative' | 'neutral'
  let confidence: number

  if (positiveCount > negativeCount) {
    sentiment = 'positive'
    confidence = positiveCount / total
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative'
    confidence = negativeCount / total
  } else {
    sentiment = 'neutral'
    confidence = 0.5
  }

  return {
    sentiment,
    confidence: Math.round(confidence * 100) / 100,
    emotions: [
      { emotion: 'curiosidad', score: text.includes('?') ? 0.8 : 0.3 },
      { emotion: 'urgencia', score: text.includes('!') ? 0.7 : 0.2 },
      { emotion: 'sorpresa', score: positiveCount > 2 ? 0.6 : 0.2 },
    ],
  }
}

// Optimizador de engagement
export function engagementOptimizer(params: {
  platform: 'tiktok' | 'reels' | 'shorts'
  duration: number
  hasHook: boolean
  hasSubtitles: boolean
  hasMusic: boolean
  hasCTA: boolean
  postTime?: string
}): { score: number; tips: string[] } {
  let score = 50 // Base score
  const tips: string[] = []

  // Duracion optima por plataforma
  const optimalDuration = {
    tiktok: { min: 15, max: 60 },
    reels: { min: 15, max: 90 },
    shorts: { min: 15, max: 60 },
  }

  const optimal = optimalDuration[params.platform]
  if (params.duration >= optimal.min && params.duration <= optimal.max) {
    score += 15
  } else {
    tips.push(`Duracion optima para ${params.platform}: ${optimal.min}-${optimal.max}s`)
  }

  if (params.hasHook) {
    score += 15
  } else {
    tips.push('Agrega un hook en los primeros 3 segundos')
  }

  if (params.hasSubtitles) {
    score += 10
  } else {
    tips.push('Los subtitulos aumentan 40% la retencion')
  }

  if (params.hasMusic) {
    score += 5
  } else {
    tips.push('Agrega musica de fondo para mayor engagement')
  }

  if (params.hasCTA) {
    score += 5
  } else {
    tips.push('Incluye un call-to-action claro al final')
  }

  // Bonus por hora de publicacion optima
  if (params.postTime) {
    const hour = parseInt(params.postTime.split(':')[0])
    if ((hour >= 7 && hour <= 9) || (hour >= 18 && hour <= 21)) {
      score += 5
      tips.push('Excelente hora de publicacion')
    } else {
      tips.push('Mejor horario: 7-9am o 6-9pm')
    }
  }

  return { score: Math.min(score, 100), tips }
}
