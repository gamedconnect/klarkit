import Link from 'next/link';
import { CheckCircle, Download, Mail, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bestellung erfolgreich',
};

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <div className="pt-20 min-h-screen bg-brand-lightgray flex items-center">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-20 h-20 bg-teal-DEFAULT/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-teal-DEFAULT" />
        </div>
        <h1 className="text-3xl font-bold text-navy-DEFAULT mb-3">
          Vielen Dank für deinen Kauf!
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Deine Bestellung wurde erfolgreich abgeschlossen. Du erhältst in Kürze
          eine Bestätigung per E-Mail mit deinen Download-Links.
        </p>

        <div className="card p-6 mb-8 text-left space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-teal-DEFAULT/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail size={16} className="text-teal-DEFAULT" />
            </div>
            <div>
              <p className="font-semibold text-navy-DEFAULT text-sm">
                Bestätigung per E-Mail
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Wir senden dir eine Bestellbestätigung mit deinen Download-Links.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-teal-DEFAULT/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download size={16} className="text-teal-DEFAULT" />
            </div>
            <div>
              <p className="font-semibold text-navy-DEFAULT text-sm">
                Sofortiger Zugang
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Deine digitalen Produkte sind in deinem Konto unter "Meine Downloads"
                verfügbar.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account/downloads" className="btn-primary">
            Zu meinen Downloads
            <ArrowRight size={16} />
          </Link>
          <Link href="/products" className="btn-outline">
            Weiter einkaufen
          </Link>
        </div>
      </div>
    </div>
  );
}
