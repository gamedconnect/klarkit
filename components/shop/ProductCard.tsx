'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Download, ExternalLink, Tag } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calculateDiscount, cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'horizontal';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.type === 'affiliate') return;
    addItem(product);
    toast.success(`"${product.name}" zum Warenkorb hinzugefügt`);
  };

  const discount =
    product.original_price
      ? calculateDiscount(product.original_price, product.price)
      : null;

  const isAffiliate = product.type === 'affiliate';

  if (variant === 'horizontal') {
    return (
      <Link href={`/products/${product.slug}`} className="group">
        <div className="card p-4 flex gap-4">
          <div className="w-20 h-20 bg-brand-lightgray rounded-xl overflow-hidden flex-shrink-0">
            {product.images?.[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={80}
                height={80}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-navy-DEFAULT text-sm truncate group-hover:text-teal-DEFAULT transition-colors">
              {product.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
              {product.short_description}
            </p>
            <p className="text-sm font-bold text-teal-DEFAULT mt-2">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="card group overflow-hidden flex flex-col h-full">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden aspect-video bg-brand-lightgray">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Download size={32} className="text-gray-300" />
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_featured && (
            <span className="badge bg-teal-DEFAULT text-white text-[10px]">
              Bestseller
            </span>
          )}
          {discount && (
            <span className="badge bg-red-500 text-white text-[10px]">
              -{discount}%
            </span>
          )}
          {isAffiliate && (
            <span className="badge bg-navy-DEFAULT text-white text-[10px]">
              Empfehlung
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category */}
        {product.category && (
          <p className="text-xs font-medium text-teal-DEFAULT uppercase tracking-wide mb-1.5">
            {product.category.name}
          </p>
        )}

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-navy-DEFAULT leading-tight hover:text-teal-DEFAULT transition-colors duration-200 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
          {product.short_description}
        </p>

        {/* Rating */}
        {product.review_count && product.review_count > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  className={cn(
                    star <= Math.round(product.average_rating || 0)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-200'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">
              ({product.review_count})
            </span>
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-brand-lightgray text-gray-500 text-[10px] rounded-full"
              >
                <Tag size={8} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price + Action */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div>
            <span className="text-lg font-bold text-navy-DEFAULT">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <span className="text-sm text-gray-400 line-through ml-2">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          {isAffiliate ? (
            <a
              href={product.affiliate_url || '#'}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-center gap-1.5 px-3 py-2 bg-navy-DEFAULT text-white text-sm font-medium rounded-lg hover:bg-navy-700 transition-colors duration-200"
            >
              Ansehen
              <ExternalLink size={12} />
            </a>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-3 py-2 bg-teal-DEFAULT text-white text-sm font-medium rounded-lg hover:bg-teal-500 transition-all duration-200 active:scale-95"
            >
              <ShoppingCart size={14} />
              Kaufen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
