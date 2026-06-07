import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const { data } = await supabase
    .from('site_settings')
    .select('key, value');

  const settings: Record<string, string | boolean> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value === 'true' ? true : row.value === 'false' ? false : row.value;
  }

  return NextResponse.json(settings, {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
  });
}
