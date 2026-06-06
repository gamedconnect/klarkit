'use client';

import { useCartStore } from '@/store/cartStore';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } =
    useCartStore();
  const total = getTotalPrice();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-navy-DEFAULT" />
            <h2 className="text-lg font-bold text-navy-DEFAULT">
              Warenkorb
            </h2>
            {items.length > 0 && (
              <span className="px-2 py-0.5 bg-teal-DEFAULT text-white text-xs font-bold rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-lightgray transition-colors duration-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
              <div className="w-16 h-16 bg-brand-lightgray rounded-2xl flex items-center justify-center">
                <ShoppingCart size={28} className="text-gray-300" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-brand-darkgray">
                  Dein Warenkorb ist leer
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Entdecke unsere digitalen Produkte
                </p>
              </div>
              <button onClick={closeCart}>
                <Link
                  href="/products"
                  className="btn-primary text-sm"
                  onClick={closeCart}
                >
                  Produkte entdecken
                </Link>
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 px-6">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="py-4 flex gap-4">
                  {/* Image */}
                  <div className="w-16 h-16 bg-brand-lightgray rounded-xl overflow-hidden flex-shrink-0">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart size={20} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-DEFAULT truncate">
                      {product.name}
                    </p>
                    <p className="text-sm font-bold text-teal-DEFAULT mt-0.5">
                      {formatPrice(product.price)}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(product.id, quantity - 1)
                        }
                        className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-brand-lightgray transition-colors duration-150"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(product.id, quantity + 1)
                        }
                        className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-brand-lightgray transition-colors duration-150"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Zwischensumme</span>
              <span className="text-lg font-bold text-navy-DEFAULT">
                {formatPrice(total)}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Sofortiger Zugang nach Zahlung. Keine Versandkosten.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center"
            >
              Zur Kasse
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn-ghost w-full justify-center text-sm"
            >
              Warenkorb ansehen
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
