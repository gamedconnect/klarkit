import Link from 'next/link';
import { Mail, Twitter, Linkedin, Instagram } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'Alle Produkte', href: '/products' },
    { label: 'Vorlagen', href: '/products?category=templates' },
    { label: 'Guides & E-Books', href: '/products?category=guides' },
    { label: 'Mini-Kurse', href: '/products?category=courses' },
    { label: 'Tool-Empfehlungen', href: '/tools' },
    { label: 'Bestseller', href: '/products?featured=true' },
  ],
  company: [
    { label: 'Über KlarKit', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Kontakt', href: '/about#contact' },
    { label: 'FAQ', href: '/about#faq' },
  ],
  legal: [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
    { label: 'AGB', href: '/agb' },
    { label: 'Widerruf', href: '/agb#widerruf' },
  ],
  account: [
    { label: 'Mein Konto', href: '/account' },
    { label: 'Meine Bestellungen', href: '/account/orders' },
    { label: 'Meine Downloads', href: '/account/downloads' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-DEFAULT text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-teal-DEFAULT rounded-lg flex items-center justify-center">
                <span className="text-navy-DEFAULT font-bold text-sm">K</span>
              </div>
              <span className="text-xl font-bold text-white">
                Klar<span className="text-teal-DEFAULT">Kit</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-6 max-w-xs">
              Digitale Vorlagen, Guides und Tool-Empfehlungen für Selbstständige,
              Creator und Online-Business-Starter. Sofort nutzbar. Klar erklärt.
            </p>
            <p className="text-xs text-teal-DEFAULT font-medium mb-4">
              Digitale Lösungen. Klar empfohlen. Sofort nutzbar.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Mail, href: 'mailto:hallo@klarkit.de', label: 'E-Mail' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-teal-DEFAULT hover:text-navy-DEFAULT transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-teal-DEFAULT transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Unternehmen
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-teal-DEFAULT transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 mt-8">
              Konto
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.account.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-teal-DEFAULT transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Rechtliches
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-teal-DEFAULT transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Newsletter Hint */}
            <div className="mt-8 p-4 bg-white/5 rounded-xl">
              <p className="text-xs text-gray-400 leading-relaxed">
                Affiliate-Hinweis: Einige Links sind Affiliate-Links. Für dich
                entstehen dadurch keine Mehrkosten.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} KlarKit. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              🔒 SSL-verschlüsselt
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">DSGVO-konform</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">Made in Germany</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
