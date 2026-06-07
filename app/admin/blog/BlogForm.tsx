'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';
import toast from 'react-hot-toast';

type Post = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image: string;
  published: boolean;
};

type Props = {
  post?: Post;
  action: (formData: FormData) => Promise<void>;
};

const CATEGORIES = ['Produktivität', 'Freelancing', 'KI-Tools', 'Marketing', 'Business', 'Tools'];

export default function BlogForm({ post, action }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugManual, setSlugManual] = useState(!!post?.slug);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManual) setSlug(slugify(val));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await action(fd);
        toast.success(post ? 'Beitrag aktualisiert' : 'Beitrag erstellt');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Fehler beim Speichern');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="label">Titel *</label>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Mein Blogartikel"
            className="input"
          />
        </div>

        <div>
          <label className="label">Slug *</label>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
            placeholder="mein-blogartikel"
            className="input font-mono text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">URL: /blog/{slug || '…'}</p>
        </div>

        <div>
          <label className="label">Kategorie</label>
          <select name="category" defaultValue={post?.category ?? ''} className="input">
            <option value="">– keine –</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="label">Kurzbeschreibung (Excerpt)</label>
          <textarea
            name="excerpt"
            defaultValue={post?.excerpt ?? ''}
            rows={2}
            placeholder="Kurze Zusammenfassung für die Listenansicht…"
            className="input resize-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Inhalt (Markdown)</label>
          <textarea
            name="content"
            defaultValue={post?.content ?? ''}
            rows={16}
            placeholder="# Überschrift&#10;&#10;Text mit **fett** und *kursiv*…"
            className="input resize-y font-mono text-sm leading-relaxed"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Cover-Bild URL</label>
          <input
            name="cover_image"
            type="url"
            defaultValue={post?.cover_image ?? ''}
            placeholder="https://..."
            className="input"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            name="published"
            value="true"
            defaultChecked={post?.published ?? false}
            className="w-4 h-4 accent-teal-500 rounded"
          />
          <span className="text-sm font-medium text-navy-DEFAULT">Veröffentlicht</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary py-2.5"
        >
          {isPending ? 'Speichern…' : post ? 'Aktualisieren' : 'Erstellen'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/blog')}
          className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-navy-DEFAULT rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
