import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate, formatPrice } from '@/lib/utils';
import { Package, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Meine Bestellungen' };

const statusMap = {
  paid: { label: 'Bezahlt', classes: 'bg-green-100 text-green-700' },
  pending: { label: 'Ausstehend', classes: 'bg-yellow-100 text-yellow-700' },
  failed: { label: 'Fehlgeschlagen', classes: 'bg-red-100 text-red-700' },
  refunded: { label: 'Erstattet', classes: 'bg-gray-100 text-gray-600' },
};

export default async function OrdersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: orders } = await supabase
    .from('orders')
    .select('*, items:order_items(id, product_name, price, quantity)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="pt-20 min-h-screen bg-brand-lightgray">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/account"
            className="text-sm text-gray-500 hover:text-navy-DEFAULT flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            Konto
          </Link>
          <h1 className="text-2xl font-bold text-navy-DEFAULT">
            Meine Bestellungen
          </h1>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="card p-12 text-center">
            <Package size={40} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-navy-DEFAULT mb-2">
              Noch keine Bestellungen
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Deine Bestellungen erscheinen hier nach dem Kauf.
            </p>
            <Link href="/products" className="btn-primary">
              Produkte entdecken
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusMap[order.status as keyof typeof statusMap] || {
                label: order.status,
                classes: 'bg-gray-100 text-gray-600',
              };
              return (
                <div key={order.id} className="card overflow-hidden">
                  <div className="px-6 py-4 bg-brand-lightgray flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Bestellnummer</p>
                        <p className="text-sm font-mono font-medium text-navy-DEFAULT">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Datum</p>
                        <p className="text-sm font-medium text-navy-DEFAULT">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Gesamt</p>
                        <p className="text-sm font-bold text-navy-DEFAULT">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                    <span className={`badge text-xs px-3 py-1 ${status.classes}`}>
                      {status.label}
                    </span>
                  </div>
                  <ul className="divide-y divide-gray-50">
                    {order.items?.map((item: { id: string; product_name: string; price: number; quantity: number }) => (
                      <li key={item.id} className="px-6 py-3 flex justify-between items-center">
                        <p className="text-sm text-navy-DEFAULT">{item.product_name}</p>
                        <p className="text-sm font-medium text-gray-600">
                          {item.quantity}× {formatPrice(item.price)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  {order.status === 'paid' && (
                    <div className="px-6 py-3 border-t border-gray-50">
                      <Link
                        href="/account/downloads"
                        className="text-sm text-teal-DEFAULT hover:text-teal-500 font-medium"
                      >
                        Downloads ansehen →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
