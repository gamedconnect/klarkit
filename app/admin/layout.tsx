import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  BarChart3,
  Settings,
  ArrowLeft,
  FileText,
  Link2,
} from 'lucide-react';

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Produkte', href: '/admin/products', icon: Package },
  { label: 'Bestellungen', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Kunden', href: '/admin/customers', icon: Users },
  null,
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'Affiliate-Links', href: '/admin/affiliates', icon: Link2 },
  null,
  { label: 'Gutscheine', href: '/admin/coupons', icon: Tag },
  { label: 'Statistiken', href: '/admin/stats', icon: BarChart3 },
  { label: 'Einstellungen', href: '/admin/settings', icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) redirect('/');

  return (
    <div className="pt-16 min-h-screen bg-brand-lightgray flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-DEFAULT flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 text-white">
            <ArrowLeft size={14} />
            <span className="text-sm">Zurück zum Shop</span>
          </Link>
          <p className="text-white font-bold mt-4 text-lg">Admin Panel</p>
          <p className="text-gray-400 text-xs mt-0.5">KlarKit Dashboard</p>
        </div>
        <nav className="p-4 flex-1 overflow-y-auto">
          {adminNav.map((item, i) =>
            item === null ? (
              <div key={i} className="my-2 border-t border-white/10" />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 mb-1 text-sm font-medium"
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            )
          )}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
