import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, email, full_name, coupon_code } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Keine Artikel im Warenkorb' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: 'E-Mail-Adresse erforderlich' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Fetch products from DB
    const productIds = items.map((i: { product_id: string }) => i.product_id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, images, slug, type')
      .in('id', productIds)
      .eq('is_active', true);

    if (productsError || !products) {
      return NextResponse.json({ error: 'Produkte nicht gefunden' }, { status: 400 });
    }

    // Apply coupon if provided
    let discount = 0;
    let couponId: string | null = null;
    if (coupon_code) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (coupon) {
        const total = products.reduce((sum, p) => {
          const item = items.find((i: { product_id: string }) => i.product_id === p.id);
          return sum + p.price * (item?.quantity || 1);
        }, 0);

        if (!coupon.expires_at || new Date(coupon.expires_at) > new Date()) {
          if (!coupon.max_uses || coupon.used_count < coupon.max_uses) {
            if (!coupon.min_order_amount || total >= coupon.min_order_amount) {
              discount =
                coupon.discount_type === 'percentage'
                  ? (total * coupon.discount_value) / 100
                  : coupon.discount_value;
              couponId = coupon.id;
            }
          }
        }
      }
    }

    // Build Stripe line items
    const lineItems = items.map((item: { product_id: string; quantity: number }) => {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) throw new Error(`Produkt ${item.product_id} nicht gefunden`);

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            images: product.images?.[0] ? [product.images[0]] : [],
            metadata: { product_id: product.id },
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal', 'sepa_debit'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: email,
      metadata: {
        email,
        full_name: full_name || '',
        coupon_id: couponId || '',
        items: JSON.stringify(
          items.map((i: { product_id: string; quantity: number }) => ({
            product_id: i.product_id,
            quantity: i.quantity,
            name: products.find((p) => p.id === i.product_id)?.name || '',
            price: products.find((p) => p.id === i.product_id)?.price || 0,
          }))
        ),
      },
      discounts: discount > 0 ? [] : [],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout`,
      invoice_creation: { enabled: true },
      locale: 'de',
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Zahlung' },
      { status: 500 }
    );
  }
}
