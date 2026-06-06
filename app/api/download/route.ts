import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order');
  const productId = searchParams.get('product');

  if (!orderId || !productId) {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Verify the order item exists and is not expired
  const { data: orderItem } = await supabase
    .from('order_items')
    .select('*, order:orders(status, email)')
    .eq('order_id', orderId)
    .eq('product_id', productId)
    .single();

  if (!orderItem) {
    return NextResponse.json({ error: 'Download nicht gefunden' }, { status: 404 });
  }

  if (orderItem.order?.status !== 'paid') {
    return NextResponse.json({ error: 'Bestellung nicht bezahlt' }, { status: 403 });
  }

  if (
    orderItem.download_expires_at &&
    new Date(orderItem.download_expires_at) < new Date()
  ) {
    return NextResponse.json({ error: 'Download-Link abgelaufen' }, { status: 410 });
  }

  // Get the actual file URL from the product
  const { data: product } = await supabase
    .from('products')
    .select('file_url, name')
    .eq('id', productId)
    .single();

  if (!product?.file_url) {
    return NextResponse.json({ error: 'Datei nicht gefunden' }, { status: 404 });
  }

  // Redirect to the actual file (stored in Supabase Storage)
  return NextResponse.redirect(product.file_url);
}
