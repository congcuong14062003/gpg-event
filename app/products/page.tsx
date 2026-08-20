'use client';

import { useMemo, useState } from 'react';
import { Search, PackageX } from 'lucide-react';
import { getActiveProducts, productCategories } from '@/data/products';
import { ProductCard } from '@/components/product/product-card';
import { FloatingCart } from '@/components/cart/floating-cart';
import { cn } from '@/lib/utils';

const ALL_CATEGORY = 'Tất cả';

export default function ProductsPage() {
  const allProducts = useMemo(() => getActiveProducts(), []);
  const categories = useMemo(() => [ALL_CATEGORY, ...productCategories], []);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allProducts.filter((p) => {
      if (activeCategory !== ALL_CATEGORY && p.category !== activeCategory) {
        return false;
      }
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [allProducts, search, activeCategory]);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Sản phẩm năng lượng mặt trời
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Chọn sản phẩm, thêm vào giỏ và đăng ký nhận tư vấn từ GPG Solar.
        </p>
      </div>

      <div className="mb-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all',
                activeCategory === cat
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
          <PackageX className="mb-3 h-10 w-10 text-muted-foreground/60" />
          <p className="text-sm font-medium text-foreground">
            Không tìm thấy sản phẩm phù hợp.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Thử thay đổi từ khoá hoặc danh mục.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-xs text-muted-foreground">
            {filtered.length} sản phẩm
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      <FloatingCart />
    </div>
  );
}
