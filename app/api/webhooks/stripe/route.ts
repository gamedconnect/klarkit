import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session, supabase);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createAdminClient>
) {
  try {
    const metadata = session.metadata || {};
    const email = metadata.email || session.customer_email || '';
    const items = JSON.parse(metadata.items || '[]') as Array<{
      product_id: string;
      quantity: number;
      name: string;
      price: number;
    }>;

    if (!email || items.length === 0) {
      console.error('Missing email or items in session metadata');
      return;
    }

    // Find user by email
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    const total = session.amount_total ? session.amount_total / 100 : 0;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: profile?.id || null,
        email,
        status: 'paid',
        total,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        coupon_id: metadata.coupon_id || null,
        discount_amount: 0,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return;
    }

    // Create order items with download URLs
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity,
      download_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/download?order=${order.id}&product=${item.product_id}`,
      download_expires_at: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }));

    await supabase.from('order_items').insert(orderItems);

    // Update product download count
    for (const item of items) {
      await supabase.rpc('increment_download_count', {
        product_id: item.product_id,
        amount: item.quantity,
      });
    }

    // Update coupon usage
    if (metadata.coupon_id) {
      await supabase.rpc('increment_coupon_usage', {
        coupon_id: metadata.coupon_id,
      });
    }

    console.log(`Order ${order.id} created successfully for ${email}`);
  } catch (error) {
    console.error('Error processing checkout:', error);
  }
}
