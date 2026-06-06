import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/admin/ProductForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Produkt bearbeiten' };

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', params.id).single(),
    supabase.from('categories').select('id, name, slug').order('sort_order'),
  ]);

  if (!product) notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-navy-DEFAULT mb-8">
        Produkt bearbeiten
      </h1>
      <ProductForm
        categories={categories || []}
        initialData={product as Record<string, unknown>}
      />
    </div>
  );
}
