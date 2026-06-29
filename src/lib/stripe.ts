import Stripe from 'stripe'

// Cliente de Stripe (lazy initialization)
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
      apiVersion: '2025-02-24.acacia',
    })
  }
  return _stripe
}

// Alias para compatibilidad
export { getStripe as stripe }

// Configuracion de planes
export const PLANS = {
  starter: {
    name: 'Starter',
    price: 0,
    priceId: null,
    features: ['3 videos/mes', '30s max', 'Marca de agua', '1 idioma'],
    limits: {
      videosPerMonth: 3,
      maxDuration: 30,
      watermark: true,
      languages: 1,
    },
  },
  creator: {
    name: 'Creator',
    price: 15,
    priceId: process.env.STRIPE_CREATOR_PRICE_ID || 'price_creator',
    features: ['30 videos/mes', '90s max', 'Sin marca de agua', '10 idiomas', 'Voces premium', 'Tendencias'],
    limits: {
      videosPerMonth: 30,
      maxDuration: 90,
      watermark: false,
      languages: 10,
    },
  },
  business: {
    name: 'Business',
    price: 49,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID || 'price_business',
    features: ['Videos ilimitados', 'Duracion ilimitada', 'Sin marca de agua', '30+ idiomas', 'API completa', 'Manager dedicado'],
    limits: {
      videosPerMonth: -1, // ilimitado
      maxDuration: -1,
      watermark: false,
      languages: 30,
    },
  },
} as const

export type PlanType = keyof typeof PLANS

// Crear sesion de checkout
export async function createCheckoutSession(params: {
  userId: string
  email: string
  plan: PlanType
  successUrl: string
  cancelUrl: string
}) {
  const planConfig = PLANS[params.plan]
  if (!planConfig.priceId) throw new Error('Plan gratuito no requiere checkout')

  const session = await getStripe().checkout.sessions.create({
    customer_email: params.email,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: planConfig.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
      plan: params.plan,
    },
  })

  return session
}

// Crear portal de facturacion
export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

// Obtener suscripcion activa
export async function getSubscription(subscriptionId: string) {
  const subscription = await getStripe().subscriptions.retrieve(subscriptionId)
  return subscription
}

// Cancelar suscripcion
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await getStripe().subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
  return subscription
}
