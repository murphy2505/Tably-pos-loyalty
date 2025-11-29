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
