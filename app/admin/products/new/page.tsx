import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/admin/ProductForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Neues Produkt' };

export default async function NewProductPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('sort_order');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-navy-DEFAULT mb-8">
        Neues Produkt erstellen
      </h1>
      <ProductForm categories={categories || []} />
    </div>
  );
}
