'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Shield, Lock, CreditCard, ArrowLeft, Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

type PaymentMethod = 'stripe' | 'crypto';
type CryptoStep = 'idle' | 'connecting' | 'confirm' | 'sending' | 'done';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      isMetaMask?: boolean;
    };
  }
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [cryptoStep, setCryptoStep] = useState<CryptoStep>('idle');
  const [ethRate, setEthRate] = useState<number | null>(null);
  const [ethWallet, setEthWallet] = useState<string>('');
  const [cryptoEnabled, setCryptoEnabled] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [form, setForm] = useState({ email: '', full_name: '' });

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then((s) => {
      setEthWallet(s.eth_wallet ?? '');
      setCryptoEnabled(s.crypto_enabled === true || s.crypto_enabled === 'true');
    });
  }, []);

  useEffect(() => {
    if (paymentMethod === 'crypto' && !ethRate) {
      fetch('/api/crypto/rate').then(r => r.json()).then(d => setEthRate(d.rate));
    }
  }, [paymentMethod, ethRate]);

  const ethAmount = ethRate && total ? (total / ethRate).toFixed(6) : null;

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
          email: form.email,
          full_name: form.full_name,
          coupon_code: couponCode || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fehler beim Checkout');
      if (data.url) window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Fehler beim Checkout');
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoConnect = async () => {
    if (!window.ethereum) {
      toast.error('Kein Web3-Wallet gefunden. Bitte MetaMask installieren.');
      return;
    }
    if (!form.email || !form.full_name) {
      toast.error('Bitte zuerst E-Mail und Name ausfüllen.');
      return;
    }
    setCryptoStep('connecting');
    try {
      const accounts = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as string[];
      setConnectedAddress(accounts[0]);
      setCryptoStep('confirm');
    } catch {
      toast.error('Wallet-Verbindung abgebrochen.');
      setCryptoStep('idle');
    }
  };

  const handleCryptoPay = async () => {
    if (!ethAmount || !ethWallet || !connectedAddress) return;
    setCryptoStep('sending');
    try {
      const weiHex = '0x' + BigInt(Math.round(parseFloat(ethAmount) * 1e18)).toString(16);
      const hash = (await window.ethereum!.request({
        method: 'eth_sendTransaction',
        params: [{ from: connectedAddress, to: ethWallet, value: weiHex }],
      })) as string;

      setTxHash(hash);

      const res = await fetch('/api/checkout/crypto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          full_name: form.full_name,
          items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
          tx_hash: hash,
          wallet_from: connectedAddress,
          amount_eth: ethAmount,
          amount_eur: total,
        }),
      });

      if (res.ok) {
        setCryptoStep('done');
        clearCart();
      } else {
        throw new Error('Bestellung konnte nicht gespeichert werden.');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Transaktion fehlgeschlagen.');
      setCryptoStep('confirm');
    }
  };

  if (items.length === 0 && cryptoStep !== 'done') {
    return (
      <div className="pt-20 min-h-screen bg-brand-lightgray flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy-DEFAULT mb-4">Dein Warenkorb ist leer</h2>
          <Link href="/products" className="btn-primary">Produkte entdecken</Link>
        </div>
      </div>
    );
  }

  if (cryptoStep === 'done') {
    return (
      <div className="pt-20 min-h-screen bg-brand-lightgray flex items-center justify-center px-4">
        <div className="card p-10 max-w-md text-center">
          <CheckCircle size={48} className="text-teal-DEFAULT mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-navy-DEFAULT mb-2">Zahlung eingegangen!</h1>
          <p className="text-gray-500 text-sm mb-4">
            Wir haben deine Transaktion erhalten und aktivieren deine Downloads sobald sie bestätigt ist.
          </p>
          {txHash && (
            <p className="text-xs text-gray-400 font-mono break-all bg-brand-lightgray rounded-lg p-3 mb-6">
              TX: {txHash}
            </p>
          )}
          <Link href="/account" className="btn-primary">Zum Konto</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-lightgray">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-DEFAULT transition-colors">
            <ArrowLeft size={14} /> Zurück zum Warenkorb
          </Link>
          <div className="flex-1 flex items-center justify-center gap-2">
            <Lock size={14} className="text-teal-DEFAULT" />
            <span className="text-sm text-gray-500">Sicherer Checkout – SSL-verschlüsselt</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="card p-6 md:p-8">
              <h1 className="text-xl font-bold text-navy-DEFAULT mb-6">Deine Angaben</h1>

              <div className="space-y-5 mb-6">
                <div>
                  <label className="label">E-Mail-Adresse *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="deine@email.de"
                    className="input"
                  />
                  <p className="text-xs text-gray-400 mt-1">Download-Link wird an diese Adresse gesendet</p>
                </div>
                <div>
                  <label className="label">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
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
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="GUTSCHEINCODE"
                      className="input flex-1"
                    />
                    <button type="button" className="px-4 py-3 bg-brand-lightgray text-navy-DEFAULT font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm">
                      Einlösen
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-navy-DEFAULT mb-4">Zahlung</h2>

                {/* Payment method selector */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe')}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      paymentMethod === 'stripe'
                        ? 'border-teal-DEFAULT bg-teal-50 text-teal-600'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard size={16} />
                    Karte / PayPal
                  </button>
                  {cryptoEnabled && ethWallet && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('crypto')}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        paymentMethod === 'crypto'
                          ? 'border-teal-DEFAULT bg-teal-50 text-teal-600'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Wallet size={16} />
                      Krypto (ETH)
                    </button>
                  )}
                </div>

                {/* Stripe */}
                {paymentMethod === 'stripe' && (
                  <form onSubmit={handleStripeSubmit}>
                    <div className="p-4 bg-brand-lightgray rounded-xl flex items-center gap-3 mb-4">
                      <CreditCard size={20} className="text-teal-DEFAULT" />
                      <div>
                        <p className="text-sm font-semibold text-navy-DEFAULT">Sichere Zahlung via Stripe</p>
                        <p className="text-xs text-gray-500">Kreditkarte, PayPal, SEPA, Sofortüberweisung</p>
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base">
                      {loading ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Weiterleitung…</>
                      ) : (
                        <><Lock size={16} /> Jetzt bezahlen – {formatPrice(total)}</>
                      )}
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
                      Mit dem Kauf stimmst du unseren{' '}
                      <Link href="/agb" className="text-teal-DEFAULT hover:underline">AGB</Link> zu.
                      Digitale Produkte sind vom Widerrufsrecht ausgeschlossen (§ 356 Abs. 5 BGB).
                    </p>
                  </form>
                )}

                {/* Crypto */}
                {paymentMethod === 'crypto' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-brand-lightgray rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet size={18} className="text-teal-DEFAULT" />
                        <p className="text-sm font-semibold text-navy-DEFAULT">Zahlung mit ETH (MetaMask)</p>
                      </div>
                      {ethAmount ? (
                        <p className="text-2xl font-bold text-navy-DEFAULT">
                          {ethAmount} ETH
                          <span className="text-sm text-gray-400 font-normal ml-2">≈ {formatPrice(total)}</span>
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">Kurs wird geladen…</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">Kurs wird live von CoinGecko abgerufen</p>
                    </div>

                    {cryptoStep === 'idle' && (
                      <button onClick={handleCryptoConnect} className="btn-primary w-full justify-center py-4 text-base">
                        <Wallet size={16} /> Mit MetaMask verbinden
                      </button>
                    )}

                    {cryptoStep === 'connecting' && (
                      <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500">
                        <span className="w-4 h-4 border-2 border-gray-300 border-t-teal-DEFAULT rounded-full animate-spin" />
                        Verbinde Wallet…
                      </div>
                    )}

                    {cryptoStep === 'confirm' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-center gap-2">
                          <CheckCircle size={13} />
                          Verbunden: {connectedAddress.slice(0, 6)}…{connectedAddress.slice(-4)}
                        </div>
                        <button onClick={handleCryptoPay} disabled={!ethAmount} className="btn-primary w-full justify-center py-4 text-base">
                          <Wallet size={16} /> {ethAmount ? `${ethAmount} ETH senden` : 'Lade Kurs…'}
                        </button>
                      </div>
                    )}

                    {cryptoStep === 'sending' && (
                      <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500">
                        <span className="w-4 h-4 border-2 border-gray-300 border-t-teal-DEFAULT rounded-full animate-spin" />
                        Transaktion wird gesendet…
                      </div>
                    )}

                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 flex gap-2">
                      <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                      Krypto-Zahlungen werden manuell bestätigt. Downloads werden nach Eingang der Transaktion freigeschaltet.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-6">
              <h2 className="font-bold text-navy-DEFAULT mb-5">Bestellübersicht</h2>
              <ul className="space-y-4 mb-5">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-brand-lightgray rounded-lg overflow-hidden flex-shrink-0">
                      {product.images?.[0] && (
                        <Image src={product.images[0]} alt={product.name} width={48} height={48} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-DEFAULT truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">× {quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-navy-DEFAULT flex-shrink-0">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-100 pt-4 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Zwischensumme</span>
                  <span className="text-sm font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Versand</span>
                  <span className="text-sm text-teal-DEFAULT font-medium">Kostenlos</span>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="font-bold text-navy-DEFAULT">Gesamt</span>
                  <span className="text-lg font-bold text-navy-DEFAULT">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div className="card p-4 bg-brand-lightgray border-0">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} className="text-teal-DEFAULT" />
                <p className="text-sm font-semibold text-navy-DEFAULT">Käuferschutz</p>
              </div>
              <ul className="space-y-1.5">
                {['SSL-Verschlüsselung', 'DSGVO-konform', 'Sichere Zahlung via Stripe', 'Sofortiger Zugang nach Zahlung'].map(item => (
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
