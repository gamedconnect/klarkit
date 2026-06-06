import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Download,
  Shield,
  Zap,
  Star,
  CheckCircle,
  FileText,
  BookOpen,
  GraduationCap,
  Wrench,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/shop/ProductCard';
import { Product } from '@/types';

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(6)
    .order('created_at', { ascending: false });
  return data || [];
}

const categories = [
  {
    icon: FileText,
    name: 'Vorlagen',
    description: 'Sofort einsetzbare Vorlagen für dein Business',
    href: '/products?category=templates',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: BookOpen,
    name: 'Guides & E-Books',
    description: 'Schritt-für-Schritt Anleitungen für schnellen Fortschritt',
    href: '/products?category=guides',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: GraduationCap,
    name: 'Mini-Kurse',
    description: 'Kompaktes Wissen für schnelle Ergebnisse',
    href: '/products?category=courses',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Wrench,
    name: 'Tool-Empfehlungen',
    description: 'Kuratierte Software für Selbstständige und Creator',
    href: '/tools',
    color: 'bg-orange-50 text-orange-600',
  },
];

const benefits = [
  {
    icon: Zap,
    title: 'Sofort nutzbar',
    description:
      'Nach dem Kauf direkt verfügbar – kein Warten, keine Installation.',
  },
  {
    icon: CheckCircle,
    title: 'Sorgfältig kuratiert',
    description:
      'Keine beliebigen Produkte, sondern geprüfte Lösungen für echte Probleme.',
  },
  {
    icon: Shield,
    title: 'Sicher kaufen',
    description: 'SSL-Verschlüsselung, DSGVO-konform, sichere Zahlungsabwicklung.',
  },
  {
    icon: Download,
    title: 'Lifetime Access',
    description: 'Einmal kaufen, unbegrenzten Zugang behalten.',
  },
];

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Freelance Designerin',
    text: 'Das Freelancer Startpaket hat mir Stunden Arbeit gespart. Ich konnte direkt loslegen und wirke auf Kunden sofort professionell.',
    rating: 5,
  },
  {
    name: 'Thomas K.',
    role: 'Content Creator',
    text: 'Der Content Planner Kit ist genau das, was ich gesucht habe. Endlich hab ich meine Planung im Griff.',
    rating: 5,
  },
  {
    name: 'Jana R.',
    role: 'Online Business Starter',
    text: 'Der Guide hat mir Klarheit gegeben, wo ich anfangen soll. Sehr empfehlenswert für Einsteiger!',
    rating: 5,
  },
];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-gradient-to-br from-navy-900 via-navy-DEFAULT to-navy-700">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-DEFAULT/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-DEFAULT/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-DEFAULT/20 rounded-full mb-6">
              <span className="w-2 h-2 bg-teal-DEFAULT rounded-full animate-pulse" />
              <span className="text-teal-400 text-sm font-medium">
                Digitale Produkte, die wirklich weiterhelfen
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
              Digitale Produkte und Tools,{' '}
              <span className="text-teal-DEFAULT">
                die dir Arbeit abnehmen.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 text-balance">
              Entdecke sofort nutzbare Vorlagen, Guides und geprüfte
              Tool-Empfehlungen für mehr Klarheit, Produktivität und Wachstum.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary text-base px-8 py-4">
                Produkte entdecken
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 text-base border border-white/20"
              >
                Tool-Empfehlungen
              </Link>
            </div>
            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-10">
              {[
                { value: '500+', label: 'Downloads' },
                { value: '50+', label: 'Produkte' },
                { value: '4.9★', label: 'Bewertung' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-teal-DEFAULT">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-brand-lightgray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Was findest du bei KlarKit?</h2>
            <p className="section-subtitle mx-auto">
              Kuratierte digitale Lösungen für Selbstständige, Creator und
              Online-Business-Starter.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="group">
                <div className="card p-6 h-full hover:border-teal-DEFAULT/30 transition-all duration-200 group-hover:-translate-y-1">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.color}`}
                  >
                    <cat.icon size={22} />
                  </div>
                  <h3 className="font-bold text-navy-DEFAULT mb-2 group-hover:text-teal-DEFAULT transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-1 mt-4 text-teal-DEFAULT text-sm font-medium">
                    Entdecken
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="section-title">Bestseller</h2>
                <p className="section-subtitle">
                  Die beliebtesten Produkte unserer Community.
                </p>
              </div>
              <Link
                href="/products?featured=true"
                className="hidden sm:flex items-center gap-2 text-teal-DEFAULT font-medium hover:gap-3 transition-all duration-200"
              >
                Alle ansehen
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="sm:hidden mt-8 text-center">
              <Link
                href="/products?featured=true"
                className="btn-outline"
              >
                Alle Bestseller ansehen
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="py-20 bg-navy-DEFAULT">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Warum KlarKit?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Statt stundenlang nach Lösungen zu suchen, findest du hier klare,
              geprüfte und sofort nutzbare Ressourcen.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-14 h-14 bg-teal-DEFAULT/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon size={24} className="text-teal-DEFAULT" />
                </div>
                <h3 className="font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-brand-lightgray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Was unsere Kunden sagen</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                  „{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-DEFAULT/20 rounded-full flex items-center justify-center">
                    <span className="text-teal-DEFAULT font-bold text-sm">
                      {t.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-navy-DEFAULT text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-4">
            Bereit, produktiver zu werden?
          </h2>
          <p className="section-subtitle mx-auto mb-8">
            Entdecke über 50 digitale Produkte und Tools, die dir helfen,
            schneller ins Handeln zu kommen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary text-base px-8 py-4">
              Jetzt entdecken
              <ArrowRight size={18} />
            </Link>
            <Link href="/about" className="btn-outline text-base px-8 py-4">
              Mehr über KlarKit
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-teal-DEFAULT">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-navy-DEFAULT mb-2">
            Bleib auf dem Laufenden
          </h2>
          <p className="text-navy-DEFAULT/70 mb-6">
            Neue Produkte, Tipps und exklusive Angebote – direkt in deinem
            Postfach.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Deine E-Mail-Adresse"
              className="flex-1 px-4 py-3 rounded-xl border-0 bg-white/90 text-navy-DEFAULT placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-DEFAULT"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-navy-DEFAULT text-white font-semibold rounded-xl hover:bg-navy-700 transition-colors duration-200"
            >
              Anmelden
            </button>
          </form>
          <p className="text-navy-DEFAULT/60 text-xs mt-3">
            Kein Spam. Jederzeit abmeldbar.
          </p>
        </div>
      </section>
    </>
  );
}
