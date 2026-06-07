import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tipps, Guides und Insights rund um digitale Produktivität und Online-Business.',
};

const staticArticles = [
  {
    id: 'static-1',
    title: '5 Notion-Templates, die deine Produktivität verdoppeln',
    excerpt: 'Entdecke die besten Notion-Vorlagen für Freelancer, Creator und Online-Business-Starter – getestet und für gut befunden.',
    category: 'Produktivität',
    read_time: '5 min',
    created_at: '2024-05-15',
    slug: 'notion-templates-produktivitaet',
    published: true,
  },
  {
    id: 'static-2',
    title: 'Als Freelancer starten: Die 10 wichtigsten Schritte',
    excerpt: 'Du willst Freelancer werden, weißt aber nicht wo du anfangen sollst? Dieser Guide begleitet dich Schritt für Schritt.',
    category: 'Freelancing',
    read_time: '8 min',
    created_at: '2024-05-08',
    slug: 'freelancer-starten-guide',
    published: true,
  },
  {
    id: 'static-3',
    title: 'KI-Tools sinnvoll im Alltag einsetzen',
    excerpt: 'ChatGPT, Claude, Gemini – welches Tool wofür? Ein praktischer Vergleich mit konkreten Anwendungsbeispielen.',
    category: 'KI-Tools',
    read_time: '6 min',
    created_at: '2024-04-28',
    slug: 'ki-tools-alltag',
    published: true,
  },
  {
    id: 'static-4',
    title: 'Content-Strategie für Selbstständige: In 30 Minuten pro Woche',
    excerpt: 'Content-Marketing muss nicht aufwändig sein. Wir zeigen dir, wie du mit minimalem Aufwand maximale Wirkung erzielst.',
    category: 'Marketing',
    read_time: '7 min',
    created_at: '2024-04-20',
    slug: 'content-strategie-selbststaendige',
    published: true,
  },
];

export default async function BlogPage() {
  const supabase = createClient();
  const { data: dbPosts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, category, created_at, published')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const articles = (dbPosts && dbPosts.length > 0) ? dbPosts : staticArticles;

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
            <Link key={article.id} href={`/blog/${article.slug}`}>
              <article className="card p-6 group hover:border-teal-DEFAULT/30 transition-all duration-200 h-full">
                <div className="flex items-center gap-2 mb-3">
                  {article.category && (
                    <span className="badge bg-teal-DEFAULT/10 text-teal-DEFAULT text-xs">
                      {article.category}
                    </span>
                  )}
                  {'read_time' in article && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={10} />
                      {(article as { read_time: string }).read_time} Lesezeit
                    </div>
                  )}
                </div>
                <h2 className="font-bold text-navy-DEFAULT text-lg mb-2 group-hover:text-teal-DEFAULT transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(article.created_at).toLocaleDateString('de-DE', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-teal-DEFAULT font-medium group-hover:gap-2 transition-all">
                    Lesen
                    <ArrowRight size={14} />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-brand-lightgray rounded-2xl">
          <h3 className="font-bold text-navy-DEFAULT mb-2">Mehr Inhalte kommen bald</h3>
          <p className="text-sm text-gray-500 mb-4">
            Melde dich für unseren Newsletter an und verpasse keinen neuen Artikel.
          </p>
          <form className="flex gap-3 max-w-sm mx-auto">
            <input type="email" placeholder="deine@email.de" className="input flex-1 text-sm" />
            <button type="submit" className="btn-primary text-sm py-2.5 px-4">Anmelden</button>
          </form>
        </div>
      </div>
    </div>
  );
}
