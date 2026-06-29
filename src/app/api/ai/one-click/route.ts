import { NextResponse } from 'next/server'

// Respuestas mock para demo
function getMockResult(topic: string, platform: string, style: string, duration: number, language: string) {
  const lang = language === 'en' ? 'en' : 'es'

  const scripts: Record<string, string> = {
    es: `[0-3s] HOOK: "¿Sabias que el 90% de la gente no conoce esto sobre ${topic}?"

[3-10s] INTRO: Hoy te voy a contar algo que va a cambiar tu perspectiva sobre ${topic}. Presta atencion porque esto es oro puro.

[10-${Math.floor(duration * 0.7)}s] DESARROLLO:
• Punto 1: Lo que nadie te dice sobre ${topic}
• Punto 2: El error mas comun que comete la gente
• Punto 3: La estrategia que realmente funciona

[${Math.floor(duration * 0.7)}-${duration}s] CTA: Si te sirvio este video, dale like y sigue para mas contenido como este. Guarda este video para verlo despues.`,

    en: `[0-3s] HOOK: "Did you know that 90% of people don't know this about ${topic}?"

[3-10s] INTRO: Today I'm going to tell you something that will change your perspective on ${topic}.

[10-${Math.floor(duration * 0.7)}s] DEVELOPMENT:
• Point 1: What nobody tells you about ${topic}
• Point 2: The most common mistake people make
• Point 3: The strategy that actually works

[${Math.floor(duration * 0.7)}-${duration}s] CTA: If this helped you, like and follow for more content like this.`,
  }

  const hashtagsByPlatform: Record<string, string[]> = {
    tiktok: ['#fyp', '#parati', '#viral', '#trending', `#${topic.replace(/\s/g, '').slice(0, 15)}`, '#tiktokviral', '#aprendeentiktok', '#tips', '#hack', '#foryou'],
    reels: ['#reels', '#reelsinstagram', '#viral', '#explore', `#${topic.replace(/\s/g, '').slice(0, 15)}`, '#instagood', '#trending', '#content', '#creator', '#motivation'],
    shorts: ['#shorts', '#youtubeshorts', '#viral', `#${topic.replace(/\s/g, '').slice(0, 15)}`, '#trending', '#youtube', '#subscribe', '#tips', '#howto', '#learn'],
  }

  const musicSuggestions: Record<string, { genre: string; bpm: number; mood: string; suggestions: string[] }> = {
    informativo: { genre: 'Lo-fi', bpm: 85, mood: 'calmado', suggestions: ['Lofi Study Beats', 'Chill Hop Background', 'Soft Piano Ambient'] },
    humor: { genre: 'Funk/Pop', bpm: 120, mood: 'energetico', suggestions: ['Funky Background', 'Comedy Ukulele', 'Happy Claps'] },
    motivacional: { genre: 'Cinematic', bpm: 130, mood: 'epico', suggestions: ['Epic Motivation', 'Rise Up Orchestral', 'Inspirational Piano'] },
    educativo: { genre: 'Electronic', bpm: 100, mood: 'moderno', suggestions: ['Tech Corporate', 'Digital Future', 'Clean Electronic'] },
    storytelling: { genre: 'Ambient', bpm: 70, mood: 'emotivo', suggestions: ['Emotional Strings', 'Storytelling Piano', 'Dreamy Ambient'] },
    review: { genre: 'Pop', bpm: 110, mood: 'dinamico', suggestions: ['Upbeat Pop', 'Modern Vlog Music', 'Fresh Beats'] },
  }

  const subtitles = [
    { start: 0, end: 3, text: `¿Sabias esto sobre ${topic}?` },
    { start: 3, end: 7, text: 'Hoy te cuento algo increible' },
    { start: 7, end: 12, text: 'Que va a cambiar tu perspectiva' },
    { start: 12, end: 18, text: 'Lo que nadie te dice...' },
    { start: 18, end: 24, text: 'La estrategia que funciona' },
    { start: 24, end: duration, text: '¡Sigue para mas tips!' },
  ]

  return {
    script: scripts[lang] || scripts.es,
    title: `${topic} - Lo que NADIE te dice 🔥`,
    description: `Descubre los secretos sobre ${topic} que van a transformar tu forma de pensar. En este video te comparto los mejores tips y estrategias. #${platform}`,
    hashtags: hashtagsByPlatform[platform] || hashtagsByPlatform.tiktok,
    music: musicSuggestions[style] || musicSuggestions.informativo,
    subtitles,
    storyboard: [
      { start: 0, end: 3, type: 'text', description: 'Hook con texto grande animado' },
      { start: 3, end: 10, type: 'talking', description: 'Intro hablando a camara' },
      { start: 10, end: Math.floor(duration * 0.7), type: 'broll', description: 'B-roll con textos overlay' },
      { start: Math.floor(duration * 0.7), end: duration, type: 'cta', description: 'Call to action final' },
    ],
    viralityScore: Math.floor(Math.random() * 20) + 75,
    bestTimeToPost: '19:00 - 21:00',
    platform,
    duration,
  }
}

// POST - Genera TODO con un solo tema
export async function POST(request: Request) {
  try {
    const { topic, platform, duration, style, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Se requiere un tema' }, { status: 400 })
    }

    // Verificar si hay API key de OpenAI
    const apiKey = process.env.OPENAI_API_KEY
    const hasValidKey = apiKey && apiKey !== 'sk-placeholder' && apiKey.startsWith('sk-')

    if (!hasValidKey) {
      // Modo demo: simular un delay para que parezca real
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const result = getMockResult(
        topic,
        platform || 'tiktok',
        style || 'informativo',
        duration || 30,
        language || 'es'
      )

      return NextResponse.json(result)
    }

    // Modo produccion: usar OpenAI
    const { oneClickGenerate } = await import('@/lib/ai-engine')
    const result = await oneClickGenerate({
      topic,
      platform: platform || 'tiktok',
      duration: duration || 30,
      style: style || 'informativo',
      language: language || 'es',
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error en generacion one-click:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
