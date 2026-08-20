'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/components/cart/cart-context';
import { QuantitySelector } from '@/components/product/quantity-selector';

export function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    addToCart(product.id, qty);
    toast.success('Đã thêm sản phẩm vào giỏ hàng', {
      description: `${product.name} × ${qty}`,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <QuantitySelector
        value={qty}
        onIncrement={() => setQty((v) => v + 1)}
        onDecrement={() => setQty((v) => Math.max(1, v - 1))}
        onChange={setQty}
      />
      <button
        type="button"
        onClick={handleAdd}
        className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.99]"
      >
        <ShoppingCart className="h-5 w-5" />
        Thêm vào giỏ hàng
      </button>
    </div>
  );
}
