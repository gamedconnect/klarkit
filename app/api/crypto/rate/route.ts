import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur',
      { next: { revalidate: 120 } }
    );
    const data = await res.json();
    const rate = data?.ethereum?.eur ?? null;
    return NextResponse.json({ rate });
  } catch {
    return NextResponse.json({ rate: null }, { status: 502 });
  }
}
