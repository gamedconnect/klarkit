import { createClient } from '@/lib/supabase/server';
import { Header } from './Header';

export async function HeaderServer() {
  const supabase = createClient();
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'logo_url')
    .maybeSingle();

  const logoUrl = data?.value || null;
  return <Header logoUrl={logoUrl} />;
}
