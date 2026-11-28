import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Stripe from 'stripe'

// Supabase admin simulado: registra las actualizaciones
const updates: Array<{ table: string; values: unknown }> = []
vi.mock('@/lib/supabase', () => ({
  createSupabaseAdmin: () => ({
    from: (table: string) => ({
      update: (values: unknown) => {
        updates.push({ table, values })
        return { eq: async () => ({ error: null }) }
      },
      upsert: async () => ({ error: null }),
      select: () => ({ eq: () => ({ single: async () => ({ data: null }) }) }),
    }),
  }),
}))

import { POST } from './route'

const SECRET = 'whsec_test_secret_value'
const stripe = new Stripe('sk_test_placeholder')

function checkoutEvent(userId: string, plan: string) {
  return JSON.stringify({
    id: 'evt_1',
    object: 'event',
    type: 'checkout.session.completed',
    data: { object: { metadata: { userId, plan }, customer: 'cus_1', subscription: 'sub_1' } },
  })
}

function request(body: string, signature?: string) {
  return new Request('http://localhost/api/payments/webhook', {
    method: 'POST',
    body,
    headers: signature ? { 'stripe-signature': signature } : {},
  })
}

describe('POST /api/payments/webhook', () => {
  const original = process.env.STRIPE_WEBHOOK_SECRET
  beforeEach(() => {
    updates.length = 0
    process.env.STRIPE_WEBHOOK_SECRET = SECRET
  })
  afterEach(() => {
    process.env.STRIPE_WEBHOOK_SECRET = original
  })

  it('rechaza peticiones sin firma', async () => {
    const res = await POST(request(checkoutEvent('u1', 'business')))
    expect(res.status).toBe(400)
    expect(updates).toHaveLength(0)
  })

  it('rechaza todo si STRIPE_WEBHOOK_SECRET no esta configurado', async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET
    const body = checkoutEvent('u1', 'business')
    // Una firma calculada con secreto vacio era aceptada antes del arreglo
    const forged = stripe.webhooks.generateTestHeaderString({ payload: body, secret: '' })
    const res = await POST(request(body, forged))
    expect(res.status).toBe(503)
    expect(updates).toHaveLength(0)
  })

  it('rechaza una firma hecha con otro secreto', async () => {
    const body = checkoutEvent('u1', 'business')
    const forged = stripe.webhooks.generateTestHeaderString({ payload: body, secret: '' })
    const res = await POST(request(body, forged))
    expect(res.status).toBe(400)
    expect(updates).toHaveLength(0)
  })

  it('procesa un evento con firma valida y actualiza el plan', async () => {
    const body = checkoutEvent('u1', 'creator')
    const signature = stripe.webhooks.generateTestHeaderString({ payload: body, secret: SECRET })
    const res = await POST(request(body, signature))
    expect(res.status).toBe(200)
    expect(updates).toContainEqual({ table: 'users', values: { plan: 'creator' } })
  })
})
