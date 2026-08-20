'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/cart/cart-context';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

export function FloatingCart() {
  const { totalQuantity, totalAmount, isHydrated, items } = useCart();

  if (!isHydrated || items.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:pb-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/cart"
          className={cn(
            'pointer-events-auto flex items-center justify-between gap-3 rounded-2xl bg-foreground px-4 py-3 text-background shadow-lg ring-1 ring-black/5 transition-all hover:shadow-xl active:scale-[0.99] animate-fade-in-up'
          )}
        >
          <span className="flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground ring-2 ring-foreground">
                {totalQuantity}
              </span>
            </span>
            <span className="flex flex-col">
              <span className="text-xs text-background/70">
                {totalQuantity} sản phẩm
              </span>
              <span className="text-sm font-bold">
                {formatCurrency(totalAmount)}
              </span>
            </span>
          </span>
          <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Xem giỏ hàng
          </span>
        </Link>
      </div>
    </div>
  );
}
