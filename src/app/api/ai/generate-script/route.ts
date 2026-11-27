import { NextResponse } from 'next/server'
import { generateScript } from '@/lib/openai'
import { GenerateScriptSchema } from '@/lib/validators'
import { requireApiUser } from '@/lib/api-auth'

// POST - Genera guion con GPT-4o
export async function POST(request: Request) {
  const auth = await requireApiUser(request, 'ai')
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const parsed = GenerateScriptSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const script = await generateScript(parsed.data)
    return NextResponse.json({ script })
  } catch (error) {
    console.error('Error generando guion:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
