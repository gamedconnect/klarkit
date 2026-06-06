import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tipps, Guides und Insights rund um digitale Produktivität und Online-Business.',
};

const articles = [
  {
    title: '5 Notion-Templates, die deine Produktivität verdoppeln',
    excerpt: 'Entdecke die besten Notion-Vorlagen für Freelancer, Creator und Online-Business-Starter – getestet und für gut befunden.',
    category: 'Produktivität',
    readTime: '5 min',
    date: '2024-05-15',
    slug: 'notion-templates-produktivitaet',
  },
  {
    title: 'Als Freelancer starten: Die 10 wichtigsten Schritte',
    excerpt: 'Du willst Freelancer werden, weißt aber nicht wo du anfangen sollst? Dieser Guide begleitet dich Schritt für Schritt.',
    category: 'Freelancing',
    readTime: '8 min',
    date: '2024-05-08',
    slug: 'freelancer-starten-guide',
  },
  {
    title: 'KI-Tools sinnvoll im Alltag einsetzen',
    excerpt: 'ChatGPT, Claude, Gemini – welches Tool wofür? Ein praktischer Vergleich mit konkreten Anwendungsbeispielen.',
    category: 'KI-Tools',
    readTime: '6 min',
    date: '2024-04-28',
    slug: 'ki-tools-alltag',
  },
  {
    title: 'Content-Strategie für Selbstständige: In 30 Minuten pro Woche',
    excerpt: 'Content-Marketing muss nicht aufwändig sein. Wir zeigen dir, wie du mit minimalem Aufwand maximale Wirkung erzielst.',
    category: 'Marketing',
    readTime: '7 min',
    date: '2024-04-20',
    slug: 'content-strategie-selbststaendige',
  },
];

export default function BlogPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-brand-lightgray border-b border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-navy-DEFAULT mb-3">Blog</h1>
          <p className="text-gray-500 text-lg">
            Tipps, Guides und Insights für mehr Produktivität und digitales Business.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <article key={article.slug} className="card p-6 group hover:border-teal-DEFAULT/30 transition-all duration-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge bg-teal-DEFAULT/10 text-teal-DEFAULT text-xs">
                  {article.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={10} />
                  {article.readTime} Lesezeit
                </div>
              </div>
              <h2 className="font-bold text-navy-DEFAULT text-lg mb-2 group-hover:text-teal-DEFAULT transition-colors">
                {article.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {new Date(article.date).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1 text-sm text-teal-DEFAULT font-medium group-hover:gap-2 transition-all">
                  Lesen
                  <ArrowRight size={14} />
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-brand-lightgray rounded-2xl">
          <h3 className="font-bold text-navy-DEFAULT mb-2">Mehr Inhalte kommen bald</h3>
          <p className="text-sm text-gray-500 mb-4">
            Melde dich für unseren Newsletter an und verpasse keinen neuen Artikel.
          </p>
          <form className="flex gap-3 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="deine@email.de"
              className="input flex-1 text-sm"
            />
            <button type="submit" className="btn-primary text-sm py-2.5 px-4">
              Anmelden
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
