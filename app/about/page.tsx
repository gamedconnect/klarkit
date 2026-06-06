import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle, ArrowRight, Heart, Target, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Über KlarKit',
  description:
    'Erfahre mehr über KlarKit – dein digitaler Werkzeugkasten für Vorlagen, Guides und Tool-Empfehlungen.',
};

const faqs = [
  {
    q: 'Wie erhalte ich meine gekauften Produkte?',
    a: 'Nach erfolgreicher Zahlung bekommst du sofort eine E-Mail mit deinen Download-Links. Du kannst deine Produkte auch jederzeit in deinem Konto unter "Meine Downloads" abrufen.',
  },
  {
    q: 'Welche Zahlungsarten werden akzeptiert?',
    a: 'Wir akzeptieren Kreditkarten (Visa, Mastercard), PayPal, SEPA-Lastschrift und Sofortüberweisung. Alle Zahlungen werden sicher über Stripe abgewickelt.',
  },
  {
    q: 'Kann ich ein Produkt zurückgeben?',
    a: 'Da es sich um digitale Produkte handelt, die sofort nach dem Kauf verfügbar sind, ist ein Widerruf nach § 356 Abs. 5 BGB ausgeschlossen, wenn du der Bereitstellung zugestimmt hast. Bei Problemen wende dich bitte an unseren Support.',
  },
  {
    q: 'Für welche Programme sind die Vorlagen geeignet?',
    a: 'Unsere Vorlagen sind für gängige Programme wie Notion, Google Sheets, Microsoft Excel oder Canva optimiert. Die genauen Anforderungen stehen bei jedem Produkt.',
  },
  {
    q: 'Wie lange sind meine Downloads verfügbar?',
    a: 'Deine Download-Links sind 30 Tage gültig. Danach kannst du sie über dein Konto erneuern lassen. Wenn du ein Konto erstellst, hast du unbegrenzten Zugang zu deinen Downloads.',
  },
  {
    q: 'Sind die Affiliate-Empfehlungen unabhängig?',
    a: 'Wir kennzeichnen alle Affiliate-Links transparent. Wir empfehlen nur Tools, von denen wir wirklich überzeugt sind – unabhängig davon, ob eine Provision gezahlt wird.',
  },
];

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className="bg-brand-lightgray border-b border-gray-100 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-navy-DEFAULT rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">K</span>
          </div>
          <h1 className="text-4xl font-bold text-navy-DEFAULT mb-4">
            Über KlarKit
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Digitale Lösungen. Klar empfohlen. Sofort nutzbar.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-navy-DEFAULT mb-5">
                Warum KlarKit?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                KlarKit ist entstanden aus dem Wunsch, digitale Arbeit einfacher
                zu machen. Nicht durch komplizierte Systeme oder überwältigende
                Informationsmengen – sondern durch klare, sofort nutzbare
                Lösungen.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Wir glauben, dass die besten digitalen Tools und Vorlagen diejenigen
                sind, die ein konkretes Problem lösen und sofort einsetzbar sind.
                Deshalb kuratieren wir statt zu sammeln.
              </p>
              <p className="text-gray-600 leading-relaxed">
                KlarKit hilft Selbstständigen, Creators, kleinen Unternehmen und
                ambitionierten Privatpersonen dabei, digitale Aufgaben schneller,
                klarer und professioneller zu lösen.
              </p>
            </div>
            <div className="space-y-4">
              {[
                {
                  icon: Target,
                  title: 'Klarer Nutzen',
                  desc: 'Jedes Produkt löst ein konkretes Problem.',
                },
                {
                  icon: Shield,
                  title: 'Transparenz',
                  desc: 'Affiliate-Links werden immer klar gekennzeichnet.',
                },
                {
                  icon: Heart,
                  title: 'Qualität über Quantität',
                  desc: 'Keine Masse, sondern sorgfältig ausgewählte Lösungen.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 p-4 bg-brand-lightgray rounded-xl">
                  <div className="w-10 h-10 bg-teal-DEFAULT/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-teal-DEFAULT" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-DEFAULT">{title}</p>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-brand-lightgray">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy-DEFAULT mb-10 text-center">
            Häufige Fragen
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="card p-6">
                <h3 className="font-semibold text-navy-DEFAULT mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-navy-DEFAULT mb-4">
            Kontakt
          </h2>
          <p className="text-gray-500 mb-10">
            Fragen, Feedback oder technische Probleme? Wir sind für dich da.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <a
              href="mailto:hallo@klarkit.de"
              className="card p-6 flex flex-col items-center gap-3 hover:border-teal-DEFAULT/30 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-teal-DEFAULT/10 rounded-xl flex items-center justify-center">
                <Mail size={20} className="text-teal-DEFAULT" />
              </div>
              <div>
                <p className="font-semibold text-navy-DEFAULT">E-Mail</p>
                <p className="text-sm text-teal-DEFAULT group-hover:underline">
                  hallo@klarkit.de
                </p>
              </div>
            </a>
            <div className="card p-6 flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-navy-DEFAULT/5 rounded-xl flex items-center justify-center">
                <MessageCircle size={20} className="text-navy-DEFAULT" />
              </div>
              <div>
                <p className="font-semibold text-navy-DEFAULT">Reaktionszeit</p>
                <p className="text-sm text-gray-500">
                  In der Regel innerhalb von 24h
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-navy-DEFAULT">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Bereit loszulegen?
          </h2>
          <p className="text-gray-300 mb-6">
            Entdecke unsere digitalen Produkte und Tools.
          </p>
          <Link href="/products" className="btn-primary">
            Produkte entdecken
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
