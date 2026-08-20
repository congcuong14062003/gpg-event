'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CartItem } from '@/types';
import { getProductById } from '@/data/products';

const STORAGE_KEY = 'gpg-solar-cart';

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  itemCount: number;
  isHydrated: boolean;
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((i) => i && i.productId && i.quantity > 0));
        }
      }
    } catch {
      // ignore malformed storage
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage may be full or unavailable
    }
  }, [items, isHydrated]);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.productId !== productId);
      }
      return prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );
    });
  }, []);

  const increment = useCallback((productId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  }, []);

  const decrement = useCallback((productId: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { totalQuantity, totalAmount, itemCount } = useMemo(() => {
    let qty = 0;
    let amount = 0;
    let count = 0;
    for (const item of items) {
      const product = getProductById(item.productId);
      if (!product) continue;
      qty += item.quantity;
      amount += product.price * item.quantity;
      count += 1;
    }
    return { totalQuantity: qty, totalAmount: amount, itemCount: count };
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalQuantity,
      totalAmount,
      itemCount,
      isHydrated,
      addToCart,
      updateQuantity,
      increment,
      decrement,
      removeItem,
      clearCart,
    }),
    [
      items,
      totalQuantity,
      totalAmount,
      itemCount,
      isHydrated,
      addToCart,
      updateQuantity,
      increment,
      decrement,
      removeItem,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
