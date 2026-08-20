'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  Trash2,
  ShoppingCart,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '@/components/cart/cart-context';
import { getProductById } from '@/data/products';
import { formatCurrency } from '@/lib/format';
import { QuantitySelector } from '@/components/product/quantity-selector';
import { cn } from '@/lib/utils';
import { CustomerInfo } from '@/types';

export default function CartPage() {
  const {
    items,
    subtotalAmount,
    discountAmount,
    totalAmount,
    totalQuantity,
    itemCount,
    isHydrated,
    increment,
    decrement,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const router = useRouter();

  const [form, setForm] = useState<CustomerInfo>({
    dealerName: '',
    name: '',
    phone: '',
    note: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const lineItems = items
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return { item, product, total: product.price * item.quantity };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.dealerName.trim()) e.dealerName = 'Vui lòng nhập tên đại lý';
    else if (form.dealerName.trim().length < 2) e.dealerName = 'Tên đại lý quá ngắn';
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ và tên';
    else if (form.name.trim().length < 2) e.name = 'Họ và tên quá ngắn';
    if (!form.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/.test(form.phone.trim()))
      e.phone = 'Số điện thoại không hợp lệ';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lineItems.length === 0) {
      toast.error('Giỏ hàng đang trống');
      return;
    }
    if (!validate()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            dealerName: form.dealerName.trim(),
            name: form.name.trim(),
            phone: form.phone.trim(),
            note: form.note?.trim() || undefined,
          },
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }
      clearCart();
      sessionStorage.setItem('gpg-order-code', data.orderCode);
      toast.success('Đăng ký thành công!');
      router.push('/success');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Không thể gửi đăng ký. Vui lòng thử lại.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isHydrated && itemCount === 0) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Giỏ hàng đang trống</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Hãy chọn sản phẩm để bắt đầu đăng ký.
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:pt-8">
      <Link
        href="/products"
        className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Tiếp tục chọn sản phẩm
      </Link>

      <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Giỏ hàng
      </h1>

      {!isHydrated ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            {lineItems.map(({ item, product, total }) => (
              <div
                key={item.productId}
                className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:gap-4 sm:p-4"
              >
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted sm:h-24 sm:w-24">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{product.code}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="flex-shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Xóa sản phẩm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {formatCurrency(product.price)}
                    <span className="text-xs font-normal text-muted-foreground">
                      {' '}/ {product.unit}
                    </span>
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <QuantitySelector
                      value={item.quantity}
                      onIncrement={() => increment(item.productId)}
                      onDecrement={() => decrement(item.productId)}
                      onChange={(v) => updateQuantity(item.productId, v)}
                      size="sm"
                    />
                    <p className="text-sm font-bold text-foreground">
                      {formatCurrency(total)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  toast.info('Đã xóa toàn bộ giỏ hàng');
                }}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
              >
                Xóa tất cả
              </button>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ShoppingCart className="h-4 w-4" />
                <span>{totalQuantity} sản phẩm</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Tạm tính</span>
                <span>{formatCurrency(subtotalAmount)}</span>
              </div>
              <div className="flex items-center justify-between font-medium text-green-600">
                <span>Giảm giá 5%</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-foreground">Tổng thanh toán</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="mb-1 text-lg font-semibold text-foreground">
              Thông tin liên hệ
            </h2>
            <p className="mb-5 text-xs text-muted-foreground">
              Nhân viên GPG Solar sẽ liên hệ lại trong thời gian sớm nhất.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Tên đại lý"
                required
                error={errors.dealerName}
                value={form.dealerName}
                onChange={(v) => setForm({ ...form, dealerName: v })}
                placeholder="Đại lý ABC"
              />
              <FormField
                label="Tên khách hàng"
                required
                error={errors.name}
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
              />
              <FormField
                label="Số điện thoại"
                required
                error={errors.phone}
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="0912345678"
                type="tel"
                autoComplete="tel"
              />
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Ghi chú
                </label>
                <textarea
                  value={form.note ?? ''}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Quan tâm hệ thống 10kW..."
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || lineItems.length === 0}
              className={cn(
                'mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60'
              )}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang gửi đăng ký...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Đăng ký ngay
                </>
              )}
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Bằng việc đăng ký, anh/chị đồng ý được GPG Solar liên hệ tư vấn.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  error,
  autoComplete,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          'h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          error ? 'border-destructive' : 'border-input'
        )}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
