export type PaymentMethod = "cash" | "card" | "sumup" | "qr";

export interface OrderLine {
  productId: number;
  name: string;
  price: number; // EUR
  qty: number;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  total: number;
}

export type OrderStatus = "open" | "paid" | "parked" | "cancelled";

export interface PosOrder {
  id: string;
  ticketNumber: number;
  status: OrderStatus;
  lines: OrderLine[];
  totals: OrderTotals;
  paymentMethod?: PaymentMethod;
  source: "counter" | "phone" | "web" | "kiosk";
  createdAt: Date;
  updatedAt: Date;
}
