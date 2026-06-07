'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht angemeldet');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) throw new Error('Kein Zugriff');
}

export async function toggleAdminAction(userId: string, isAdmin: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from('profiles').update({ is_admin: isAdmin }).eq('id', userId);
  revalidatePath('/admin/customers');
}

export async function deleteUserAction(userId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(userId);
  revalidatePath('/admin/customers');
}

export async function sendPasswordResetAction(email: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
  });
}
