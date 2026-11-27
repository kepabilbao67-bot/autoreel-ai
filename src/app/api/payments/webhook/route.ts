import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createSupabaseAdmin } from '@/lib/supabase'
import type { PlanType } from '@/lib/stripe'

// POST - Procesar eventos de Stripe webhook
export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Sin firma' }, { status: 400 })
    }

    // Sin secreto no se puede verificar la firma. Con un secreto vacio,
    // cualquiera podria calcular una firma valida y falsificar un pago.
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET no configurado: webhook rechazado')
      return NextResponse.json({ error: 'Webhook no configurado' }, { status: 503 })
    }

    let event: ReturnType<ReturnType<typeof getStripe>['webhooks']['constructEvent']>
    try {
      event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
    } catch {
      return NextResponse.json({ error: 'Firma no valida' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan as PlanType

        if (userId && plan) {
          // Actualizar plan del usuario
          await supabase
            .from('users')
            .update({ plan })
            .eq('id', userId)

          // Crear/actualizar suscripcion
          await supabase.from('subscriptions').upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            plan,
            status: 'active',
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status as 'active' | 'canceled' | 'past_due',
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (sub) {
          await supabase
            .from('users')
            .update({ plan: 'starter' })
            .eq('id', sub.user_id)

          await supabase
            .from('subscriptions')
            .update({ status: 'canceled' })
            .eq('stripe_subscription_id', subscription.id)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error en webhook:', error)
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    )
  }
}
