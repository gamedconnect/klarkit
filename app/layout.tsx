import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: {
    default: 'KlarKit – Digitale Lösungen. Klar empfohlen. Sofort nutzbar.',
    template: '%s | KlarKit',
  },
  description:
    'Entdecke sofort nutzbare Vorlagen, Guides und geprüfte Tool-Empfehlungen für mehr Klarheit, Produktivität und Wachstum.',
  keywords: [
    'digitale Vorlagen',
    'Guides',
    'Online Business',
    'Produktivität',
    'Notion Templates',
    'Freelancer Tools',
    'KlarKit',
  ],
  authors: [{ name: 'KlarKit' }],
  creator: 'KlarKit',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: '/',
    siteName: 'KlarKit',
    title: 'KlarKit – Digitale Lösungen. Klar empfohlen. Sofort nutzbar.',
    description:
      'Sofort einsetzbare digitale Vorlagen, Guides und Tool-Empfehlungen für Selbstständige, Creator und Online-Business-Starter.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KlarKit – Digitale Lösungen',
    description:
      'Sofort einsetzbare digitale Vorlagen, Guides und Tool-Empfehlungen.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <Header />
        <CartDrawer />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#102A43',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#2EC4B6', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}
