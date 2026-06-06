import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate, formatPrice } from '@/lib/utils';
import { Download, ExternalLink, Clock, Package } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Meine Downloads' };

export default async function DownloadsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: orderItems } = await supabase
    .from('order_items')
    .select(`
      *,
      order:orders!inner(status, created_at, user_id),
      product:products(name, slug, images, short_description)
    `)
    .eq('order.user_id', user.id)
    .eq('order.status', 'paid')
    .order('created_at', { ascending: false });

  return (
    <div className="pt-20 min-h-screen bg-brand-lightgray">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-teal-DEFAULT/10 rounded-xl flex items-center justify-center">
            <Download size={20} className="text-teal-DEFAULT" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-DEFAULT">
              Meine Downloads
            </h1>
            <p className="text-sm text-gray-500">
              {orderItems?.length || 0} digitale Produkte
            </p>
          </div>
        </div>

        {!orderItems || orderItems.length === 0 ? (
          <div className="card p-12 text-center">
            <Package size={40} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-navy-DEFAULT mb-2">
              Noch keine Downloads
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Nach deinem ersten Kauf findest du hier alle deine digitalen Produkte.
            </p>
            <Link href="/products" className="btn-primary">
              Produkte entdecken
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orderItems.map((item) => {
              const isExpired =
                item.download_expires_at &&
                new Date(item.download_expires_at) < new Date();

              return (
                <div key={item.id} className="card p-5 flex gap-5">
                  {/* Image placeholder */}
                  <div className="w-16 h-16 bg-brand-lightgray rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Download size={20} className="text-gray-300" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-navy-DEFAULT">
                          {item.product_name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Gekauft am {formatDate(item.order?.created_at || item.created_at)}
                        </p>
                        {item.download_expires_at && (
                          <div className="flex items-center gap-1 mt-1">
                            <Clock size={10} className={isExpired ? 'text-red-400' : 'text-gray-400'} />
                            <span className={`text-xs ${isExpired ? 'text-red-400' : 'text-gray-400'}`}>
                              {isExpired
                                ? 'Download-Link abgelaufen'
                                : `Gültig bis ${formatDate(item.download_expires_at)}`}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {isExpired ? (
                          <span className="text-xs text-red-400 font-medium">Abgelaufen</span>
                        ) : item.download_url ? (
                          <a
                            href={item.download_url}
                            className="btn-primary text-sm py-2 px-4"
                          >
                            <Download size={14} />
                            Download
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Kein Download verfügbar
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
