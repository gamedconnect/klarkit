'use client';

import { useState, useTransition } from 'react';
import { saveSettingsAction } from './actions';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Globe, Wallet, Image as ImageIcon, Building2 } from 'lucide-react';

type Settings = {
  logo_url: string;
  company_name: string;
  eth_wallet: string;
  crypto_enabled: boolean;
};

export default function SettingsPage() {
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState<Settings>({
    logo_url: '',
    company_name: '',
    eth_wallet: '',
    crypto_enabled: false,
  });
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    fetch('/api/settings')
      .then(r => r.json())
      .then((data: Partial<Settings>) => {
        setSettings({
          logo_url: data.logo_url ?? '',
          company_name: data.company_name ?? '',
          eth_wallet: data.eth_wallet ?? '',
          crypto_enabled: data.crypto_enabled ?? false,
        });
        setLoaded(true);
      });
    return <div className="p-8 text-gray-400 text-sm">Lade Einstellungen…</div>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await saveSettingsAction(fd);
        toast.success('Einstellungen gespeichert');
      } catch { toast.error('Fehler beim Speichern'); }
    });
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-navy-DEFAULT mb-6">Einstellungen</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Marke */}
        <section className="card p-6 space-y-5">
          <div className="flex items-center gap-2 text-navy-DEFAULT font-semibold mb-1">
            <Building2 size={16} />
            Marke & Aussehen
          </div>

          <div>
            <label className="label">Firmenname</label>
            <input
              name="company_name"
              value={settings.company_name}
              onChange={e => setSettings(s => ({ ...s, company_name: e.target.value }))}
              placeholder="KlarKit"
              className="input"
            />
          </div>

          <div>
            <label className="label flex items-center gap-1.5">
              <ImageIcon size={13} /> Logo URL
            </label>
            <input
              name="logo_url"
              type="url"
              value={settings.logo_url}
              onChange={e => setSettings(s => ({ ...s, logo_url: e.target.value }))}
              placeholder="https://deine-domain.de/logo.png"
              className="input"
            />
            <p className="text-xs text-gray-400 mt-1">
              Direkte Bild-URL (PNG, SVG, WebP). Empfohlen: 200×60 px auf transparentem Hintergrund.
            </p>
            {settings.logo_url && (
              <div className="mt-3 p-3 bg-brand-lightgray rounded-xl inline-block">
                <Image
                  src={settings.logo_url}
                  alt="Logo-Vorschau"
                  width={160}
                  height={48}
                  className="h-10 w-auto object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>
        </section>

        {/* Krypto */}
        <section className="card p-6 space-y-5">
          <div className="flex items-center gap-2 text-navy-DEFAULT font-semibold mb-1">
            <Wallet size={16} />
            Krypto-Zahlung (DeFi)
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="crypto_enabled"
              value="true"
              checked={settings.crypto_enabled}
              onChange={e => setSettings(s => ({ ...s, crypto_enabled: e.target.checked }))}
              className="w-4 h-4 accent-teal-500"
            />
            <div>
              <p className="text-sm font-medium text-navy-DEFAULT">Krypto-Zahlung aktivieren</p>
              <p className="text-xs text-gray-400">Kunden können mit ETH / MetaMask bezahlen</p>
            </div>
          </label>

          <div>
            <label className="label flex items-center gap-1.5">
              <Globe size={13} /> ETH-Wallet-Adresse
            </label>
            <input
              name="eth_wallet"
              value={settings.eth_wallet}
              onChange={e => setSettings(s => ({ ...s, eth_wallet: e.target.value }))}
              placeholder="0x..."
              className="input font-mono text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              Ethereum-kompatible Adresse (ETH, Base, Polygon). Zahlungen gehen direkt an diese Adresse.
            </p>
          </div>

          {settings.eth_wallet && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 leading-relaxed">
              <strong>Hinweis:</strong> Krypto-Zahlungen sind standardmäßig manuell zu bestätigen. Nach Eingang der Transaktion im Admin unter „Bestellungen" den Status auf „Bezahlt" setzen.
            </div>
          )}
        </section>

        <button type="submit" disabled={isPending} className="btn-primary py-3 px-6">
          {isPending ? 'Speichern…' : 'Einstellungen speichern'}
        </button>
      </form>
    </div>
  );
}
