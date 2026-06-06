'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface SearchAndFilterProps {
  categories: Category[];
}

export function SearchAndFilter({ categories }: SearchAndFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [showFeatured, setShowFeatured] = useState(
    searchParams.get('featured') === 'true'
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (selectedCategory) params.set('category', selectedCategory);
    if (showFeatured) params.set('featured', 'true');

    const timeout = setTimeout(() => {
      router.push(`/products?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, selectedCategory, showFeatured, router]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setShowFeatured(false);
  };

  const hasFilters = search || selectedCategory || showFeatured;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Produkte suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all duration-200',
            isFilterOpen || hasFilters
              ? 'bg-navy-DEFAULT text-white border-navy-DEFAULT'
              : 'bg-white text-gray-700 border-gray-200 hover:border-navy-DEFAULT'
          )}
        >
          <SlidersHorizontal size={16} />
          Filter
          {hasFilters && (
            <span className="w-4 h-4 bg-teal-DEFAULT rounded-full text-[10px] text-white flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy-DEFAULT">Filter</h3>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-teal-DEFAULT hover:text-teal-500 font-medium flex items-center gap-1"
              >
                <X size={12} />
                Zurücksetzen
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Kategorie</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                    !selectedCategory
                      ? 'bg-navy-DEFAULT text-white'
                      : 'bg-brand-lightgray text-gray-600 hover:bg-gray-200'
                  )}
                >
                  Alle
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                      selectedCategory === cat.slug
                        ? 'bg-navy-DEFAULT text-white'
                        : 'bg-brand-lightgray text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Other filters */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Sortierung</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setShowFeatured(!showFeatured)}
                  className={cn(
                    'w-10 h-5 rounded-full transition-colors duration-200 relative cursor-pointer',
                    showFeatured ? 'bg-teal-DEFAULT' : 'bg-gray-200'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
                      showFeatured ? 'translate-x-5' : 'translate-x-0.5'
                    )}
                  />
                </div>
                <span className="text-sm text-gray-600">Nur Bestseller</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
