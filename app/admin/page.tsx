import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import { TrendingUp, Package, ShoppingBag, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin Dashboard' };

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    { count: totalOrders },
    { count: totalProducts },
    { count: totalCustomers },
    { data: recentOrders },
    { data: topProducts },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'paid'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_admin', false),
    supabase.from('orders').select('*, items:order_items(count)').eq('status', 'paid').order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('name, download_count, price').eq('is_active', true).order('download_count', { ascending: false }).limit(5),
  ]);

  // Calculate revenue
  const { data: revenueData } = await supabase
    .from('orders')
    .select('total')
    .eq('status', 'paid');
  const totalRevenue = revenueData?.reduce((sum, o) => sum + o.total, 0) || 0;

  const stats = [
    {
      label: 'Gesamtumsatz',
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      color: 'bg-teal-50 text-teal-600',
      href: '/admin/orders',
    },
    {
      label: 'Bestellungen',
      value: totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
      href: '/admin/orders',
    },
    {
      label: 'Produkte',
      value: totalProducts || 0,
      icon: Package,
      color: 'bg-purple-50 text-purple-600',
      href: '/admin/products',
    },
    {
      label: 'Kunden',
      value: totalCustomers || 0,
      icon: Users,
      color: 'bg-orange-50 text-orange-600',
      href: '/admin/customers',
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy-DEFAULT">Dashboard</h1>
        <Link href="/admin/products/new" className="btn-primary text-sm py-2.5">
          + Produkt erstellen
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="card p-5 hover:border-teal-DEFAULT/30 transition-all duration-200 group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={18} />
                </div>
                <ArrowUpRight size={14} className="text-gray-300 group-hover:text-teal-DEFAULT transition-colors" />
              </div>
              <p className="text-2xl font-bold text-navy-DEFAULT">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-navy-DEFAULT">Letzte Bestellungen</h2>
            <Link href="/admin/orders" className="text-sm text-teal-DEFAULT hover:text-teal-500">
              Alle ansehen
            </Link>
          </div>
          {!recentOrders || recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Noch keine Bestellungen</p>
          ) : (
            <ul className="space-y-3">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-lightgray transition-colors">
                  <div>
                    <p className="text-sm font-medium text-navy-DEFAULT">
                      {order.email}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-navy-DEFAULT">
                      {formatPrice(order.total)}
                    </p>
                    <span className="text-xs text-green-600 font-medium">Bezahlt</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top Products */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-navy-DEFAULT">Top Produkte</h2>
            <Link href="/admin/products" className="text-sm text-teal-DEFAULT hover:text-teal-500">
              Alle ansehen
            </Link>
          </div>
          {!topProducts || topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Noch keine Produkte</p>
          ) : (
            <ul className="space-y-3">
              {topProducts.map((product, i) => (
                <li key={product.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-lightgray transition-colors">
                  <span className="w-6 h-6 bg-navy-DEFAULT text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-DEFAULT truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {product.download_count} Downloads
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-navy-DEFAULT flex-shrink-0">
                    {formatPrice(product.price)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
