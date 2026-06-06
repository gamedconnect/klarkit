import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Produkte verwalten' };

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-DEFAULT">Produkte</h1>
          <p className="text-sm text-gray-500 mt-1">
            {products?.length || 0} Produkte insgesamt
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-sm py-2.5">
          <Plus size={16} />
          Neues Produkt
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-brand-lightgray border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Produkt
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Kategorie
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Preis
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Downloads
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Erstellt
                </th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products?.map((product) => (
                <tr key={product.id} className="hover:bg-brand-lightgray/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-brand-lightgray">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-navy-DEFAULT text-sm">
                          {product.name}
                        </p>
                        {product.is_featured && (
                          <span className="text-[10px] text-teal-DEFAULT font-medium">
                            Bestseller
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {product.category?.name || '–'}
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <span className="text-sm font-semibold text-navy-DEFAULT">
                        {formatPrice(product.price)}
                      </span>
                      {product.original_price && (
                        <span className="text-xs text-gray-400 line-through ml-1">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {product.download_count}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`badge text-xs px-2.5 py-1 ${
                        product.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {product.is_active ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400">
                    {formatDate(product.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-brand-lightgray text-gray-400 hover:text-navy-DEFAULT transition-colors"
                        title="Im Shop ansehen"
                      >
                        <Eye size={14} />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-brand-lightgray text-gray-400 hover:text-navy-DEFAULT transition-colors"
                        title="Bearbeiten"
                      >
                        <Pencil size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!products || products.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">Noch keine Produkte</p>
              <Link href="/admin/products/new" className="btn-primary mt-4 inline-flex text-sm py-2">
                Erstes Produkt erstellen
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
