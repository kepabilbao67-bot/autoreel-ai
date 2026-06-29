import { NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import type { PlanType } from '@/lib/stripe'

// POST - Crear sesion de checkout en Stripe
export async function POST(request: Request) {
  try {
    const { plan, userId, email } = await request.json()

    if (!plan || !userId || !email) {
      return NextResponse.json(
        { error: 'Se requiere plan, userId y email' },
        { status: 400 }
      )
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
