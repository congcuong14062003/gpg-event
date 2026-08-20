'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Sun, Phone } from 'lucide-react';

export default function SuccessPage() {
  const [orderCode, setOrderCode] = useState<string | null>(null);

  useEffect(() => {
    const code = sessionStorage.getItem('gpg-order-code');
    if (code) {
      setOrderCode(code);
      sessionStorage.removeItem('gpg-order-code');
    }
  }, []);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center sm:py-24">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle2 className="h-12 w-12 text-accent" />
        </div>
        <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <Sun className="h-4.5 w-4.5" />
        </span>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Đăng ký thành công
      </h1>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Cảm ơn anh/chị đã quan tâm đến GPG Solar. Nhân viên của chúng tôi sẽ
        liên hệ lại trong thời gian sớm nhất.
      </p>

      {orderCode && (
        <div className="mt-8 w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Mã đăng ký
          </p>
          <p className="mt-1 text-2xl font-bold tracking-wider text-primary">
            {orderCode}
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/products"
          className="flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Xem lại sản phẩm
        </Link>
        <a
          href="tel:1900xxxx"
          className="flex h-12 items-center justify-center gap-2 rounded-full border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          <Phone className="h-4 w-4" />
          Liên hệ hotline
        </a>
      </div>
    </div>
  );
}
