import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextResponse } from 'next/server'

const getUser = vi.fn()
vi.mock('@supabase/ssr', () => ({
  createServerClient: () => ({ auth: { getUser } }),
}))

import { requireApiUser } from '@/lib/api-auth'

const ENV_KEYS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'OPENAI_API_KEY',
  'REPLICATE_API_TOKEN',
  'ELEVENLABS_API_KEY',
  'ALLOW_ANONYMOUS_AI',
] as const
const saved: Record<string, string | undefined> = {}

let ipCounter = 0
function req() {
  // IP distinta en cada test para no compartir el rate limit
  ipCounter += 1
  return new Request('http://localhost/api/ai/x', {
    method: 'POST',
    headers: { 'x-forwarded-for': `10.0.0.${ipCounter}`, cookie: 'sb-test=1' },
  })
}

async function status(result: unknown) {
  return result instanceof NextResponse ? result.status : 'ok'
}

describe('requireApiUser', () => {
  beforeEach(() => {
    for (const k of ENV_KEYS) {
      saved[k] = process.env[k]
      delete process.env[k]
    }
    getUser.mockReset()
  })
  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (saved[k] === undefined) delete process.env[k]
      else process.env[k] = saved[k]
    }
  })

  describe('modo demo (sin Supabase)', () => {
    it('permite uso anonimo si no hay claves de pago', async () => {
      const r = await requireApiUser(req(), 'ai')
      expect(await status(r)).toBe('ok')
      expect(r).toMatchObject({ id: null, anonymous: true })
    })

    it('responde 503 si hay una clave de pago configurada', async () => {
      process.env.OPENAI_API_KEY = 'sk-real-looking-key'
      expect(await status(await requireApiUser(req(), 'ai'))).toBe(503)
    })

    it('ignora claves de ejemplo del .env.example', async () => {
      process.env.OPENAI_API_KEY = 'sk-your-openai-key'
      expect(await status(await requireApiUser(req(), 'ai'))).toBe('ok')
    })

    it('ALLOW_ANONYMOUS_AI=true permite el uso con clave', async () => {
      process.env.REPLICATE_API_TOKEN = 'r8_real'
      process.env.ALLOW_ANONYMOUS_AI = 'true'
      expect(await status(await requireApiUser(req(), 'ai'))).toBe('ok')
    })

    it('allowAnonymous:false responde 503', async () => {
      expect(await status(await requireApiUser(req(), 'api', { allowAnonymous: false }))).toBe(503)
    })

    it('aplica el limite por IP', async () => {
      const r = req()
      const results = []
      for (let i = 0; i < 31; i++) results.push(await status(await requireApiUser(r, 'ai')))
      expect(results.slice(0, 30).every((s) => s === 'ok')).toBe(true)
      expect(results[30]).toBe(429)
    })
  })

  describe('con Supabase configurado', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
    })

    it('responde 401 sin sesion valida', async () => {
      getUser.mockResolvedValue({ data: { user: null }, error: new Error('no session') })
      expect(await status(await requireApiUser(req(), 'ai'))).toBe(401)
    })

    it('devuelve el usuario de la sesion', async () => {
      getUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'a@x.com' } }, error: null })
      const r = await requireApiUser(req(), 'ai')
      expect(r).toEqual({ id: 'user-1', email: 'a@x.com', anonymous: false })
    })

    it('responde 401 si Supabase falla', async () => {
      getUser.mockRejectedValue(new Error('network'))
      expect(await status(await requireApiUser(req(), 'ai'))).toBe(401)
    })
  })
})
