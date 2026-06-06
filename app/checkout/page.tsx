'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Shield, Lock, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [form, setForm] = useState({
    email: '',
    full_name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.product.id,
            quantity: i.quantity,
          })),
          email: form.email,
          full_name: form.full_name,
          coupon_code: couponCode || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Fehler beim Checkout');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Fehler beim Checkout');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-brand-lightgray flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy-DEFAULT mb-4">
            Dein Warenkorb ist leer
          </h2>
          <Link href="/products" className="btn-primary">
            Produkte entdecken
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-lightgray">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-DEFAULT transition-colors"
          >
            <ArrowLeft size={14} />
            Zurück zum Warenkorb
          </Link>
          <div className="flex-1 flex items-center justify-center gap-2">
            <Lock size={14} className="text-teal-DEFAULT" />
            <span className="text-sm text-gray-500">
              Sicherer Checkout – SSL-verschlüsselt
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="card p-6 md:p-8">
              <h1 className="text-xl font-bold text-navy-DEFAULT mb-6">
                Deine Angaben
              </h1>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">E-Mail-Adresse *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="deine@email.de"
                    className="input"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Download-Link wird an diese Adresse gesendet
                  </p>
                </div>

                <div>
                  <label className="label">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, full_name: e.target.value }))
                    }
                    placeholder="Max Mustermann"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Gutscheincode</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder="GUTSCHEINCODE"
                      className="input flex-1"
                    />
                    <button
                      type="button"
                      className="px-4 py-3 bg-brand-lightgray text-navy-DEFAULT font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm"
                    >
                      Einlösen
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h2 className="text-lg font-bold text-navy-DEFAULT mb-4">
                    Zahlung
                  </h2>
                  <div className="p-4 bg-brand-lightgray rounded-xl flex items-center gap-3 mb-4">
                    <CreditCard size={20} className="text-teal-DEFAULT" />
                    <div>
                      <p className="text-sm font-semibold text-navy-DEFAULT">
                        Sichere Zahlung via Stripe
                      </p>
                      <p className="text-xs text-gray-500">
                        Kreditkarte, PayPal, SEPA, Sofortüberweisung
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-4 text-base"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Weiterleitung...
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        Jetzt bezahlen – {formatPrice(total)}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
                    Mit dem Kauf stimmst du unseren{' '}
                    <Link href="/agb" className="text-teal-DEFAULT hover:underline">
                      AGB
                    </Link>{' '}
                    zu. Digitale Produkte sind vom Widerrufsrecht ausgeschlossen
                    (§ 356 Abs. 5 BGB).
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-6">
              <h2 className="font-bold text-navy-DEFAULT mb-5">
                Bestellübersicht
              </h2>
              <ul className="space-y-4 mb-5">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-brand-lightgray rounded-lg overflow-hidden flex-shrink-0">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-DEFAULT truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400">× {quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-navy-DEFAULT flex-shrink-0">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Zwischensumme</span>
                  <span className="text-sm font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Versand</span>
                  <span className="text-sm text-teal-DEFAULT font-medium">
                    Kostenlos
                  </span>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="font-bold text-navy-DEFAULT">Gesamt</span>
                  <span className="text-lg font-bold text-navy-DEFAULT">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-4 bg-brand-lightgray border-0">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} className="text-teal-DEFAULT" />
                <p className="text-sm font-semibold text-navy-DEFAULT">
                  Käuferschutz
                </p>
              </div>
              <ul className="space-y-1.5">
                {[
                  'SSL-Verschlüsselung',
                  'DSGVO-konform',
                  'Sichere Zahlung via Stripe',
                  'Sofortiger Zugang nach Zahlung',
                ].map((item) => (
                  <li key={item} className="text-xs text-gray-500 flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-teal-DEFAULT rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
