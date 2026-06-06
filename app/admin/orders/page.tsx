import { createClient } from '@/lib/supabase/server';
import { formatDate, formatPrice } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Bestellungen' };

const statusMap = {
  paid: { label: 'Bezahlt', classes: 'bg-green-100 text-green-700' },
  pending: { label: 'Ausstehend', classes: 'bg-yellow-100 text-yellow-700' },
  failed: { label: 'Fehlgeschlagen', classes: 'bg-red-100 text-red-700' },
  refunded: { label: 'Erstattet', classes: 'bg-gray-100 text-gray-600' },
};

export default async function AdminOrdersPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('*, items:order_items(id, product_name, quantity, price)')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-DEFAULT">Bestellungen</h1>
          <p className="text-sm text-gray-500 mt-1">
            {orders?.length || 0} Bestellungen insgesamt
          </p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-brand-lightgray border-b border-gray-100">
                {['ID', 'E-Mail', 'Produkte', 'Gesamt', 'Status', 'Datum'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders?.map((order) => {
                const status =
                  statusMap[order.status as keyof typeof statusMap] || {
                    label: order.status,
                    classes: 'bg-gray-100 text-gray-600',
                  };
                return (
                  <tr key={order.id} className="hover:bg-brand-lightgray/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-sm font-mono text-navy-DEFAULT">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-700">{order.email}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        {order.items?.map((item: { id: string; product_name: string; quantity: number; price: number }) => (
                          <p key={item.id} className="text-xs text-gray-600 truncate max-w-[200px]">
                            {item.quantity}× {item.product_name}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-navy-DEFAULT">
                        {formatPrice(order.total)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge text-xs px-2.5 py-1 ${status.classes}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(!orders || orders.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">Noch keine Bestellungen</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
