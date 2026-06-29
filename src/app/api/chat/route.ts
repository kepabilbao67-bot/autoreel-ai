import OpenAI from 'openai'

// System prompt para el asistente de AutoReel AI
const SYSTEM_PROMPT = `Eres AutoReel AI Assistant, un experto en creación de contenido viral para redes sociales. Ayudas a los usuarios a crear mejores videos, dar ideas, optimizar engagement, sugerir tendencias, mejorar guiones, recomendar horarios de publicación y estrategias de crecimiento. Responde siempre en español de forma amigable y concisa. Usa emojis ocasionalmente. Si te piden crear un video, guíalos al flujo de creación. Puedes formatear con **negrita** y listas con - `

// Respuestas mock inteligentes cuando no hay API key
function getMockResponse(lastMessage: string): string {
  const msg = lastMessage.toLowerCase()

  if (msg.includes('idea') || msg.includes('contenido') || msg.includes('video de')) {
    return `🎬 **Aqui tienes 5 ideas creativas:**

- **Storytelling personal**: Cuenta una anecdota real en 60 segundos con un giro inesperado al final
- **Antes vs Despues**: Muestra una transformacion rapida (receta, outfit, espacio)
- **Tutorial express**: Ensena algo util en 30 segundos que la gente pueda aplicar ya
- **Reaccion a tendencia**: Toma un trend viral y adaptalo a tu nicho con tu toque unico
- **Detras de camaras**: Muestra el proceso de como creas algo, la gente ama la autenticidad

💡 **Tip**: Los videos con hook en los primeros 3 segundos retienen 65% mas audiencia. ¿Quieres que desarrolle alguna de estas ideas?`
  }

  if (msg.includes('horario') || msg.includes('hora') || msg.includes('publicar') || msg.includes('cuando')) {
    return `⏰ **Mejores horarios para publicar por plataforma:**

**TikTok:**
- Lunes a viernes: 7:00-9:00 AM y 7:00-9:00 PM
- Fines de semana: 10:00 AM - 12:00 PM

**Instagram Reels:**
- Martes y jueves: 11:00 AM - 1:00 PM
- Viernes: 2:00 PM - 4:00 PM

**YouTube Shorts:**
- Sabados: 9:00 AM - 11:00 AM
- Miercoles: 3:00 PM - 5:00 PM

📊 **Importante**: Estos son promedios generales. Te recomiendo revisar tus analiticas propias para encontrar cuando TU audiencia esta mas activa.`
  }

  if (msg.includes('trending') || msg.includes('tendencia') || msg.includes('viral') || msg.includes('trend')) {
    return `🔥 **Tendencias actuales en redes sociales:**

- **IA y tecnologia**: Tutoriales usando herramientas de IA, demostraciones rapidas
- **Get Ready With Me (GRWM)**: Sigue siendo fuerte, especialmente con storytelling
- **Microaprendizaje**: Tips de 15-30 segundos sobre habilidades utiles
- **Day in my life**: Vlogs autenticos de rutinas con estetica cuidada
- **Challenges musicales**: Coreografias simples con canciones nuevas

📈 **Tip pro**: No copies el trend exacto, adaptalo a tu personalidad y nicho. La originalidad dentro del trend es lo que te hace destacar.`
  }

  if (msg.includes('mejorar') || msg.includes('guion') || msg.includes('script') || msg.includes('mejor')) {
    return `✨ **Tips para mejorar tu contenido:**

- **Hook poderoso**: Los primeros 3 segundos deciden todo. Usa preguntas, datos impactantes o promesas claras
- **Ritmo rapido**: Cortes cada 2-3 segundos mantienen la atencion
- **CTA claro**: Termina siempre con una accion: seguir, comentar, guardar
- **Subtitulos**: 85% de la gente ve videos sin sonido
- **Patron de interrupcion**: Cambia angulos, usa zooms, texto en pantalla

🎯 Si quieres, pegame tu guion y te doy feedback especifico para mejorarlo.`
  }

  if (msg.includes('engagement') || msg.includes('crecer') || msg.includes('crecimiento') || msg.includes('seguidores')) {
    return `📈 **Estrategias para aumentar el engagement:**

- **Responde TODOS los comentarios** en la primera hora
- **Haz preguntas al final** de tus videos para generar comentarios
- **Publica consistentemente**: Minimo 1 video diario en TikTok, 4-5/semana en Reels
- **Usa CTAs creativos**: "Guarda esto para despues" funciona muy bien
- **Colabora**: Duets, stitches y colaboraciones multiplican tu alcance

💪 La consistencia es la clave. ¿En que plataforma quieres enfocarte?`
  }

  // Respuesta generica amable
  return `¡Hola! 👋 Soy tu asistente de AutoReel AI. Estoy aqui para ayudarte a crear contenido viral increible.

Puedo ayudarte con:
- 💡 **Ideas** para videos en cualquier nicho
- ⏰ **Horarios** optimos de publicacion
- 🔥 **Tendencias** actuales en redes sociales
- ✨ **Mejorar** tus guiones y contenido
- 📈 **Estrategias** de crecimiento

¿En que te puedo ayudar hoy?`
}

// POST - Endpoint del chatbot
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages } = body as { messages: Array<{ role: string; content: string }> }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Mensajes requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const lastMessage = messages[messages.length - 1]?.content || ''

    // Verificar si hay API key de OpenAI configurada
    const apiKey = process.env.OPENAI_API_KEY
    const hasValidKey = apiKey && apiKey !== 'sk-placeholder' && apiKey.startsWith('sk-')

    if (!hasValidKey) {
      // Modo mock: devolver respuesta predefinida con streaming simulado
      const mockResponse = getMockResponse(lastMessage)
      const encoder = new TextEncoder()

      const stream = new ReadableStream({
        async start(controller) {
          // Simular un pequeno delay para efecto de typing
          const words = mockResponse.split(' ')
          for (let i = 0; i < words.length; i++) {
            const content = words[i] + (i < words.length - 1 ? ' ' : '')
            const data = `data: ${JSON.stringify({ content })}\n\n`
            controller.enqueue(encoder.encode(data))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        },
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    // Modo real: usar OpenAI GPT-4o con streaming
    const openai = new OpenAI({ apiKey })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      ],
      temperature: 0.8,
      max_tokens: 1000,
      stream: true,
    })

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              const data = `data: ${JSON.stringify({ content })}\n\n`
              controller.enqueue(encoder.encode(data))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Error en streaming:', error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error en chat API:', error)
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
