import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, full_name, items, tx_hash, wallet_from, amount_eth, amount_eur } = await request.json();

  if (!email || !items?.length || !tx_hash) {
    return NextResponse.json({ error: 'Fehlende Pflichtfelder' }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: order, error: orderError } = await admin
    .from('orders')
    .insert({
      email,
      full_name,
      total: amount_eur,
      status: 'crypto_pending',
      payment_method: 'crypto_eth',
      tx_hash,
      wallet_from,
      amount_eth,
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: 'Bestellung konnte nicht erstellt werden' }, { status: 500 });
  }

  const orderItems = items.map((item: { product_id: string; quantity: number }) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: 0,
  }));

  const { data: products } = await admin
    .from('products')
    .select('id, price')
    .in('id', items.map((i: { product_id: string }) => i.product_id));

  const priceMap = Object.fromEntries((products ?? []).map(p => [p.id, p.price]));
  const itemsWithPrice = orderItems.map((i: { order_id: string; product_id: string; quantity: number; price: number }) => ({
    ...i,
    price: priceMap[i.product_id] ?? 0,
  }));

  await admin.from('order_items').insert(itemsWithPrice);

  return NextResponse.json({ order_id: order.id });
}
