export interface Product {
  id: string;
  name: string;
  code: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  unit: string;
  category: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  specifications?: Record<string, string>;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CustomerInfo {
  dealerName: string;
  name: string;
  phone: string;
  note?: string;
}

export interface RegisterRequest {
  customer: CustomerInfo;
  items: CartItem[];
}

export interface RegisterResponse {
  success: boolean;
  orderCode?: string;
  message?: string;
}
