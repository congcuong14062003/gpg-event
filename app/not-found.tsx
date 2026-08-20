import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <Compass className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="text-xl font-bold text-foreground">Không tìm thấy trang</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
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
