import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import {
  ShoppingCart,
  Download,
  Star,
  Check,
  ExternalLink,
  ArrowLeft,
  Share2,
  Tag,
  Users,
  Clock,
  Shield,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/shop/ProductCard';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import Link from 'next/link';

interface PageProps {
  params: { slug: string };
}

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      reviews(*, profile:profiles(full_name, avatar_url))
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!data) return null;

  const avgRating =
    data.reviews?.length > 0
      ? data.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
        data.reviews.length
      : 0;

  return {
    ...data,
    average_rating: avgRating,
    review_count: data.reviews?.length || 0,
  };
}

async function getRelatedProducts(product: Product): Promise<Product[]> {
  if (!product.category_id) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('category_id', product.category_id)
    .eq('is_active', true)
    .neq('id', product.id)
    .limit(3);
  return data || [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Produkt nicht gefunden' };
  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.short_description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product);
  const discount = product.original_price
    ? calculateDiscount(product.original_price, product.price)
    : null;

  const descriptionParagraphs = product.description
    .split('\n')
    .filter((p: string) => p.trim());

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/products" className="hover:text-navy-DEFAULT flex items-center gap-1">
            <ArrowLeft size={14} />
            Produkte
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-navy-DEFAULT"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-navy-DEFAULT truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-video bg-brand-lightgray rounded-2xl overflow-hidden relative">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Download size={48} className="text-gray-300" />
                </div>
              )}
              {product.type === 'affiliate' && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-navy-DEFAULT text-white text-xs font-semibold rounded-full">
                  Empfehlung
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(1, 5).map((img: string, i: number) => (
                  <div
                    key={i}
                    className="aspect-square bg-brand-lightgray rounded-xl overflow-hidden relative"
                  >
                    <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm font-medium text-teal-DEFAULT uppercase tracking-wide hover:text-teal-500"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-3xl font-bold text-navy-DEFAULT mt-2 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.review_count && product.review_count > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={
                        s <= Math.round(product.average_rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-200'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {product.average_rating?.toFixed(1)} ({product.review_count}{' '}
                  {product.review_count === 1 ? 'Bewertung' : 'Bewertungen'})
                </span>
              </div>
            )}

            <p className="text-gray-600 leading-relaxed mb-6">
              {product.short_description}
            </p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-bold text-navy-DEFAULT">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                  <span className="px-2.5 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-lg">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { icon: Download, text: 'Sofortdownload' },
                { icon: Shield, text: 'Sicherer Kauf' },
                { icon: Clock, text: 'Lifetime Access' },
                { icon: Users, text: product.download_count + '+ Downloads' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 text-sm text-gray-600 bg-brand-lightgray px-3 py-1.5 rounded-lg"
                >
                  <Icon size={13} className="text-teal-DEFAULT" />
                  {text}
                </div>
              ))}
            </div>

            {/* CTA */}
            {product.type === 'affiliate' ? (
              <div className="space-y-3">
                <a
                  href={product.affiliate_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="btn-secondary w-full justify-center py-4 text-base"
                >
                  Jetzt ansehen
                  <ExternalLink size={16} />
                </a>
                <p className="text-xs text-gray-400 text-center">
                  * Affiliate-Link. Wir erhalten möglicherweise eine Provision.
                  Für dich entstehen keine Mehrkosten.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <AddToCartButton product={product} />
                <p className="text-xs text-gray-400 text-center">
                  Sofortiger Download nach Zahlung. Keine Versandkosten.
                </p>
              </div>
            )}

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100">
                <Tag size={14} className="text-gray-400 mt-0.5" />
                {product.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/products?q=${tag}`}
                    className="text-xs text-gray-500 hover:text-teal-DEFAULT transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-navy-DEFAULT mb-6">
              Produktbeschreibung
            </h2>
            <div className="prose-klarkit">
              {descriptionParagraphs.map((para: string, i: number) => {
                if (para.startsWith('**') && para.endsWith('**')) {
                  return (
                    <h3 key={i} className="text-xl font-semibold text-navy-DEFAULT mt-6 mb-3">
                      {para.replace(/\*\*/g, '')}
                    </h3>
                  );
                }
                if (para.startsWith('- ')) {
                  return (
                    <div key={i} className="flex items-start gap-2 mb-2">
                      <Check size={16} className="text-teal-DEFAULT mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{para.slice(2)}</span>
                    </div>
                  );
                }
                return (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4">
                    {para}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-navy-DEFAULT mb-4">
                Das ist enthalten
              </h3>
              <ul className="space-y-2.5">
                {[
                  'Sofortiger Download',
                  'Lifetime-Zugang',
                  'Alle zukünftigen Updates',
                  'Nutzung für 1 Person',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={14} className="text-teal-DEFAULT flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6 bg-brand-lightgray border-0">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-teal-DEFAULT" />
                <h3 className="font-bold text-navy-DEFAULT text-sm">
                  Sicherer Kauf
                </h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                SSL-verschlüsselte Zahlung. DSGVO-konform. Du kannst digitale
                Produkte nach dem Download nicht zurückgeben (§ 356 Abs. 5 BGB).
              </p>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-navy-DEFAULT mb-3 text-sm">
                Teilen
              </h3>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-brand-lightgray text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                  <Share2 size={12} />
                  Teilen
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-navy-DEFAULT mb-6">
              Kundenbewertungen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.map((review: {
                id: string;
                rating: number;
                title: string | null;
                body: string | null;
                created_at: string;
                profile?: { full_name: string | null };
              }) => (
                <div key={review.id} className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={
                            s <= review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-200'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                  {review.title && (
                    <p className="font-semibold text-navy-DEFAULT text-sm mb-1">
                      {review.title}
                    </p>
                  )}
                  {review.body && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {review.body}
                    </p>
                  )}
                  {review.profile?.full_name && (
                    <p className="text-xs text-gray-400 mt-3">
                      – {review.profile.full_name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-navy-DEFAULT mb-6">
              Das könnte dich auch interessieren
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
