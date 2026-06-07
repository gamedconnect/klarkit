'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Search, User, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';

const navigation = [
  {
    label: 'Produkte',
    href: '/products',
    children: [
      { label: 'Alle Produkte', href: '/products' },
      { label: 'Vorlagen', href: '/products?category=templates' },
      { label: 'Guides & E-Books', href: '/products?category=guides' },
      { label: 'Mini-Kurse', href: '/products?category=courses' },
    ],
  },
  { label: 'Tool-Empfehlungen', href: '/tools' },
  { label: 'Bestseller', href: '/products?featured=true' },
  { label: 'Blog', href: '/blog' },
  { label: 'Über KlarKit', href: '/about' },
];

export function Header({ logoUrl }: { logoUrl?: string | null }) {
  const { getTotalItems, openCart } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-white'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Logo"
                width={140}
                height={40}
                className="h-9 w-auto object-contain"
                unoptimized
              />
            ) : (
              <>
                <div className="w-8 h-8 bg-navy-DEFAULT rounded-lg flex items-center justify-center group-hover:bg-teal-DEFAULT transition-colors duration-200">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <span className="text-xl font-bold text-navy-DEFAULT">
                  Klar<span className="text-teal-DEFAULT">Kit</span>
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-navy-DEFAULT rounded-lg hover:bg-brand-lightgray transition-all duration-200">
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={cn(
                        'transition-transform duration-200',
                        openDropdown === item.label ? 'rotate-180' : ''
                      )}
                    />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fade-in">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-lightgray hover:text-navy-DEFAULT transition-colors duration-150"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-navy-DEFAULT rounded-lg hover:bg-brand-lightgray transition-all duration-200"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className="hidden sm:flex items-center justify-center w-9 h-9 text-gray-500 hover:text-navy-DEFAULT hover:bg-brand-lightgray rounded-lg transition-all duration-200"
              aria-label="Suchen"
            >
              <Search size={18} />
            </Link>
            <Link
              href="/account"
              className="hidden sm:flex items-center justify-center w-9 h-9 text-gray-500 hover:text-navy-DEFAULT hover:bg-brand-lightgray rounded-lg transition-all duration-200"
              aria-label="Konto"
            >
              <User size={18} />
            </Link>
            <button
              onClick={openCart}
              className="relative flex items-center justify-center w-9 h-9 text-gray-500 hover:text-navy-DEFAULT hover:bg-brand-lightgray rounded-lg transition-all duration-200"
              aria-label="Warenkorb"
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-teal-DEFAULT text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden flex items-center justify-center w-9 h-9 text-gray-500 hover:text-navy-DEFAULT hover:bg-brand-lightgray rounded-lg transition-all duration-200"
              aria-label="Menü"
            >
              {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-fade-in">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </p>
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-navy-DEFAULT hover:bg-brand-lightgray rounded-lg transition-colors duration-150 ml-2"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-navy-DEFAULT hover:bg-brand-lightgray rounded-lg transition-colors duration-150"
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-gray-100 flex gap-2">
              <Link
                href="/auth/login"
                onClick={() => setIsMobileOpen(false)}
                className="flex-1 btn-outline text-sm py-2.5 text-center"
              >
                Anmelden
              </Link>
              <Link
                href="/products"
                onClick={() => setIsMobileOpen(false)}
                className="flex-1 btn-primary text-sm py-2.5 text-center"
              >
                Shop
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
