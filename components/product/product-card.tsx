'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/components/cart/cart-context';
import { QuantitySelector } from '@/components/product/quantity-selector';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    addToCart(product.id, qty);
    toast.success('Đã thêm sản phẩm vào giỏ hàng', {
      description: `${product.name} × ${qty}`,
    });
    setQty(1);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
            Nổi bật
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            {product.category}
          </span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">{product.code}</p>

        <div className="mt-2">
          <p className="text-base font-bold text-primary">
            {formatCurrency(product.price)}
          </p>
          <p className="text-xs text-muted-foreground">/ {product.unit}</p>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <QuantitySelector
            value={qty}
            onIncrement={() => setQty((v) => v + 1)}
            onDecrement={() => setQty((v) => Math.max(1, v - 1))}
            onChange={setQty}
            size="sm"
          />
          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]'
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Thêm vào giỏ</span>
          </button>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Xem chi tiết
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
