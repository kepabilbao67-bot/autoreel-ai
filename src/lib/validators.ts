import { z } from 'zod'

// Esquemas de validacion con Zod

// Esquema para login
export const LoginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
})

// Esquema para registro
export const RegisterSchema = z.object({
  name: z.string().min(2, 'Minimo 2 caracteres').max(50, 'Maximo 50 caracteres'),
  email: z.string().email('Email invalido'),
  password: z
    .string()
    .min(8, 'Minimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe incluir al menos una mayuscula')
    .regex(/[0-9]/, 'Debe incluir al menos un numero'),
})

// Esquema para perfil de usuario
export const UserProfileSchema = z.object({
  full_name: z.string().min(2).max(50).optional(),
  avatar_url: z.string().url().optional().nullable(),
  email: z.string().email().optional(),
})

// Esquema para crear video
export const CreateVideoSchema = z.object({
  topic: z.string().min(3, 'Minimo 3 caracteres').max(200, 'Maximo 200 caracteres'),
  platform: z.enum(['tiktok', 'reels', 'shorts']),
  duration: z.number().min(5).max(180),
  style: z.string().min(1, 'Selecciona un estilo'),
  language: z.string().min(2, 'Selecciona un idioma'),
  template_id: z.string().optional(),
})

// Esquema para generacion de guion
export const GenerateScriptSchema = z.object({
  topic: z.string().min(3).max(500),
  platform: z.enum(['tiktok', 'reels', 'shorts']),
  duration: z.number().min(5).max(180),
  style: z.enum(['informativo', 'humor', 'motivacional', 'educativo', 'storytelling', 'review']),
  language: z.string().default('es'),
  tone: z.string().optional(),
})

// Esquema para hashtags
export const GenerateHashtagsSchema = z.object({
  topic: z.string().min(3),
  platform: z.enum(['tiktok', 'reels', 'shorts']),
  language: z.string().default('es'),
})

// Esquema para tendencias
export const DetectTrendsSchema = z.object({
  niche: z.string().min(2),
  platform: z.enum(['tiktok', 'reels', 'shorts']),
})

// Tipos inferidos
export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type UserProfileInput = z.infer<typeof UserProfileSchema>
export type CreateVideoInput = z.infer<typeof CreateVideoSchema>
export type GenerateScriptInput = z.infer<typeof GenerateScriptSchema>
