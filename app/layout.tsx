import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/cart/cart-context';
import { SiteHeader } from '@/components/site-header';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'GPG Solar - Sản phẩm năng lượng mặt trời',
  description:
    'Khám phá các sản phẩm và giải pháp năng lượng mặt trời từ GPG Solar.',
  openGraph: {
    title: 'GPG Solar - Sản phẩm năng lượng mặt trời',
    description:
      'Khám phá các sản phẩm và giải pháp năng lượng mặt trời từ GPG Solar.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <CartProvider>
          <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster position="top-center" richColors />
        </CartProvider>
      </body>
    </html>
  );
}
