'use client';

import Link from 'next/link';
import { ShoppingCart, Sun } from 'lucide-react';
import { useCart } from '@/components/cart/cart-context';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const { totalQuantity, isHydrated } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/products" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sun className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            GPG <span className="text-primary">SOLAR</span>
          </span>
        </Link>

        <Link
          href="/cart"
          className="relative flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-secondary"
          aria-label="Giỏ hàng"
        >
          <ShoppingCart className="h-4.5 w-4.5" />
          <span className="hidden sm:inline">Giỏ hàng</span>
          {isHydrated && totalQuantity > 0 && (
            <span
              className={cn(
                'flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-accent-foreground'
              )}
            >
              {totalQuantity}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
