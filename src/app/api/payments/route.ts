import { NextResponse } from 'next/server'
import { createCheckoutSession, PLANS } from '@/lib/stripe'
import { requireApiUser } from '@/lib/api-auth'
import type { PlanType } from '@/lib/stripe'

// POST - Crear sesion de checkout en Stripe
export async function POST(request: Request) {
  // userId y email salen de la sesion: el webhook sube de plan a quien figure
  // en metadata.userId, asi que no puede venir del cliente.
  const auth = await requireApiUser(request, 'api', { allowAnonymous: false })
  if (auth instanceof NextResponse) return auth

  try {
    const { plan } = await request.json()
    const userId = auth.id
    const email = auth.email

    if (!plan || !Object.prototype.hasOwnProperty.call(PLANS, plan) || plan === 'starter') {
      return NextResponse.json({ error: 'Plan no valido' }, { status: 400 })
    }
    if (!email) {
      return NextResponse.json({ error: 'La cuenta no tiene email' }, { status: 400 })
    }

    const session = await createCheckoutSession({
      userId,
      email,
      plan: plan as PlanType,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?payment=success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?payment=canceled`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creando checkout:', error)
    return NextResponse.json(
      { error: 'Error al crear sesion de pago' },
      { status: 500 }
    )
  }
}
