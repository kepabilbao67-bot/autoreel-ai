import OpenAI from 'openai'

// Cliente de OpenAI (lazy initialization)
let _openai: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
    })
  }
  return _openai
}

// Generar guion para video
export async function generateScript(params: {
  topic: string
  platform: 'tiktok' | 'reels' | 'shorts'
  duration: number
  style: string
  language: string
}) {
  const { topic, platform, duration, style, language } = params

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Eres un experto creador de contenido viral para ${platform}. 
        Genera guiones optimizados para engagement maximo.
        Idioma: ${language}. Estilo: ${style}. Duracion: ${duration}s.
        Formato: Hook (3s) + Desarrollo + CTA final.`,
      },
      {
        role: 'user',
        content: `Genera un guion viral sobre: ${topic}`,
      },
    ],
    temperature: 0.8,
    max_tokens: 1000,
  })

  return response.choices[0]?.message?.content || ''
}

// Generar subtitulos con timestamps
export async function generateSubtitles(script: string, duration: number) {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Genera subtitulos con timestamps para un video de ${duration} segundos.
        Formato JSON: [{"start": 0, "end": 3, "text": "..."}]
        Divide el texto en frases cortas de 5-8 palabras maximo.`,
      },
      {
        role: 'user',
        content: script,
      },
    ],
    temperature: 0.3,
    max_tokens: 2000,
  })

  const content = response.choices[0]?.message?.content || '[]'
  try {
    return JSON.parse(content)
  } catch {
    return []
  }
}

// Sugerir musica de fondo
export async function suggestMusic(params: { topic: string; style: string; mood: string }) {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Sugiere musica de fondo libre de copyright para videos.
        Responde en JSON: {"genre": "", "bpm": 0, "mood": "", "suggestions": ["..."]}`,
      },
      {
        role: 'user',
        content: `Tema: ${params.topic}, Estilo: ${params.style}, Mood: ${params.mood}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  })

  const content = response.choices[0]?.message?.content || '{}'
  try {
    return JSON.parse(content)
  } catch {
    return { genre: 'lo-fi', bpm: 90, mood: params.mood, suggestions: [] }
  }
}

// Generar hashtags, titulo y descripcion
export async function generateHashtags(params: { topic: string; platform: string; language: string }) {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Genera titulo, descripcion y hashtags virales para ${params.platform}.
        Idioma: ${params.language}.
        JSON: {"title": "", "description": "", "hashtags": ["..."]}`,
      },
      {
        role: 'user',
        content: `Tema: ${params.topic}`,
      },
    ],
    temperature: 0.8,
    max_tokens: 500,
  })

  const content = response.choices[0]?.message?.content || '{}'
  try {
    return JSON.parse(content)
  } catch {
    return { title: params.topic, description: '', hashtags: [] }
  }
}

// Detectar tendencias actuales
export async function detectTrends(params: { niche: string; platform: string }) {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Analiza las tendencias actuales en ${params.platform} para el nicho: ${params.niche}.
        JSON: {"trends": [{"topic": "", "viralScore": 0, "description": "", "suggestedAngles": [""]}]}`,
      },
      {
        role: 'user',
        content: `Dame las 5 tendencias mas virales ahora mismo para: ${params.niche}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })

  const content = response.choices[0]?.message?.content || '{"trends":[]}'
  try {
    return JSON.parse(content)
  } catch {
    return { trends: [] }
  }
}

// Analizar imagen para generar contenido basado en ella
export async function analyzeImage(imageUrl: string) {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analiza esta imagen y sugiere ideas para un video viral de redes sociales basado en ella. JSON: {"description": "", "suggestions": [""], "mood": "", "colors": [""]}',
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    max_tokens: 500,
  })

  const content = response.choices[0]?.message?.content || '{}'
  try {
    return JSON.parse(content)
  } catch {
    return { description: '', suggestions: [], mood: '', colors: [] }
  }
}

// Generar storyboard
export async function generateStoryboard(script: string, duration: number) {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Genera un storyboard detallado para un video de ${duration}s.
        JSON: {"scenes": [{"start": 0, "end": 5, "description": "", "visualType": "text|image|transition", "text": ""}]}`,
      },
      {
        role: 'user',
        content: script,
      },
    ],
    temperature: 0.6,
    max_tokens: 1500,
  })

  const content = response.choices[0]?.message?.content || '{"scenes":[]}'
  try {
    return JSON.parse(content)
  } catch {
    return { scenes: [] }
  }
}

// Generar paleta de colores
export async function generateColorPalette(params: { topic: string; mood: string }) {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Genera una paleta de colores para un video sobre "${params.topic}" con mood "${params.mood}".
        JSON: {"primary": "#hex", "secondary": "#hex", "accent": "#hex", "background": "#hex", "text": "#hex"}`,
      },
      {
        role: 'user',
        content: `Paleta para: ${params.topic}, mood: ${params.mood}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
  })

  const content = response.choices[0]?.message?.content || '{}'
  try {
    return JSON.parse(content)
  } catch {
    return { primary: '#7c3aed', secondary: '#4f46e5', accent: '#06b6d4', background: '#0a0a0f', text: '#ffffff' }
  }
}

// Adaptar contenido para plataforma especifica
export async function adaptForPlatform(params: {
  script: string
  fromPlatform: string
  toPlatform: string
}) {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Adapta el siguiente contenido de ${params.fromPlatform} a ${params.toPlatform}.
        Ajusta el tono, duracion y formato segun las mejores practicas de cada plataforma.`,
      },
      {
        role: 'user',
        content: params.script,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })

  return response.choices[0]?.message?.content || params.script
}

export default getOpenAI
