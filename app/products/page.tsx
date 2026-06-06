import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/shop/ProductCard';
import { SearchAndFilter } from '@/components/shop/SearchAndFilter';
import { Product, Category } from '@/types';
import { Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Alle Produkte',
  description:
    'Entdecke unsere Sammlung an digitalen Vorlagen, Guides, Mini-Kursen und Tool-Empfehlungen.',
};

interface PageProps {
  searchParams: {
    q?: string;
    category?: string;
    featured?: string;
  };
}

async function getProducts(searchParams: PageProps['searchParams']): Promise<Product[]> {
  const supabase = createClient();

  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (searchParams.q) {
    query = query.textSearch('search_vector', searchParams.q);
  }

  if (searchParams.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', searchParams.category)
      .single();
    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }

  if (searchParams.featured === 'true') {
    query = query.eq('is_featured', true);
  }

  const { data } = await query;
  return data || [];
}

async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');
  return data || [];
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);

  const pageTitle = searchParams.featured === 'true'
    ? 'Bestseller'
    : searchParams.category
    ? categories.find((c) => c.slug === searchParams.category)?.name || 'Produkte'
    : searchParams.q
    ? `Suchergebnisse für "${searchParams.q}"`
    : 'Alle Produkte';

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Header */}
      <div className="bg-brand-lightgray border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-navy-DEFAULT mb-2">
            {pageTitle}
          </h1>
          <p className="text-gray-500">
            {products.length}{' '}
            {products.length === 1 ? 'Produkt' : 'Produkte'} gefunden
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filter */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-12 bg-gray-100 rounded-xl animate-pulse" />}>
            <SearchAndFilter categories={categories} />
          </Suspense>
        </div>

        {/* Category Quick Links */}
        {!searchParams.category && !searchParams.q && (
          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="px-4 py-2 bg-brand-lightgray text-navy-DEFAULT text-sm font-medium rounded-xl hover:bg-navy-DEFAULT hover:text-white transition-all duration-200"
              >
                {cat.name}
              </a>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-brand-lightgray rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-navy-DEFAULT mb-2">
              Keine Produkte gefunden
            </h2>
            <p className="text-gray-400 mb-6">
              Versuche andere Suchbegriffe oder Filter.
            </p>
            <a href="/products" className="btn-primary">
              Alle Produkte anzeigen
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
