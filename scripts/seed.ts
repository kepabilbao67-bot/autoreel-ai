/**
 * Script para insertar datos de prueba en Supabase
 * Uso: npx tsx scripts/seed.ts
 *
 * Requiere las variables de entorno:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'

// Configuracion
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

const supabase = createClient(supabaseUrl, supabaseKey)

// Datos de usuarios demo
const demoUsers = [
  {
    id: 'demo-user-001',
    email: 'maria@example.com',
    full_name: 'Maria Garcia',
    avatar_url: null,
    plan: 'creator' as const,
    videos_count: 15,
  },
  {
    id: 'demo-user-002',
    email: 'carlos@example.com',
    full_name: 'Carlos Lopez',
    avatar_url: null,
    plan: 'starter' as const,
    videos_count: 3,
  },
  {
    id: 'demo-user-003',
    email: 'empresa@example.com',
    full_name: 'Tech Solutions',
    avatar_url: null,
    plan: 'business' as const,
    videos_count: 45,
  },
]

// Datos de videos demo
const demoVideos = [
  {
    user_id: 'demo-user-001',
    title: '5 Tips de Marketing Digital para 2024',
    description: 'Los mejores consejos para crecer en redes sociales este anio',
    script: 'Intro: Hola! Hoy te traigo 5 tips que van a transformar tu estrategia de marketing...',
    status: 'completed' as const,
    platform: 'tiktok' as const,
    duration: 30,
    language: 'es',
    style: 'professional',
    views: 1250,
    likes: 89,
    shares: 23,
  },
  {
    user_id: 'demo-user-001',
    title: 'Tutorial: React Hooks en 60 segundos',
    description: 'Aprende los hooks mas usados de React en un video corto',
    script: 'Vamos a ver los 3 hooks mas importantes de React: useState, useEffect y useContext...',
    status: 'completed' as const,
    platform: 'shorts' as const,
    duration: 60,
    language: 'es',
    style: 'tutorial',
    views: 3400,
    likes: 210,
    shares: 56,
  },
  {
    user_id: 'demo-user-001',
    title: 'IA para Negocios: Guia Rapida',
    description: 'Como implementar IA en tu empresa sin ser tecnico',
    script: null,
    status: 'processing' as const,
    platform: 'reels' as const,
    duration: 45,
    language: 'es',
    style: 'casual',
    views: 0,
    likes: 0,
    shares: 0,
  },
  {
    user_id: 'demo-user-002',
    title: 'Mi primer video con AutoReel',
    description: 'Probando la plataforma de creacion automatica',
    script: 'Hola a todos! Este es mi primer video creado con inteligencia artificial...',
    status: 'completed' as const,
    platform: 'tiktok' as const,
    duration: 30,
    language: 'es',
    style: 'casual',
    views: 450,
    likes: 32,
    shares: 8,
  },
  {
    user_id: 'demo-user-003',
    title: 'Presentacion Corporativa Q4',
    description: 'Resultados del cuarto trimestre en formato video',
    script: 'En el cuarto trimestre, nuestra empresa alcanzo un crecimiento del 35%...',
    status: 'completed' as const,
    platform: 'shorts' as const,
    duration: 60,
    language: 'es',
    style: 'professional',
    views: 890,
    likes: 45,
    shares: 12,
  },
]

// Datos de templates demo
const demoTemplates = [
  {
    name: 'Marketing Viral',
    description: 'Template para crear videos de marketing con hook potente y CTA',
    category: 'marketing',
    thumbnail_url: null,
    config: { hook_style: 'question', cta_type: 'link', transitions: 'fade' },
    is_premium: false,
    usage_count: 1250,
  },
  {
    name: 'Tutorial Rapido',
    description: 'Estructura perfecta para tutoriales paso a paso en 60 segundos',
    category: 'educacion',
    thumbnail_url: null,
    config: { steps: 5, overlay: true, music: 'upbeat' },
    is_premium: false,
    usage_count: 890,
  },
  {
    name: 'Producto Showcase',
    description: 'Muestra tu producto con efectos premium y texto animado',
    category: 'ecommerce',
    thumbnail_url: null,
    config: { zoom_effect: true, text_animation: 'typewriter', bg_music: 'corporate' },
    is_premium: true,
    usage_count: 560,
  },
  {
    name: 'Storytelling Personal',
    description: 'Cuenta tu historia personal con transiciones cinematograficas',
    category: 'personal',
    thumbnail_url: null,
    config: { transitions: 'cinematic', color_grade: 'warm', pace: 'slow' },
    is_premium: true,
    usage_count: 340,
  },
  {
    name: 'Noticias y Tendencias',
    description: 'Formato de noticias rapidas con graficos y datos',
    category: 'noticias',
    thumbnail_url: null,
    config: { layout: 'news', ticker: true, graphics: 'minimal' },
    is_premium: false,
    usage_count: 720,
  },
]

async function seed() {
  console.log('🌱 Iniciando seed de datos de prueba...')
  console.log('')

  // Insertar usuarios
  console.log('👤 Insertando usuarios demo...')
  const { error: usersError } = await supabase
    .from('users')
    .upsert(demoUsers, { onConflict: 'id' })

  if (usersError) {
    console.error('  ❌ Error insertando usuarios:', usersError.message)
  } else {
    console.log(`  ✅ ${demoUsers.length} usuarios insertados`)
  }

  // Insertar videos
  console.log('🎬 Insertando videos demo...')
  const { error: videosError } = await supabase
    .from('videos')
    .insert(demoVideos)

  if (videosError) {
    console.error('  ❌ Error insertando videos:', videosError.message)
  } else {
    console.log(`  ✅ ${demoVideos.length} videos insertados`)
  }

  // Insertar templates
  console.log('📋 Insertando templates demo...')
  const { error: templatesError } = await supabase
    .from('templates')
    .upsert(demoTemplates, { onConflict: 'name' })

  if (templatesError) {
    console.error('  ❌ Error insertando templates:', templatesError.message)
  } else {
    console.log(`  ✅ ${demoTemplates.length} templates insertados`)
  }

  console.log('')
  console.log('🎉 Seed completado!')
}

seed().catch(console.error)
