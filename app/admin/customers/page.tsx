import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import UsersTable, { type AdminUser } from './UsersTable';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Kunden – Admin' };

export default async function CustomersPage() {
  const supabase = createClient();
  const admin = createAdminClient();

  const [
    { data: { users: authUsers } },
    { data: profiles },
    { data: orders },
  ] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 1000 }),
    supabase.from('profiles').select('id, is_admin'),
    supabase.from('orders').select('user_id, status'),
  ]);

  const orderCountMap: Record<string, number> = {};
  orders?.forEach((o) => {
    if (o.status === 'paid') {
      orderCountMap[o.user_id] = (orderCountMap[o.user_id] || 0) + 1;
    }
  });

  const users: AdminUser[] = (authUsers ?? []).map((authUser) => {
    const profile = profiles?.find((p) => p.id === authUser.id);
    return {
      id: authUser.id,
      email: authUser.email ?? '',
      full_name: (authUser.user_metadata?.full_name as string) ?? '',
      email_confirmed_at: authUser.email_confirmed_at ?? null,
      last_sign_in_at: authUser.last_sign_in_at ?? null,
      created_at: authUser.created_at,
      is_admin: profile?.is_admin ?? false,
      order_count: orderCountMap[authUser.id] ?? 0,
    };
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-DEFAULT">Kunden</h1>
          <p className="text-sm text-gray-400 mt-0.5">{users.length} registrierte User</p>
        </div>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
