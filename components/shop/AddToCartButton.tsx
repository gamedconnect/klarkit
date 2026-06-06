'use client';

import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import toast from 'react-hot-toast';

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    toast.success('Zum Warenkorb hinzugefügt');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className="btn-primary w-full justify-center py-4 text-base"
    >
      {added ? (
        <>
          <Check size={18} />
          Hinzugefügt!
        </>
      ) : (
        <>
          <ShoppingCart size={18} />
          In den Warenkorb
        </>
      )}
    </button>
  );
}
