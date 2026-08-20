import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Check } from 'lucide-react';
import { getProductBySlug, getActiveProducts } from '@/data/products';
import { formatCurrency } from '@/lib/format';
import { ProductDetailClient } from '@/components/product/product-detail-client';
import { FloatingCart } from '@/components/cart/floating-cart';

export function generateStaticParams() {
  return getActiveProducts().map((p) => ({ slug: p.slug }));
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const specs = Object.entries(product.specifications ?? {});

  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:pt-8">
      <Link
        href="/products"
        className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Quay lại danh sách
      </Link>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {product.isFeatured && (
            <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
              Nổi bật
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {product.category}
            </span>
            <span className="text-xs text-muted-foreground">{product.code}</span>
          </div>
          <h1 className="text-xl font-bold leading-tight text-foreground sm:text-2xl">
            {product.name}
          </h1>

          <div className="mt-4 rounded-xl bg-secondary/60 p-4">
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(product.price)}
            </p>
            <p className="text-sm text-muted-foreground">/ {product.unit}</p>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-6">
            <ProductDetailClient product={product} />
          </div>
        </div>
      </div>

      {specs.length > 0 && (
        <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:mt-10 sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            Thông số kỹ thuật
          </h2>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-2">
            {specs.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between border-b border-border/60 py-3"
              >
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-accent" />
                  {key}
                </dt>
                <dd className="text-sm font-medium text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <FloatingCart />
    </div>
  );
}
