'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { slugify } from '@/lib/utils';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: Record<string, unknown>;
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: (initialData?.name as string) || '',
    slug: (initialData?.slug as string) || '',
    short_description: (initialData?.short_description as string) || '',
    description: (initialData?.description as string) || '',
    price: (initialData?.price as number) || 0,
    original_price: (initialData?.original_price as number | null) || null,
    category_id: (initialData?.category_id as string) || '',
    type: (initialData?.type as string) || 'digital',
    affiliate_url: (initialData?.affiliate_url as string) || '',
    tags: (initialData?.tags as string[])?.join(', ') || '',
    is_featured: (initialData?.is_featured as boolean) || false,
    is_active: (initialData?.is_active as boolean) ?? true,
    images: (initialData?.images as string[])?.join('\n') || '',
  });

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: !initialData ? slugify(name) : f.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      slug: form.slug,
      short_description: form.short_description,
      description: form.description,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      category_id: form.category_id || null,
      type: form.type,
      affiliate_url: form.affiliate_url || null,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      is_featured: form.is_featured,
      is_active: form.is_active,
      images: form.images
        .split('\n')
        .map((u) => u.trim())
        .filter(Boolean),
    };

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', initialData.id as string);
        if (error) throw error;
        toast.success('Produkt aktualisiert');
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        toast.success('Produkt erstellt');
      }
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      toast.error('Fehler beim Speichern');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy-DEFAULT mb-6"
      >
        <ArrowLeft size={14} />
        Zurück zu Produkten
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6 space-y-5">
            <h2 className="font-bold text-navy-DEFAULT border-b border-gray-100 pb-3">
              Produktinformationen
            </h2>
            <div>
              <label className="label">Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="z.B. Content Planner Kit"
                className="input"
              />
            </div>
            <div>
              <label className="label">URL-Slug *</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="content-planner-kit"
                className="input font-mono text-sm"
              />
            </div>
            <div>
              <label className="label">Kurzbeschreibung *</label>
              <textarea
                required
                rows={2}
                value={form.short_description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, short_description: e.target.value }))
                }
                placeholder="Prägnante Beschreibung für Produktlisten..."
                className="input resize-none"
              />
            </div>
            <div>
              <label className="label">Beschreibung *</label>
              <textarea
                required
                rows={10}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Detaillierte Produktbeschreibung. Markdown wird unterstützt."
                className="input resize-y font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                Verwende **fett** für Überschriften und - für Listenpunkte
              </p>
            </div>
            <div>
              <label className="label">Produktbilder (URLs, eine pro Zeile)</label>
              <textarea
                rows={3}
                value={form.images}
                onChange={(e) =>
                  setForm((f) => ({ ...f, images: e.target.value }))
                }
                placeholder="https://..."
                className="input resize-none font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="card p-6 space-y-4">
            <h2 className="font-bold text-navy-DEFAULT border-b border-gray-100 pb-3">
              Einstellungen
            </h2>

            <div>
              <label className="label">Kategorie</label>
              <select
                value={form.category_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category_id: e.target.value }))
                }
                className="input"
              >
                <option value="">Keine Kategorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Produkttyp</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
                className="input"
              >
                <option value="digital">Digitales Produkt</option>
                <option value="affiliate">Affiliate-Empfehlung</option>
              </select>
            </div>

            {form.type === 'affiliate' && (
              <div>
                <label className="label">Affiliate-URL</label>
                <input
                  type="url"
                  value={form.affiliate_url}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, affiliate_url: e.target.value }))
                  }
                  placeholder="https://..."
                  className="input"
                />
              </div>
            )}

            <div>
              <label className="label">Preis (€) *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: Number(e.target.value) }))
                }
                className="input"
              />
            </div>

            <div>
              <label className="label">Originalpreis (€)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.original_price || ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    original_price: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="Für Rabatt-Anzeige"
                className="input"
              />
            </div>

            <div>
              <label className="label">Tags (kommagetrennt)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="notion, vorlage, produktivität"
                className="input"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() =>
                    setForm((f) => ({ ...f, is_active: !f.is_active }))
                  }
                  className={`w-10 h-5 rounded-full transition-colors duration-200 relative cursor-pointer ${
                    form.is_active ? 'bg-teal-DEFAULT' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      form.is_active ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Aktiv (im Shop sichtbar)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() =>
                    setForm((f) => ({ ...f, is_featured: !f.is_featured }))
                  }
                  className={`w-10 h-5 rounded-full transition-colors duration-200 relative cursor-pointer ${
                    form.is_featured ? 'bg-teal-DEFAULT' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      form.is_featured ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Bestseller (auf Startseite)
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3.5"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={16} />
                Produkt speichern
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
