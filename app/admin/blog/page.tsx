import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Eye, EyeOff, Pencil } from 'lucide-react';
import { deletePostAction, togglePublishedAction } from './actions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Blog – Admin' };

export default async function AdminBlogPage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, category, published, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-DEFAULT">Blog</h1>
          <p className="text-sm text-gray-400 mt-0.5">{posts?.length ?? 0} Beiträge</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary text-sm py-2.5">
          <Plus size={16} />
          Neuer Beitrag
        </Link>
      </div>

      <div className="card overflow-hidden">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="mb-3">Noch keine Blogbeiträge.</p>
            <Link href="/admin/blog/new" className="text-teal-DEFAULT hover:text-teal-500 text-sm">
              Ersten Beitrag erstellen →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-brand-lightgray/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Titel</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Kategorie</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Erstellt</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-50 last:border-0 hover:bg-brand-lightgray/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-medium text-navy-DEFAULT">{post.title}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">/blog/{post.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {post.category ? (
                      <span className="text-xs px-2 py-1 bg-teal-50 text-teal-600 rounded-lg font-medium">
                        {post.category}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <form action={togglePublishedAction.bind(null, post.id, !post.published)}>
                      <button
                        type="submit"
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
                          post.published
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {post.published ? <Eye size={11} /> : <EyeOff size={11} />}
                        {post.published ? 'Veröffentlicht' : 'Entwurf'}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString('de-DE')}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-navy-DEFAULT rounded-lg hover:bg-gray-100 transition-colors"
                        title="Bearbeiten"
                      >
                        <Pencil size={14} />
                      </Link>
                      <form action={deletePostAction.bind(null, post.id)}>
                        <button
                          type="submit"
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          title="Löschen"
                          onClick={(e) => { if (!confirm('Beitrag wirklich löschen?')) e.preventDefault(); }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
