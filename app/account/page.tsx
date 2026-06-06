import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { Download, Package, LogOut, User, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mein Konto' };

export default async function AccountPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*, items:order_items(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3);

  const { data: downloadCount } = await supabase
    .from('order_items')
    .select('id', { count: 'exact' })
    .eq('orders.user_id', user.id);

  return (
    <div className="pt-20 min-h-screen bg-brand-lightgray">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-navy-DEFAULT">
              Mein Konto
            </h1>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <LogOut size={14} />
              Abmelden
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: Package,
              label: 'Bestellungen',
              value: recentOrders?.length || 0,
              href: '/account/orders',
              color: 'bg-blue-50 text-blue-600',
            },
            {
              icon: Download,
              label: 'Downloads',
              value: downloadCount?.length || 0,
              href: '/account/downloads',
              color: 'bg-teal-50 text-teal-600',
            },
            {
              icon: User,
              label: 'Konto seit',
              value: formatDate(user.created_at),
              href: '/account/settings',
              color: 'bg-purple-50 text-purple-600',
            },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href} className="group">
              <div className="card p-6 hover:border-teal-DEFAULT/30 transition-all duration-200">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                  <stat.icon size={18} />
                </div>
                <p className="text-2xl font-bold text-navy-DEFAULT mb-0.5">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy-DEFAULT">Letzte Bestellungen</h2>
              <Link
                href="/account/orders"
                className="text-sm text-teal-DEFAULT hover:text-teal-500 flex items-center gap-1"
              >
                Alle
                <ArrowRight size={12} />
              </Link>
            </div>
            {!recentOrders || recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Noch keine Bestellungen</p>
                <Link href="/products" className="text-sm text-teal-DEFAULT mt-2 inline-block">
                  Produkte entdecken
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {recentOrders.map((order) => (
                  <li key={order.id}>
                    <Link href={`/account/orders/${order.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-lightgray transition-colors">
                        <div>
                          <p className="text-sm font-medium text-navy-DEFAULT">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-navy-DEFAULT">
                            {new Intl.NumberFormat('de-DE', {
                              style: 'currency',
                              currency: 'EUR',
                            }).format(order.total)}
                          </p>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              order.status === 'paid'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {order.status === 'paid'
                              ? 'Bezahlt'
                              : order.status === 'pending'
                              ? 'Ausstehend'
                              : order.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Links */}
          <div className="card p-6">
            <h2 className="font-bold text-navy-DEFAULT mb-4">
              Schnellzugriff
            </h2>
            <nav className="space-y-2">
              {[
                { label: 'Meine Downloads', href: '/account/downloads', icon: Download },
                { label: 'Meine Bestellungen', href: '/account/orders', icon: Package },
                { label: 'Produkte entdecken', href: '/products', icon: ArrowRight },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-lightgray transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-lightgray rounded-lg flex items-center justify-center group-hover:bg-teal-DEFAULT/10">
                      <Icon size={14} className="text-navy-DEFAULT group-hover:text-teal-DEFAULT" />
                    </div>
                    <span className="text-sm font-medium text-navy-DEFAULT">
                      {label}
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-gray-400 group-hover:text-teal-DEFAULT group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
