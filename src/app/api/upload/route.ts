import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

// POST - Subir archivos a Supabase Storage
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const userId = formData.get('userId') as string | null

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'Se requiere archivo y userId' },
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
        { error: 'Tipo de archivo no permitido' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseAdmin()

    // Generar nombre unico
    const ext = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error } = await supabase.storage
      .from('assets')
      .upload(fileName, file, {
        contentType: file.type,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Obtener URL publica
    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(data.path)

    // Guardar en la tabla assets
    await supabase.from('assets').insert({
      user_id: userId,
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'audio',
      url: publicUrl,
      filename: file.name,
      size: file.size,
    })

    return NextResponse.json({ url: publicUrl, path: data.path })
  } catch (error) {
    console.error('Error subiendo archivo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
