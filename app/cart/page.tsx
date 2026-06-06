'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Shield,
  Download,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="w-20 h-20 bg-brand-lightgray rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={36} className="text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-navy-DEFAULT mb-3">
            Dein Warenkorb ist leer
          </h1>
          <p className="text-gray-500 mb-8">
            Entdecke unsere digitalen Produkte und Tools für mehr Produktivität.
          </p>
          <Link href="/products" className="btn-primary">
            Produkte entdecken
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-lightgray">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-navy-DEFAULT mb-8">
          Warenkorb
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <p className="font-semibold text-navy-DEFAULT">
                  {items.length} {items.length === 1 ? 'Artikel' : 'Artikel'}
                </p>
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  Alles entfernen
                </button>
              </div>
              <ul className="divide-y divide-gray-50">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="p-6 flex gap-5">
                    <div className="w-20 h-20 bg-brand-lightgray rounded-xl overflow-hidden flex-shrink-0">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-semibold text-navy-DEFAULT hover:text-teal-DEFAULT transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      {product.category && (
                        <p className="text-sm text-gray-400 mt-0.5">
                          {product.category.name}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-1 w-fit">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-brand-lightgray transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-brand-lightgray transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-navy-DEFAULT">
                            {formatPrice(product.price * quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(product.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy-DEFAULT transition-colors"
            >
              <ArrowLeft size={14} />
              Weiter einkaufen
            </Link>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="card p-6">
              <h2 className="text-lg font-bold text-navy-DEFAULT mb-5">
                Bestellübersicht
              </h2>
              <div className="space-y-3 mb-5">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">
                      {product.name} × {quantity}
                    </span>
                    <span className="font-medium text-navy-DEFAULT flex-shrink-0">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-bold text-navy-DEFAULT">Gesamt</span>
                  <span className="text-xl font-bold text-navy-DEFAULT">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Inkl. MwSt. · Keine Versandkosten
                </p>
              </div>
              <Link href="/checkout" className="btn-primary w-full justify-center">
                Zur Kasse
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="card p-5 bg-brand-lightgray border-0">
              <div className="flex items-start gap-3">
                <Shield size={16} className="text-teal-DEFAULT mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-navy-DEFAULT mb-1">
                    Sicherer Kauf
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    SSL-verschlüsselt. Sichere Zahlung über Stripe. DSGVO-konform.
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-5 bg-brand-lightgray border-0">
              <div className="flex items-start gap-3">
                <Download size={16} className="text-teal-DEFAULT mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-navy-DEFAULT mb-1">
                    Sofortiger Zugang
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Nach Zahlung erhältst du sofort Zugang zu deinen Downloads.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
