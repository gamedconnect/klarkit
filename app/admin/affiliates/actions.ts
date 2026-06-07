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

export async function createLinkAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from('affiliate_links').insert({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    url: formData.get('url') as string,
    category: formData.get('category') as string,
    pricing: formData.get('pricing') as string,
    is_recommended: formData.get('is_recommended') === 'true',
    use_case: formData.get('use_case') as string,
    sort_order: Number(formData.get('sort_order') ?? 0),
  });
  revalidatePath('/admin/affiliates');
  revalidatePath('/tools');
}

export async function updateLinkAction(id: string, formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from('affiliate_links').update({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    url: formData.get('url') as string,
    category: formData.get('category') as string,
    pricing: formData.get('pricing') as string,
    is_recommended: formData.get('is_recommended') === 'true',
    use_case: formData.get('use_case') as string,
    sort_order: Number(formData.get('sort_order') ?? 0),
  }).eq('id', id);
  revalidatePath('/admin/affiliates');
  revalidatePath('/tools');
}

export async function deleteLinkAction(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from('affiliate_links').delete().eq('id', id);
  revalidatePath('/admin/affiliates');
  revalidatePath('/tools');
}
