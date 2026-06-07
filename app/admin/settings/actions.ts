'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht angemeldet');
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) throw new Error('Kein Zugriff');
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();

  const entries: { key: string; value: string }[] = [
    { key: 'logo_url', value: formData.get('logo_url') as string ?? '' },
    { key: 'company_name', value: formData.get('company_name') as string ?? '' },
    { key: 'eth_wallet', value: formData.get('eth_wallet') as string ?? '' },
    { key: 'crypto_enabled', value: formData.get('crypto_enabled') === 'true' ? 'true' : 'false' },
  ];

  for (const entry of entries) {
    await admin.from('site_settings').upsert(
      { key: entry.key, value: entry.value, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );
  }

  revalidatePath('/');
  revalidatePath('/admin/settings');
}
