import { NextResponse } from 'next/server'

// POST - Subir archivos (modo demo: simula el upload)
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'Se requiere un archivo' },
        { status: 400 }
      )
    }

    // Validar tamano (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Archivo demasiado grande (max 50MB)' },
        { status: 400 }
      )
    }

    // Validar tipo
    const allowedTypes = ['image/', 'video/', 'audio/']
    if (!allowedTypes.some((t) => file.type.startsWith(t))) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido (solo imagenes, video o audio)' },
        { status: 400 }
      )
    }

    // Verificar si Supabase esta configurado
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
      // Modo demo: simular upload exitoso
      const fakeUrl = `/uploads/${Date.now()}-${file.name}`
      return NextResponse.json({
        url: fakeUrl,
        path: fakeUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
        demo: true,
      })
    }

    // Modo produccion con Supabase
    const { createSupabaseAdmin } = await import('@/lib/supabase')
    const supabase = createSupabaseAdmin()

    const userId = formData.get('userId') as string || 'demo-user'
    const ext = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error } = await supabase.storage
      .from('assets')
      .upload(fileName, file, { contentType: file.type })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(data.path)

    return NextResponse.json({ url: publicUrl, path: data.path })
  } catch (error) {
    console.error('Error subiendo archivo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
