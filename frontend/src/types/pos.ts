// frontend/src/types/pos.ts

export interface PosProduct {
  id: number;
  name: string;
  price: number;        // EUR
  category: string;     // "Friet", "Snacks", "Drinken", ...
  badge?: string;
  colorHint?: string;
  isActive?: boolean;
}

export interface PosOrderLine {
  productId: number;
  name: string;
  price: number;
  qty: number;
}

export interface PosOrderTotals {
  subtotal: number;
  discount: number;
  total: number;
}

export type PosOrderStatus = "open" | "paid" | "parked" | "cancelled";

export interface PosOrder {
  id: string;
  status: PosOrderStatus;
  lines: PosOrderLine[];
  totals: PosOrderTotals;
  createdAt: string;
  updatedAt: string;
  source?: "counter" | "phone" | "web" | "kiosk";
}

export interface RevenueGroup {
  id: string;
  name: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  sortOrder: number;
  isActive: boolean;
  revenueGroupId?: string;
  revenueGroup?: RevenueGroup;
}

export interface ProductVariant {
  id: string;
  name: string;
  priceInclVat: number;
  vatRate: number;
  sortOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  isPopular: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  allowDiscount: boolean;
  printGroup?: string;
  categoryId: string;
  category?: Category;
  revenueGroupId?: string;
  revenueGroup?: RevenueGroup;
  variants: ProductVariant[];
}
