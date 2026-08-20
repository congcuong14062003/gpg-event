import { CartItem, Product } from '@/types';
import { getProductById } from '@/data/products';

export interface OrderLineItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CalculatedOrder {
  items: OrderLineItem[];
  totalAmount: number;
  totalQuantity: number;
}

export function calculateOrder(cartItems: CartItem[]): CalculatedOrder {
  const lineItems: OrderLineItem[] = [];
  let totalAmount = 0;
  let totalQuantity = 0;

  for (const item of cartItems) {
    const product = getProductById(item.productId);
    if (!product) {
      throw new Error(`Không tìm thấy sản phẩm: ${item.productId}`);
    }
    const unitPrice = product.price;
    const totalPrice = unitPrice * item.quantity;
    lineItems.push({ product, quantity: item.quantity, unitPrice, totalPrice });
    totalAmount += totalPrice;
    totalQuantity += item.quantity;
  }

  return { items: lineItems, totalAmount, totalQuantity };
}

export function validateOrderProducts(cartItems: CartItem[]): {
  valid: boolean;
  error?: string;
} {
  if (cartItems.length === 0) {
    return { valid: false, error: 'Giỏ hàng không được trống' };
  }

  for (const item of cartItems) {
    const product = getProductById(item.productId);
    if (!product) {
      return { valid: false, error: `Không tìm thấy sản phẩm: ${item.productId}` };
    }
    if (!product.isActive) {
      return { valid: false, error: `Sản phẩm không còn hoạt động: ${product.name}` };
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return {
        valid: false,
        error: `Số lượng không hợp lệ cho sản phẩm: ${product.name}`,
      };
    }
  }

  return { valid: true };
}

export function generateOrderCode(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(2);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GPG-${dd}${mm}${yy}-${random}`;
}
