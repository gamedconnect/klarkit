import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', params.slug)
    .single();
  return {
    title: data?.title ?? 'Blogartikel',
    description: data?.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!post) notFound();

  const paragraphs = (post.content as string)
    .split(/\n{2,}/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <div className="pt-20 min-h-screen">
      {post.cover_image && (
        <div className="relative w-full h-72 md:h-96 bg-navy-DEFAULT">
          <Image src={post.cover_image} alt={post.title} fill className="object-cover opacity-60" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-navy-DEFAULT mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Zurück zum Blog
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {post.category && (
              <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-teal-50 text-teal-600 rounded-lg">
                <Tag size={10} />
                {post.category}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={11} />
              {new Date(post.created_at).toLocaleDateString('de-DE', {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-navy-DEFAULT leading-tight mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-gray-500 leading-relaxed border-l-4 border-teal-DEFAULT pl-4">
              {post.excerpt}
            </p>
          )}
        </header>

        <article className="prose-custom space-y-5">
          {paragraphs.map((para: string, i: number) => {
            if (para.startsWith('# '))
              return <h2 key={i} className="text-2xl font-bold text-navy-DEFAULT mt-8 mb-3">{para.slice(2)}</h2>;
            if (para.startsWith('## '))
              return <h3 key={i} className="text-xl font-bold text-navy-DEFAULT mt-6 mb-2">{para.slice(3)}</h3>;
            if (para.startsWith('### '))
              return <h4 key={i} className="text-lg font-semibold text-navy-DEFAULT mt-4 mb-2">{para.slice(4)}</h4>;
            if (para.startsWith('- ') || para.startsWith('* ')) {
              const items = para.split('\n').filter(l => l.trim());
              return (
                <ul key={i} className="space-y-2 pl-4">
                  {items.map((item, j) => (
                    <li key={j} className="flex gap-2 text-gray-600 text-[15px] leading-relaxed">
                      <span className="mt-2 w-1.5 h-1.5 bg-teal-DEFAULT rounded-full flex-shrink-0" />
                      {item.replace(/^[-*]\s/, '')}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="text-gray-600 text-[15px] leading-relaxed">
                {para.split('\n').map((line, j) => (
                  <span key={j}>{line}{j < para.split('\n').length - 1 && <br />}</span>
                ))}
              </p>
            );
          })}
        </article>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <Link href="/blog" className="btn-outline py-2.5 px-6 text-sm">
            ← Alle Artikel
          </Link>
        </div>
      </div>
    </div>
  );
}
